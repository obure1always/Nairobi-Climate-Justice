import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { assessments } from '../data/assessments';
import { SyncService } from '../SyncService';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AssessmentView() {
  const { language } = useLanguage();
  const { unlockAchievement } = useProgress();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';
  const assessmentData = assessments[language].endline;
  
  const [viewState, setViewState] = useState<'intro' | 'questions' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  const currentQuestion = assessmentData.questions[currentIndex];

  const handleSelectOption = (value: string | number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = async () => {
    if (currentIndex < assessmentData.questions.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      await unlockAchievement('ASSESSMENT_COMPLETE');
      // Queue all answers for synchronization
      Object.entries(answers).forEach(([questionId, answer]) => {
        SyncService.queueRecord('ASSESSMENT', { questionId, answer });
      });
      setViewState('results');
    }
  };

  return (
    <div className="min-h-full pb-24 bg-gray-50 flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {/* INTRO VIEW */}
        {viewState === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto p-6 md:p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{assessmentData.title}</h1>
            <p className="text-gray-600 mb-8">{assessmentData.description}</p>
            <button 
              onClick={() => setViewState('questions')}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg"
            >
              {isSwahili ? 'Anza Tathmini' : 'Start Assessment'}
            </button>
          </motion.div>
        )}

        {/* QUESTIONS VIEW */}
        {viewState === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto p-4 md:p-8 w-full">
            <div className="mb-8">
              <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                <span>{isSwahili ? 'Swali' : 'Question'} {currentIndex + 1} / {assessmentData.questions.length}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-green-500 h-full transition-all duration-300" 
                  style={{ width: `${((currentIndex + 1) / assessmentData.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion.text}</h2>
              
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center gap-3",
                        answers[currentQuestion.id] === idx
                          ? "border-green-500 bg-green-50 text-green-900"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                        answers[currentQuestion.id] === idx ? 'border-green-500' : 'border-gray-300'
                      )}>
                        {answers[currentQuestion.id] === idx && <div className="w-3 h-3 rounded-full bg-green-500" />}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'likert' && (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm font-semibold text-gray-500 w-16 text-center">{isSwahili ? 'Sikubaliani Kabisa' : 'Strongly Disagree'}</span>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSelectOption(val)}
                      className={cn(
                        "w-12 h-12 rounded-full font-bold transition-all shadow-sm flex items-center justify-center border",
                        answers[currentQuestion.id] === val 
                          ? "bg-green-600 text-white border-green-600 scale-110" 
                          : "bg-white text-gray-700 border-gray-200 hover:border-green-300"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                  <span className="text-sm font-semibold text-gray-500 w-16 text-center">{isSwahili ? 'Nakubaliana Kabisa' : 'Strongly Agree'}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {currentIndex < assessmentData.questions.length - 1 
                  ? (isSwahili ? 'Swali Linalofuata' : 'Next Question') 
                  : (isSwahili ? 'Maliza Tathmini' : 'Finish Assessment')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* RESULTS VIEW */}
        {viewState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-6 md:p-12 text-center mt-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSwahili ? 'Safari Yako Imekamilika!' : 'Learning Journey Complete!'}
            </h2>
            <p className="text-gray-600 mb-10 text-lg">
              {isSwahili 
                ? 'Asante kwa kukamilisha mtaala wa Haki ya Hali ya Hewa Nairobi.' 
                : 'Thank you for completing the Climate Justice Nairobi curriculum.'}
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => navigate('/progress')}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition"
              >
                {isSwahili ? 'Tazama Maendeleo Yangu' : 'Review My Progress'}
              </button>
              <button 
                onClick={() => navigate('/resources')}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                {isSwahili ? 'Gundua Rasilimali' : 'Explore Resources'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
