import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, Trophy, CheckCircle, RotateCcw } from 'lucide-react';
import { QuizEngine } from './QuizEngine';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewState, currentLessonIndex]);

  if (!moduleData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">{isSwahili ? 'Somo halijapatikana' : 'Module not found'}</h2>
        <button onClick={() => navigate('/learn')} className="text-green-600 underline">
          {isSwahili ? 'Rudi kujifunza' : 'Return to Learn'}
        </button>
      </div>
    );
  }

  const handleStartLessons = () => {
    const p = progress[moduleData.id];
    // Find first uncompleted lesson
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
    await updateLessonProgress(moduleData.id, currentLessonIndex);
    if (currentLessonIndex < moduleData.content.length - 1) {
      setCurrentLessonIndex(c => c + 1);
    } else {
      setViewState('quiz_start');
    }
  };

  const handleQuizComplete = async (score: number) => {
    setQuizScore(score);
    setViewState('results');
    
    // Simple passing requirement: complete it regardless of score for now, 
    // or unlock achievements based on score.
    await completeModule(moduleData.id);
    
    // Map of achievements
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
              <button onClick={() => navigate('/learn')} className="absolute top-4 left-4 text-white bg-black/30 p-2 rounded-full backdrop-blur hover:bg-black/50 transition">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="absolute bottom-8 left-6 md:left-12 right-6">
                <span className="bg-forest-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Module
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-2">{moduleData.title}</h1>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto p-6 md:p-12">
              <p className="text-xl text-gray-700 mb-10">{moduleData.description}</p>
              
              <div className="bg-white rounded-organic p-6 shadow-natural border border-gray-100 mb-10">
                <h3 className="font-bold text-gray-900 mb-4">{isSwahili ? 'Utajifunza nini:' : 'What you will learn:'}</h3>
                <ul className="space-y-3">
                  {moduleData.content.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{c.heading}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={handleStartLessons}
                className="w-full bg-forest-green text-white py-4 rounded-full font-bold text-lg hover:bg-forest-green/90 flex items-center justify-center gap-2 shadow-natural"
              >
                <Play className="w-5 h-5 fill-current" />
                {progress[moduleData.id]?.completedLessons?.length ? (isSwahili ? 'Endelea Kujifunza' : 'Continue Learning') : (isSwahili ? 'Anza Somo' : 'Start Module')}
              </button>
            </div>
          </motion.div>
        )}

        {/* LESSON VIEW */}
        {viewState === 'lesson' && (
          <motion.div key="lesson" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto p-4 md:p-8">
            <div className="mb-8 flex items-center justify-between">
              <button onClick={() => setViewState('intro')} className="text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="text-sm font-bold text-gray-400">
                {isSwahili ? 'SOMO' : 'LESSON'} {currentLessonIndex + 1} {isSwahili ? 'KATI YA' : 'OF'} {moduleData.content.length}
              </div>
            </div>

            <div className="bg-white rounded-organic shadow-natural border border-gray-100 p-6 md:p-10 mb-8 prose prose-green max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{moduleData.content[currentLessonIndex].heading}</h2>
              {moduleData.content[currentLessonIndex].paragraphs.map((p, i) => (
                <p key={i} className="text-lg text-gray-700 leading-relaxed mb-4">{p}</p>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => currentLessonIndex > 0 ? setCurrentLessonIndex(c => c - 1) : setViewState('intro')}
                className="px-6 py-3 font-semibold text-gray-600 hover:bg-cream-bg rounded-full transition"
              >
                {isSwahili ? 'Rudi' : 'Previous'}
              </button>
              
              <button 
                onClick={handleNextLesson}
                className="px-8 py-3 bg-forest-green text-white font-bold rounded-full hover:bg-forest-green/90 transition shadow-natural flex items-center gap-2"
              >
                {currentLessonIndex < moduleData.content.length - 1 ? (isSwahili ? 'Inayofuata' : 'Next') : (isSwahili ? 'Maliza Somo' : 'Finish Lesson')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* QUIZ START */}
        {viewState === 'quiz_start' && (
          <motion.div key="quiz_start" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-6 md:p-12 text-center mt-10">
            <div className="w-24 h-24 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{isSwahili ? 'Uko tayari kujaribu ulichojifunza?' : 'Ready to test what you learned?'}</h2>
            <p className="text-gray-600 mb-8">
              {moduleData.quiz.length} {isSwahili ? 'maswali kuhusu' : 'questions about'} {moduleData.title}
            </p>
            <button 
              onClick={() => setViewState('quiz_active')}
              className="w-full bg-earth-brown text-white py-4 rounded-full font-bold text-lg hover:bg-earth-brown/90 transition shadow-natural"
            >
              {isSwahili ? 'Anza Jaribio' : 'Start Quiz'}
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
            <div className="mb-8">
              <span className="text-6xl font-black text-green-600">{quizScore}</span>
              <span className="text-3xl text-gray-400 font-bold"> / {moduleData.quiz.length}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {quizScore === moduleData.quiz.length 
                ? (isSwahili ? 'Kazi Nzuri Sana!' : 'Excellent Work!') 
                : (isSwahili ? 'Somo Limekamilika' : 'Module Complete')}
            </h2>
            <p className="text-gray-600 mb-10">
              {isSwahili 
                ? 'Sasa una uelewa mzuri zaidi wa mada hii.' 
                : 'You now have a stronger understanding of this topic.'}
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => navigate('/learn')}
                className="w-full bg-forest-green text-white py-4 rounded-full font-bold hover:bg-forest-green/90 transition shadow-natural"
              >
                {isSwahili ? 'Endelea Kujifunza' : 'Continue Learning'}
              </button>
              <button 
                onClick={() => setViewState('quiz_active')}
                className="w-full bg-cream-bg text-earth-brown py-4 rounded-full font-bold hover:bg-earth-brown/10 border border-earth-brown/20 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                {isSwahili ? 'Jaribu Tena' : 'Try Again'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
