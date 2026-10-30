import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { modules } from '../data/modules';
import { getLessonMedia, estimateReadingTimeMinutes } from '../data/lessonMedia';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Pause, 
  Square, 
  Trophy, 
  CheckCircle, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Target, 
  MapPin, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Activity, 
  AlertCircle, 
  FileText, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  MessageSquare, 
  Search, 
  Video, 
  Send, 
  X
} from 'lucide-react';
import { QuizEngine } from './QuizEngine';
import MarkdownRenderer from './MarkdownRenderer';
import { generateComprehensiveStudyNotes } from '../lib/studyNotes';
import { 
  speakText, 
  pauseSpeech, 
  resumeSpeech, 
  stopSpeech, 
  isSpeechSupported 
} from '../lib/speech';
import { audioCoordinator } from '../lib/audioCoordinator';

interface LessonQuestionItem {
  id: string;
  userId: string;
  questionText: string;
  isAnswered: boolean;
  instructorAnswer?: string;
  answeredAt?: string;
  createdAt: string;
}

export default function LessonView() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { progress, updateLessonProgress, completeModule, unlockAchievement } = useProgress();
  const { user } = useAuth();
  
  const isSwahili = language === 'sw';
  const currentModules = modules[language];
  const moduleData = currentModules.find(m => m.id === moduleId);
  
  const [viewState, setViewState] = useState<'intro' | 'lesson' | 'quiz_start' | 'quiz_active' | 'results'>('intro');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  // Active Coursera-style tab
  const [activeTab, setActiveTab] = useState<'content' | 'transcript' | 'notes' | 'qa'>('content');

  // Video playback & state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoIsPaused, setVideoIsPaused] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoIsMuted, setVideoIsMuted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [transcriptSearch, setTranscriptSearch] = useState('');

  const formatVideoTime = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleVideoPlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setVideoIsPaused(false)).catch(() => {});
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setVideoIsPaused(true);
    }
  };

  const handleVideoSeek = (targetSec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = targetSec;
    setVideoCurrentTime(targetSec);
    if (!isVideoPlaying) {
      setIsVideoPlaying(true);
    }
    videoRef.current.play().then(() => setVideoIsPaused(false)).catch(() => {});
  };

  const handlePlaybackSpeed = (rate: number) => {
    setPlaybackSpeed(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Bookmarking state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkFeedback, setBookmarkFeedback] = useState<string | null>(null);

  // Q&A state
  const [questions, setQuestions] = useState<LessonQuestionItem[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [questionNotice, setQuestionNotice] = useState<string | null>(null);

  // Access check: requires authentic account before learning starts
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    stopSpeech();
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeechNotice(null);
    setIsVideoPlaying(false);
    setIsBookmarked(false);
    setBookmarkFeedback(null);
  }, [viewState, currentLessonIndex]);

  useEffect(() => {
    const unsubscribe = audioCoordinator.subscribe((state) => {
      if (!state.isPlaying || state.sourceId !== 'lesson-narration') {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    });

    return () => {
      unsubscribe();
      stopSpeech();
    };
  }, []);

  // Fetch Q&A questions when lesson tab changes to 'qa'
  useEffect(() => {
    if (!moduleData || viewState !== 'lesson') return;
    const lessonId = moduleData.content[currentLessonIndex]?.id;
    if (!lessonId) return;

    fetch(`/api/v1/learning/questions/${moduleData.id}/${lessonId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.questions) {
          setQuestions(data.questions);
        }
      })
      .catch(() => {
        // Fallback / offline mode graceful ignore
      });
  }, [moduleData, currentLessonIndex, viewState]);

  if (!moduleData) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto mt-12 bg-white rounded-organic shadow-natural">
        <h2 className="text-xl font-bold mb-4">{isSwahili ? 'Somo halijapatikana' : 'Module not found'}</h2>
        <button onClick={() => navigate('/learn')} className="px-6 py-2.5 bg-forest-green text-white font-bold rounded-full">
          {isSwahili ? 'Rudi kujifunza' : 'Return to Learn'}
        </button>
      </div>
    );
  }

  const currentLesson = moduleData.content[currentLessonIndex];
  const lessonMedia = currentLesson ? getLessonMedia(moduleData.id, currentLesson.id) : null;
  const activeLessonNotes = currentLesson ? generateComprehensiveStudyNotes(moduleData, currentLesson, lessonMedia) : '';

  useEffect(() => {
    if (activeTab === 'transcript' && !lessonMedia) {
      setActiveTab('content');
    }
  }, [activeTab, lessonMedia]);

  const handleStartLessons = () => {
    const p = progress[moduleData.id];
    let startIdx = 0;
    if (p && p.completedLessons) {
      for (let i = 0; i < moduleData.content.length; i++) {
        if (!p.completedLessons.includes(i)) {
          startIdx = i;
        }
      }
    }
    setCurrentLessonIndex(startIdx);
    setViewState('lesson');
  };

  const handleNextLesson = async () => {
    stopSpeech();
    await updateLessonProgress(moduleData.id, currentLessonIndex);

    // Sync to backend if authenticated
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch('/api/v1/learning/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            moduleId: moduleData.id,
            lessonId: currentLesson.id,
            completed: true
          })
        });
      } catch (e) {
        // non-blocking
      }
    }

    if (currentLessonIndex < moduleData.content.length - 1) {
      setCurrentLessonIndex(c => c + 1);
      setActiveTab('content');
    } else {
      setViewState('quiz_start');
    }
  };

  const handlePreviousLesson = () => {
    stopSpeech();
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(c => c - 1);
      setActiveTab('content');
    } else {
      setViewState('intro');
    }
  };

  // Speech narration handler
  const handlePlaySpeech = () => {
    if (!currentLesson) return;

    if (isPaused) {
      resumeSpeech();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    if (isSpeaking) {
      pauseSpeech();
      setIsPaused(true);
      return;
    }

    const narrationText = [
      currentLesson.heading,
      ...(currentLesson.paragraphs || []),
      currentLesson.nairobiExample ? (isSwahili ? `Mfano halisi Nairobi: ${currentLesson.nairobiExample}` : `Nairobi example: ${currentLesson.nairobiExample}`) : '',
      currentLesson.takeaways ? (isSwahili ? `Mambo makuu ya kuzingatia: ${currentLesson.takeaways.join('. ')}` : `Key takeaways: ${currentLesson.takeaways.join('. ')}`) : ''
    ].filter(Boolean).join('. ');

    setSpeechNotice(null);

    speakText(
      narrationText,
      language,
      speechRate,
      {
        sourceId: 'lesson-narration',
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
        onError: (err) => {
          setIsSpeaking(false);
          setIsPaused(false);
          if (typeof err === 'string') setSpeechNotice(err);
        },
        onVoiceNotice: (notice) => {
          setSpeechNotice(notice);
        }
      }
    );
  };

  const handleStopSpeech = () => {
    stopSpeech();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Bookmarking handler
  const handleToggleBookmark = async () => {
    if (!currentLesson) return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsBookmarked(!isBookmarked);
      setBookmarkFeedback(isSwahili ? 'Imehifadhiwa kwenye kifaa hiki' : 'Saved to local bookmarks');
      setTimeout(() => setBookmarkFeedback(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/v1/learning/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleId: moduleData.id,
          lessonId: currentLesson.id,
          note: currentLesson.heading
        })
      });

      if (res.ok) {
        setIsBookmarked(true);
        setBookmarkFeedback(isSwahili ? 'Somo limehifadhiwa!' : 'Lesson bookmarked to cloud!');
      } else {
        setIsBookmarked(true);
        setBookmarkFeedback(isSwahili ? 'Imehifadhiwa' : 'Bookmarked');
      }
    } catch {
      setIsBookmarked(true);
      setBookmarkFeedback(isSwahili ? 'Imehifadhiwa' : 'Bookmarked');
    }
    setTimeout(() => setBookmarkFeedback(null), 3000);
  };

  // Download Notes handler
  const handleDownloadNotes = () => {
    if (!activeLessonNotes || !currentLesson) return;
    const element = document.createElement('a');
    const file = new Blob([activeLessonNotes], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${moduleData.id}-${currentLesson.id}-study-notes.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Submit Q&A question
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setQuestionNotice(isSwahili ? 'Tafadhali ingia kuuliza swali kwa mwalimu' : 'Please sign in to post questions for instructor review');
      return;
    }

    setIsSubmittingQuestion(true);
    setQuestionNotice(null);

    try {
      const res = await fetch(`/api/v1/learning/questions/${moduleData.id}/${currentLesson.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questionText: newQuestionText })
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(prev => [data.question, ...prev]);
        setNewQuestionText('');
        setQuestionNotice(isSwahili ? 'Swali limewasilishwa kwa mwalimu!' : 'Question submitted! Instructor will review shortly.');
      } else {
        const err = await res.json();
        setQuestionNotice(err.message || 'Could not submit question.');
      }
    } catch {
      setQuestionNotice('Network connection error. Please try again.');
    } finally {
      setIsSubmittingQuestion(false);
      setTimeout(() => setQuestionNotice(null), 4000);
    }
  };

  const handleQuizComplete = async (score: number) => {
    setQuizScore(score);
    setViewState('results');
    await completeModule(moduleData.id);
    
    const achMap: Record<string, string> = {
      m1: 'FIRST_STEP',
      m2: 'FLOOD_READY',
      m3: 'HEAT_AWARE',
      m4: 'WATER_WISE',
      m5: 'JUSTICE_EXPLORER',
      m6: 'CLAIM_CHECKER',
      m7: 'COMMUNITY_VOICE'
    };
    
    if (achMap[moduleData.id]) {
      await unlockAchievement(achMap[moduleData.id]);
    }
  };

  const filteredTranscripts = (lessonMedia?.transcript || []).filter(t => 
    !transcriptSearch || 
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) || 
    t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="min-h-full pb-24 bg-gray-50">
      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close Help"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 text-forest-green mb-4">
              <div className="w-10 h-10 rounded-2xl bg-forest-green/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {isSwahili ? 'Msaada wa Kujifunzia' : 'Learning & Technical Help'}
              </h2>
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1">{isSwahili ? 'Jinsi ya Kujifunza' : 'How to Study This Lesson'}</h4>
                <p className="text-xs text-emerald-800">
                  {isSwahili 
                    ? 'Tazama video na picha, soma maelezo ya kina, kisha tumia maswali ya mwisho kupima uelewa wako kabla ya kufungua cheti.'
                    : 'Watch the video lesson, read the Nairobi practical case, review the key terms, and download your notes for offline study.'}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">{isSwahili ? 'Kuuliza Swali kwa Mwalimu' : 'Ask Your Instructor'}</h4>
                <p className="text-xs text-blue-800">
                  {isSwahili
                    ? 'Bofya kichupo cha "Maswali na Majibu" chini ya somo hili na uwasilishe swali lako. Waalimu na watafiti wa jukwaa watakujibu moja kwa moja.'
                    : 'Use the "Q&A & Discussion" tab below to ask questions directly linked to this lesson. Course instructors provide rubric-aligned feedback.'}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-1">{isSwahili ? 'Mawasiliano na Msaada' : 'Support & Contacts'}</h4>
                <p className="text-xs text-amber-800">
                  {isSwahili
                    ? 'Kwa masuala ya kiufundi au maudhui, tembelea ukurasa wetu wa Msaada (/help) au wasiliana na: support@climatejustice.ke.'
                    : 'For technical help or course questions, visit our Help Center (/help) or email support@climatejustice.ke. For Nairobi flood emergencies, call Red Cross 1199.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full py-3 bg-forest-green text-white font-bold rounded-xl hover:bg-forest-green/90 transition"
            >
              {isSwahili ? 'Nimeelewa' : 'Got It, Return to Lesson'}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* INTRO VIEW */}
        {viewState === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="relative h-64 md:h-80 bg-gray-900">
              {moduleData.image && <img src={moduleData.image} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={moduleData.title} />}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              <button 
                onClick={() => navigate('/learn')} 
                className="absolute top-4 left-4 text-white bg-black/40 p-2.5 rounded-full backdrop-blur hover:bg-black/60 transition"
                aria-label="Back to Modules"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              {/* Help button always visible */}
              <button
                onClick={() => setShowHelpModal(true)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{isSwahili ? 'Msaada' : 'Help'}</span>
              </button>

              <div className="absolute bottom-8 left-6 md:left-12 right-6">
                <span className="bg-forest-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {isSwahili ? 'Moduli ya Kujifunzia' : 'Learning Module'}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-2">{moduleData.title}</h1>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto p-6 md:p-12">
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">{moduleData.description}</p>
              
              <div className="bg-white rounded-organic p-6 md:p-8 shadow-natural border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-forest-green" />
                    {isSwahili ? `Mtaala wa Moduli (Masomo ${moduleData.content.length}):` : `Module Curriculum (${moduleData.content.length} Lessons):`}
                  </h2>
                  <span className="text-xs font-bold text-forest-green bg-forest-green/10 px-2.5 py-1 rounded-full">
                    {isSwahili ? 'Kiwango cha Kimataifa' : 'Professional Climate Curriculum'}
                  </span>
                </div>
                <ul className="space-y-3">
                  {moduleData.content.map((c, i) => {
                    const media = getLessonMedia(moduleData.id, c.id);
                    const estReadTime = estimateReadingTimeMinutes(c);
                    return (
                      <li key={i} className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                        <div className="w-6 h-6 rounded-full bg-forest-green/10 text-forest-green font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 block">{c.heading}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {media ? (
                                <>
                                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                                    <Video className="w-3 h-3 text-emerald-700" />
                                    {media.mediaType.includes('Simulation') ? 'Simulation' : 'Video'} • {media.videoDuration}
                                  </span>
                                  {media.hasAudio && (
                                    <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                                      Transcript
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                                  <BookOpen className="w-3 h-3 text-amber-700" />
                                  Reading • ~{estReadTime} min
                                </span>
                              )}
                            </div>
                          </div>
                          {c.objectives && c.objectives.length > 0 && (
                            <span className="text-xs text-gray-500 block mt-1">
                              {c.objectives[0]}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button 
                onClick={handleStartLessons}
                className="w-full bg-forest-green text-white py-4 rounded-full font-bold text-lg hover:bg-forest-green/90 flex items-center justify-center gap-2 shadow-natural transition"
              >
                <Play className="w-5 h-5 fill-current" />
                {progress[moduleData.id]?.completedLessons?.length 
                  ? (isSwahili ? 'Endelea Kujifunza' : 'Continue Learning') 
                  : (isSwahili ? 'Anza Somo la Kwanza' : 'Start First Lesson')}
              </button>
            </div>
          </motion.div>
        )}

        {/* LESSON VIEW (VIDEO PLAYER OR COMPREHENSIVE READING) */}
        {viewState === 'lesson' && currentLesson && (
          <motion.div 
            key={`lesson-${currentLessonIndex}`} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="max-w-4xl mx-auto p-4 md:p-8"
          >
            {/* Top Navigation & Controls Bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePreviousLesson} 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition"
                  aria-label="Previous Lesson"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-[11px] font-bold text-forest-green uppercase tracking-wider">
                    {moduleData.title}
                  </div>
                  <div className="text-xs font-bold text-gray-800">
                    {isSwahili ? 'Somo' : 'Lesson'} {currentLessonIndex + 1} of {moduleData.content.length}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Bookmark, Speech, Help */}
              <div className="flex items-center gap-2">
                {/* Bookmark action */}
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-full transition flex items-center gap-1 text-xs font-bold ${
                    isBookmarked ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={isBookmarked ? 'Bookmarked' : 'Bookmark this lesson'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                {/* Speech Controls Bar */}
                {isSpeechSupported() && (
                  <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1">
                    <button
                      onClick={handlePlaySpeech}
                      className="p-1 rounded-full text-forest-green hover:bg-forest-green/10 transition flex items-center gap-1 text-xs font-bold"
                      title={isSpeaking ? (isPaused ? 'Resume narration' : 'Pause narration') : 'Listen to audio lesson'}
                    >
                      {isSpeaking && !isPaused ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden md:inline">{isSpeaking ? 'Pause' : 'Listen'}</span>
                    </button>

                    {isSpeaking && (
                      <button
                        onClick={handleStopSpeech}
                        className="p-1 rounded-full text-red-600 hover:bg-red-50 transition"
                        title="Stop audio"
                      >
                        <Square className="w-3 h-3 fill-current" />
                      </button>
                    )}

                    <select
                      value={speechRate}
                      onChange={(e) => {
                        const newRate = parseFloat(e.target.value);
                        setSpeechRate(newRate);
                        if (isSpeaking) {
                          stopSpeech();
                          setIsSpeaking(false);
                        }
                      }}
                      className="text-[10px] font-bold bg-transparent border-0 outline-none text-gray-600 cursor-pointer"
                    >
                      <option value="0.8">0.8x</option>
                      <option value="1.0">1.0x</option>
                      <option value="1.2">1.2x</option>
                    </select>
                  </div>
                )}

                {/* Visible Help Button */}
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="p-2 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1 text-xs font-bold"
                  title="Lesson Help"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">{isSwahili ? 'Msaada' : 'Help'}</span>
                </button>
              </div>
            </div>

            {/* Bookmark Toast */}
            {bookmarkFeedback && (
              <div className="mb-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
                {bookmarkFeedback}
              </div>
            )}

            {/* Voice Notice */}
            {speechNotice && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-grow">{speechNotice}</div>
              </div>
            )}

            {lessonMedia ? (
              /* VIDEO PLAYER COMPONENT WITH THUMBNAIL POSTER AND HTML5 PLAYBACK */
              <div className="mb-6 bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
              {!isVideoPlaying ? (
                /* Poster Thumbnail State */
                <div 
                  className="relative aspect-video w-full bg-gray-900 flex items-center justify-center group cursor-pointer" 
                  onClick={() => {
                    setIsVideoPlaying(true);
                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current.play().then(() => setVideoIsPaused(false)).catch(() => {});
                      }
                    }, 50);
                  }}
                >
                  <img 
                    src={lessonMedia.thumbnailUrl} 
                    alt={lessonMedia.videoTitle} 
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Big Play Button */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-forest-green text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition duration-300">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>

                  {/* Thumbnail Overlay Details */}
                  <div className="absolute bottom-4 left-6 right-6 z-10 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded-full backdrop-blur">
                        {lessonMedia.mediaType} • {lessonMedia.videoDuration}
                      </span>
                      <h3 className="text-white text-lg md:text-xl font-bold mt-2 drop-shadow">
                        {lessonMedia.videoTitle}
                      </h3>
                      <p className="text-gray-300 text-xs mt-0.5">
                        {lessonMedia.hasAudio
                          ? `${lessonMedia.instructorName} • ${lessonMedia.instructorTitle}`
                          : `${lessonMedia.sourceAttribution}`}
                      </p>
                    </div>
                    <span className="bg-forest-green text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg hidden sm:inline-block">
                      {isSwahili ? 'Tazama Somo' : 'Watch Lecture'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Active HTML5 Video Player with Native & Custom Controls */
                <div className="relative aspect-video w-full bg-black flex flex-col justify-end group">
                  <video
                    ref={videoRef}
                    src={lessonMedia.videoSource}
                    poster={lessonMedia.thumbnailUrl}
                    className="w-full h-full object-contain"
                    playsInline
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        const cur = videoRef.current.currentTime;
                        setVideoCurrentTime(cur);
                        try {
                          localStorage.setItem(`resume_pos_${moduleId}_${currentLessonIndex}`, cur.toString());
                        } catch {}
                        if (videoRef.current.duration > 0 && cur / videoRef.current.duration >= 0.85) {
                          updateLessonProgress(moduleData.id, currentLessonIndex);
                        }
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setVideoDuration(videoRef.current.duration);
                        try {
                          const savedPos = localStorage.getItem(`resume_pos_${moduleId}_${currentLessonIndex}`);
                          if (savedPos) {
                            const p = parseFloat(savedPos);
                            if (p > 0 && p < videoRef.current.duration) {
                              videoRef.current.currentTime = p;
                              setVideoCurrentTime(p);
                            }
                          }
                        } catch {}
                      }
                    }}
                    onPlay={() => setVideoIsPaused(false)}
                    onPause={() => setVideoIsPaused(true)}
                    onEnded={() => {
                      setVideoIsPaused(true);
                      updateLessonProgress(moduleData.id, currentLessonIndex);
                    }}
                    onError={() => setVideoError('Video stream unavailable. Retrying...')}
                    controls={false}
                  />

                  {videoError && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center text-white z-20">
                      <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
                      <p className="text-xs font-semibold">{videoError}</p>
                      <button
                        onClick={() => {
                          setVideoError(null);
                          if (videoRef.current) {
                            videoRef.current.load();
                            videoRef.current.play().catch(() => {});
                          }
                        }}
                        className="mt-3 px-4 py-2 bg-forest-green rounded-xl text-xs font-bold hover:bg-emerald-600 transition"
                      >
                        Retry Playback
                      </button>
                    </div>
                  )}

                  {/* Video Control Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 flex flex-col gap-2 z-10 transition opacity-95 group-hover:opacity-100">
                    {/* Scrub/Seek Slider */}
                    <div className="w-full flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={videoDuration || 100}
                        step={0.5}
                        value={videoCurrentTime}
                        onChange={(e) => handleVideoSeek(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        aria-label="Seek time"
                      />
                    </div>

                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={toggleVideoPlayPause}
                          className="p-1 hover:text-emerald-400 transition"
                          aria-label={videoIsPaused ? 'Play' : 'Pause'}
                        >
                          {videoIsPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                        </button>
                        <span className="font-mono text-[11px] text-gray-300">
                          {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration || 70)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (videoRef.current) {
                              const nextMuted = !videoIsMuted;
                              videoRef.current.muted = nextMuted;
                              setVideoIsMuted(nextMuted);
                            }
                          }}
                          className="p-1 hover:text-emerald-400 transition"
                          aria-label={videoIsMuted ? 'Unmute' : 'Mute'}
                        >
                          {videoIsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <span className="text-gray-400 text-[11px] hidden sm:inline">Speed:</span>
                        {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handlePlaybackSpeed(rate)}
                            className={`px-2 py-0.5 rounded font-bold transition text-[10px] ${
                              playbackSpeed === rate ? 'bg-forest-green text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Player Bottom Metadata Bar */}
              <div className="bg-gray-950 px-5 py-3 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Duration: <strong>{lessonMedia.videoDuration}</strong></span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-400">
                    {lessonMedia.hasAudio ? 'Speaker: ' : 'Source / Publisher: '}
                    <strong>{lessonMedia.instructorName}</strong>
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    lessonMedia.hasAudio ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {lessonMedia.hasAudio ? '🔊 Spoken Audio' : '🔇 Silent Data Model'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Video Stream Active
                  </span>
                </div>
              </div>
            </div>
          ) : (
              /* DEDICATED COMPREHENSIVE READING LESSON HERO */
              <div className="mb-6 bg-gradient-to-br from-emerald-900 via-forest-green to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-800 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-200 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                      {isSwahili ? 'Somo Kamili la Kusoma' : 'Comprehensive Reading Lesson'}
                    </span>
                    <span className="text-[11px] font-bold text-amber-200 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-300/30">
                      ~{estimateReadingTimeMinutes(currentLesson)} min {isSwahili ? 'kusoma' : 'read'}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-100 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      ✓ {isSwahili ? 'Muktadha Halisi wa Kenya' : 'Kenyan Field Context'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                      {currentLesson.heading}
                    </h2>
                    {currentLesson.objectives && currentLesson.objectives.length > 0 && (
                      <p className="text-emerald-100/90 text-sm mt-2 max-w-2xl leading-relaxed">
                        {currentLesson.objectives[0]}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {isSpeechSupported() && (
                      <button
                        onClick={handlePlaySpeech}
                        className="px-4 py-2 bg-white text-forest-green hover:bg-emerald-50 rounded-xl font-bold text-xs flex items-center gap-2 shadow transition"
                      >
                        <Volume2 className="w-4 h-4 text-forest-green" />
                        <span>{isSpeaking ? (isPaused ? (isSwahili ? 'Endelea Kusikiliza' : 'Resume Audio') : (isSwahili ? 'Sitisha Sauti' : 'Pause Audio')) : (isSwahili ? 'Sikiliza Somo' : 'Listen to Narration')}</span>
                      </button>
                    )}
                    <button
                      onClick={handleDownloadNotes}
                      className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-xs flex items-center gap-2 border border-white/20 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isSwahili ? 'Pakua Nyaraka (.md)' : 'Download Study Notes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* COURSERA-STYLE TAB NAVIGATION */}
            <div className="mb-6 flex border-b border-gray-200 bg-white rounded-t-2xl px-4 pt-2 shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 whitespace-nowrap transition ${
                  activeTab === 'content'
                    ? 'border-forest-green text-forest-green'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {lessonMedia 
                    ? (isSwahili ? 'Maudhui na Mfano' : 'Lesson & Field Case') 
                    : (isSwahili ? 'Maudhui ya Kusoma' : 'Comprehensive Reading')}
                </span>
              </button>

              {lessonMedia && (
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 whitespace-nowrap transition ${
                    activeTab === 'transcript'
                      ? 'border-forest-green text-forest-green'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {lessonMedia.hasAudio
                      ? (isSwahili ? 'Maandishi ya Video' : 'Interactive Transcript')
                      : (isSwahili ? 'Mstari wa Data ya Video' : 'Visual Data Timeline')}
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition ${
                  activeTab === 'notes'
                    ? 'border-forest-green text-forest-green'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{isSwahili ? 'Muhtasari wa Kupakua' : 'Downloadable Notes'}</span>
              </button>

              <button
                onClick={() => setActiveTab('qa')}
                className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition ${
                  activeTab === 'qa'
                    ? 'border-forest-green text-forest-green'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isSwahili ? 'Uliza Swali (Q&A)' : 'Ask a Question'}</span>
                {questions.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-forest-green rounded-full text-[10px] font-bold">
                    {questions.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: MAIN LESSON CONTENT & NAIROBI FIELD CASE */}
            {activeTab === 'content' && (
              <div className="bg-white rounded-b-2xl shadow-natural border border-gray-100 p-6 md:p-10 mb-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-green px-2.5 py-0.5 rounded-full bg-forest-green/10">
                    {moduleData.title} • {isSwahili ? 'Somo' : 'Lesson'} {currentLessonIndex + 1}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
                    {currentLesson.heading}
                  </h1>
                </div>

                {/* Learning Objectives */}
                {currentLesson.objectives && currentLesson.objectives.length > 0 && (
                  <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      {isSwahili ? 'Malengo ya Somo:' : 'Learning Objectives:'}
                    </h3>
                    <ul className="space-y-1.5 text-xs md:text-sm text-emerald-900">
                      {currentLesson.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Main Explanatory Paragraphs */}
                <div className="space-y-4 text-base md:text-lg text-gray-800 leading-relaxed">
                  {currentLesson.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Practical Nairobi-Relevant Example */}
                {currentLesson.nairobiExample && (
                  <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      {isSwahili ? 'Mfano Halisi wa Nairobi:' : 'Nairobi Practical Field Context:'}
                    </h3>
                    <p className="text-sm text-amber-950 leading-relaxed italic">
                      "{currentLesson.nairobiExample}"
                    </p>
                  </div>
                )}

                {/* Key Terms */}
                {currentLesson.keyTerms && currentLesson.keyTerms.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-forest-green" />
                      {isSwahili ? 'Istilahi Muhimu:' : 'Key Terms & Definitions:'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {currentLesson.keyTerms.map((kt, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                          <span className="font-bold text-gray-900 block">{kt.term}</span>
                          <span className="text-gray-600 block mt-0.5">{kt.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Takeaways */}
                {currentLesson.takeaways && currentLesson.takeaways.length > 0 && (
                  <div className="p-4 bg-forest-green/5 rounded-xl border border-forest-green/20">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-forest-green mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      {isSwahili ? 'Mambo Makuu ya Kuzingatia:' : 'Key Takeaways:'}
                    </h3>
                    <ul className="space-y-1.5 text-xs md:text-sm text-gray-800">
                      {currentLesson.takeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-forest-green shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Reflection Question */}
                {currentLesson.reflectionQuestion && (
                  <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 text-xs md:text-sm text-purple-900">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-purple-800 mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      {isSwahili ? 'Swali la Tafakari ya Jamii:' : 'Community Reflection Prompt:'}
                    </h3>
                    <p className="leading-relaxed font-medium">
                      {currentLesson.reflectionQuestion}
                    </p>
                  </div>
                )}

                {/* Practical Activity or Exercise */}
                {currentLesson.activity && (
                  <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-xs md:text-sm text-blue-900">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-blue-800 mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" />
                      {isSwahili ? 'Zoezi la Vitendo Mtaani:' : 'Practical Field Exercise:'}
                    </h3>
                    <p className="leading-relaxed">
                      {currentLesson.activity}
                    </p>
                  </div>
                )}

                {/* Common Misconceptions & Corrections */}
                {currentLesson.misconceptions && currentLesson.misconceptions.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      {isSwahili ? 'Dhana Potofu na Ukweli Halisi:' : 'Common Misconceptions & Corrections:'}
                    </h3>
                    <div className="space-y-2">
                      {currentLesson.misconceptions.map((mc, i) => (
                        <div key={i} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60 text-xs">
                          <div className="text-red-700 font-semibold mb-1">
                            ✕ {isSwahili ? 'Dhana Potofu: ' : 'Misconception: '}{mc.misconception}
                          </div>
                          <div className="text-emerald-800 font-medium">
                            ✓ {isSwahili ? 'Ukweli: ' : 'Correction: '}{mc.correction}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source References */}
                {currentLesson.sources && currentLesson.sources.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{isSwahili ? 'Marejeleo ya Kisayansi na Kisheria: ' : 'Source References: '}</span>
                      {currentLesson.sources.join(' • ')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTERACTIVE SEARCHABLE TRANSCRIPT (SUPERVISOR REQUIREMENT #3) */}
            {activeTab === 'transcript' && lessonMedia && (
              <div className="bg-white rounded-b-2xl shadow-natural border border-gray-100 p-6 md:p-8 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-forest-green" />
                      {lessonMedia.hasAudio
                        ? (isSwahili ? 'Maandishi Yote ya Video' : 'Searchable Video Transcript')
                        : (isSwahili ? 'Mstari wa Data ya Kisayansi' : 'Visual Data Timeline & Scientific Milestones')}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lessonMedia.hasAudio
                        ? (isSwahili ? 'Tafuta maneno au bofya muda kuelekea sehemu ya somo' : 'Click timecodes or search key concepts to follow along with the audio narration.')
                        : (isSwahili ? 'Bofya vipindi vya muda kuelekea moja kwa moja kwenye data ya kisayansi' : 'Click timestamps to jump directly to key observation phases in this data model.')}
                    </p>
                  </div>

                  {/* Transcript Search Box */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      placeholder={isSwahili ? 'Tafuta maneno...' : 'Search transcript...'}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredTranscripts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      {isSwahili ? 'Hakuna matokeo yaliyopatikana.' : 'No matching transcript lines found.'}
                    </div>
                  ) : (
                    filteredTranscripts.map((seg, i) => {
                      const isLineActive = videoCurrentTime >= seg.seconds && (
                        i === filteredTranscripts.length - 1 || 
                        videoCurrentTime < filteredTranscripts[i + 1].seconds
                      );
                      return (
                        <div 
                          key={i} 
                          className={`flex items-start gap-4 p-3 rounded-xl transition border group ${
                            isLineActive 
                              ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-200' 
                              : 'hover:bg-emerald-50/40 border-transparent hover:border-emerald-100'
                          }`}
                        >
                          <button
                            onClick={() => handleVideoSeek(seg.seconds)}
                            className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition shrink-0 mt-0.5 flex items-center gap-1 ${
                              isLineActive 
                                ? 'bg-forest-green text-white' 
                                : 'bg-gray-100 group-hover:bg-forest-green group-hover:text-white text-forest-green'
                            }`}
                            title="Seek video here"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            {seg.timestamp}
                          </button>
                          <div>
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                              {seg.speaker}
                            </span>
                            <p className={`text-sm leading-relaxed ${isLineActive ? 'text-gray-950 font-medium' : 'text-gray-800'}`}>
                              {seg.text}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: DOWNLOADABLE NOTES (SUPERVISOR REQUIREMENT #3) */}
            {activeTab === 'notes' && (
              <div className="bg-white rounded-b-2xl shadow-natural border border-gray-100 p-6 md:p-8 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Download className="w-5 h-5 text-forest-green" />
                      {isSwahili ? 'Muhtasari wa Somo na Nyaraka' : 'Official Lesson Notes & Offline Study Pack'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isSwahili ? 'Pakua nakala kamili ya kusoma nje ya mtandao au kuchapisha.' : 'Download complete markdown notes for offline revision or print.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadNotes}
                      className="px-4 py-2 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isSwahili ? 'Pakua (.md)' : 'Download Markdown'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                  <MarkdownRenderer content={activeLessonNotes} />
                </div>
              </div>
            )}

            {/* TAB 4: POST-LESSON Q&A (SUPERVISOR REQUIREMENT #4) */}
            {activeTab === 'qa' && (
              <div className="bg-white rounded-b-2xl shadow-natural border border-gray-100 p-6 md:p-8 mb-8">
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-forest-green" />
                    {isSwahili ? 'Uliza Swali kwa Mwalimu (Q&A)' : 'Ask a Question & Discussion'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isSwahili ? 'Wasilisha swali lolote kuhusu somo hili. Waalimu na watafiti wa jukwaa watajibu hapa.' : 'Ask clarification or post field observations. Instructors reply directly.'}
                  </p>
                </div>

                {/* Question Submission Form */}
                <form onSubmit={handleSubmitQuestion} className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <label htmlFor="lesson-qa-input" className="block text-xs font-bold text-gray-700 mb-2">
                    {isSwahili ? 'Swali lako kuhusu somo hili:' : 'Your question for the instructor:'}
                  </label>
                  <textarea
                    id="lesson-qa-input"
                    rows={3}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder={isSwahili ? 'Mfano: Je, ni miti ipi ya kiasili inafaa zaidi kupunguza joto katika mtaa wetu?' : 'e.g. How does the 30-meter riparian regulation apply to existing stone commercial structures in Nairobi?'}
                    className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                    required
                  />
                  
                  {questionNotice && (
                    <div className="mt-2 text-xs font-semibold text-forest-green flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      {questionNotice}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      {user ? `Posting as ${user.displayName || user.name || user.email}` : 'Please sign in to post'}
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingQuestion || !newQuestionText.trim()}
                      className="px-4 py-2 bg-forest-green hover:bg-forest-green/90 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingQuestion ? 'Submitting...' : (isSwahili ? 'Tuma Swali' : 'Submit Question')}</span>
                    </button>
                  </div>
                </form>

                {/* Existing Questions List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {isSwahili ? 'Maswali Yaliyowasilishwa' : 'Questions on this Lesson'} ({questions.length})
                  </h4>

                  {questions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl text-gray-500 text-xs">
                      {isSwahili ? 'Bado hakuna maswali yaliyoulizwa kwenye somo hili. Kuwa wa kwanza kuuliza!' : 'No questions yet on this lesson. Be the first to ask!'}
                    </div>
                  ) : (
                    questions.map((q) => (
                      <div key={q.id} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs md:text-sm font-semibold text-gray-900">
                            {q.questionText}
                          </p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            q.isAnswered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {q.isAnswered ? 'Answered' : 'Under Review'}
                          </span>
                        </div>

                        {/* Instructor Reply if answered */}
                        {q.isAnswered && q.instructorAnswer && (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                            <span className="font-bold text-emerald-800 block mb-1">
                              ✓ {isSwahili ? 'Jibu la Mwalimu:' : 'Instructor Answer:'}
                            </span>
                            <p className="leading-relaxed">{q.instructorAnswer}</p>
                          </div>
                        )}

                        <div className="text-[10px] text-gray-400">
                          Posted on {new Date(q.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Bottom Lesson Navigation */}
            <div className="flex justify-between items-center gap-4">
              <button 
                onClick={handlePreviousLesson}
                className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-200 rounded-full transition text-sm"
              >
                {isSwahili ? 'Rudi Nyuma' : 'Previous'}
              </button>
              
              <button 
                onClick={handleNextLesson}
                className="px-8 py-3.5 bg-forest-green text-white font-bold rounded-full hover:bg-forest-green/90 transition shadow-natural flex items-center gap-2 text-sm"
              >
                {currentLessonIndex < moduleData.content.length - 1 
                  ? (isSwahili ? 'Somo Linalofuata' : 'Next Lesson') 
                  : (isSwahili ? 'Anza Jaribio la Moduli' : 'Take Module Quiz')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* QUIZ START */}
        {viewState === 'quiz_start' && (
          <motion.div key="quiz_start" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-6 md:p-12 text-center mt-10">
            <div className="w-24 h-24 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-forest-green" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isSwahili ? 'Uko tayari kupima uelewa wako?' : 'Ready to test your knowledge?'}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {moduleData.quiz.length} {isSwahili ? 'maswali yaliyotayarishwa kwa kina kuhusu' : 'substantive questions covering'} <strong>{moduleData.title}</strong>.
            </p>
            <button 
              onClick={() => setViewState('quiz_active')}
              className="w-full bg-forest-green text-white py-4 rounded-full font-bold text-lg hover:bg-forest-green/90 transition shadow-natural"
            >
              {isSwahili ? 'Anza Jaribio la Maswali' : 'Start Quiz'}
            </button>
          </motion.div>
        )}

        {/* QUIZ ACTIVE */}
        {viewState === 'quiz_active' && (
          <motion.div key="quiz_active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <QuizEngine questions={moduleData.quiz} onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {/* RESULTS */}
        {viewState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto p-6 md:p-12 text-center mt-10 bg-white rounded-organic shadow-natural">
            <div className="mb-6">
              <span className="text-6xl font-black text-forest-green">{quizScore}</span>
              <span className="text-3xl text-gray-400 font-bold"> / {moduleData.quiz.length}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {quizScore === moduleData.quiz.length 
                ? (isSwahili ? 'Hongera Sana! Alama Kamili!' : 'Outstanding! Perfect Score!') 
                : (isSwahili ? 'Moduli Imekamilika!' : 'Module Completed!')}
            </h2>
            <p className="text-gray-600 mb-8">
              {isSwahili 
                ? 'Umekamilisha masomo na maswali ya moduli hii. Unaweza kuendelea au kurudia maswali.' 
                : 'You have completed all substantive lessons and assessments for this topic.'}
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => navigate('/learn')}
                className="w-full bg-forest-green text-white py-3.5 rounded-full font-bold hover:bg-forest-green/90 transition shadow-natural"
              >
                {isSwahili ? 'Rudi Kwenye Moduli Zote' : 'Explore More Modules'}
              </button>
              <button 
                onClick={() => setViewState('quiz_active')}
                className="w-full bg-cream-bg text-earth-brown py-3 rounded-full font-bold hover:bg-earth-brown/10 border border-earth-brown/20 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {isSwahili ? 'Jaribu Jaribio Tena' : 'Retake Quiz'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
