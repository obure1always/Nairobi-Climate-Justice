import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
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
  Target,
  MapPin,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Activity,
  AlertCircle,
  FileText
} from 'lucide-react';
import { QuizEngine } from './QuizEngine';
import { 
  speakText, 
  pauseSpeech, 
  resumeSpeech, 
  stopSpeech, 
  isSpeechSupported 
} from '../lib/speech';

export default function LessonView() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { progress, updateLessonProgress, completeModule, unlockAchievement } = useProgress();
  
  const isSwahili = language === 'sw';
  const currentModules = modules[language];
  const moduleData = currentModules.find(m => m.id === moduleId);
  
  const [viewState, setViewState] = useState<'intro' | 'lesson' | 'quiz_start' | 'quiz_active' | 'results'>('intro');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    stopSpeech();
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeechNotice(null);
  }, [viewState, currentLessonIndex]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

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

  const handleStartLessons = () => {
    const p = progress[moduleData.id];
    let startIdx = 0;
    if (p && p.completedLessons) {
      for (let i = 0; i < moduleData.content.length; i++) {
        if (!p.completedLessons.includes(i)) {
          startIdx = i;
          break;
        }
      }
    }
    setCurrentLessonIndex(startIdx);
    setViewState('lesson');
  };

  const handleNextLesson = async () => {
    stopSpeech();
    await updateLessonProgress(moduleData.id, currentLessonIndex);
    if (currentLessonIndex < moduleData.content.length - 1) {
      setCurrentLessonIndex(c => c + 1);
    } else {
      setViewState('quiz_start');
    }
  };

  const handlePreviousLesson = () => {
    stopSpeech();
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(c => c - 1);
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

  return (
    <div className="min-h-full pb-24 bg-gray-50">
      <AnimatePresence mode="wait">
        
        {/* INTRO VIEW */}
        {viewState === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="relative h-64 md:h-80 bg-gray-900">
              {moduleData.image && <img src={moduleData.image} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              <button 
                onClick={() => navigate('/learn')} 
                className="absolute top-4 left-4 text-white bg-black/40 p-2.5 rounded-full backdrop-blur hover:bg-black/60 transition"
                aria-label="Back to Modules"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="absolute bottom-8 left-6 md:left-12 right-6">
                <span className="bg-forest-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {isSwahili ? 'Moduli' : 'Module'}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-2">{moduleData.title}</h1>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto p-6 md:p-12">
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">{moduleData.description}</p>
              
              <div className="bg-white rounded-organic p-6 md:p-8 shadow-natural border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-forest-green" />
                  {isSwahili ? 'Masomo yaliyomo kwenye Moduli hii (Masomo 6):' : 'Lessons in this Module (6 Lessons):'}
                </h2>
                <ul className="space-y-3">
                  {moduleData.content.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block">{i + 1}. {c.heading}</span>
                        {c.objectives && c.objectives.length > 0 && (
                          <span className="text-xs text-gray-500 block mt-0.5">
                            {c.objectives[0]}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
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

        {/* LESSON VIEW */}
        {viewState === 'lesson' && currentLesson && (
          <motion.div 
            key={`lesson-${currentLessonIndex}`} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="max-w-3xl mx-auto p-4 md:p-8"
          >
            {/* Top Navigation Bar */}
            <div className="mb-6 flex items-center justify-between">
              <button 
                onClick={handlePreviousLesson} 
                className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                aria-label="Previous Lesson"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="text-xs font-bold text-gray-500 tracking-wider">
                {isSwahili ? 'SOMO' : 'LESSON'} {currentLessonIndex + 1} / {moduleData.content.length}
              </div>

              {/* Speech Controls Bar */}
              {isSpeechSupported() && (
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1">
                  <button
                    onClick={handlePlaySpeech}
                    className="p-1.5 rounded-full hover:bg-forest-green/10 text-forest-green transition flex items-center gap-1 text-xs font-bold"
                    title={isSpeaking ? (isPaused ? 'Resume narration' : 'Pause narration') : 'Listen to lesson'}
                  >
                    {isSpeaking && !isPaused ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span className="hidden sm:inline">{isSwahili ? 'Simamisha' : 'Pause'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{isPaused ? (isSwahili ? 'Endelea' : 'Resume') : (isSwahili ? 'Sikiliza' : 'Listen')}</span>
                      </>
                    )}
                  </button>

                  {isSpeaking && (
                    <button
                      onClick={handleStopSpeech}
                      className="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition"
                      title="Stop narration"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
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
                    className="text-[11px] font-bold bg-transparent border-0 outline-none text-gray-600 cursor-pointer pl-1"
                    title="Playback speed"
                  >
                    <option value="0.8">0.8x</option>
                    <option value="1.0">1.0x</option>
                    <option value="1.2">1.2x</option>
                  </select>
                </div>
              )}
            </div>

            {/* Voice Notice / Fallback Message */}
            {speechNotice && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-grow">{speechNotice}</div>
              </div>
            )}

            {/* Substantive Lesson Content Container */}
            <div className="bg-white rounded-organic shadow-natural border border-gray-100 p-6 md:p-10 mb-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-green px-2.5 py-0.5 rounded-full bg-forest-green/10">
                  {moduleData.title}
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
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    {isSwahili ? 'Mfano Halisi wa Nairobi:' : 'Nairobi Practical Context:'}
                  </h3>
                  <p className="text-sm text-amber-900 leading-relaxed italic">
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
