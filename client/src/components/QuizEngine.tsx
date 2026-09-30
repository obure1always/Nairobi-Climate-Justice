import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import type { QuizQuestion } from '../data/modules';
import { useLanguage } from '../LanguageContext';

interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  const handleSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score, questions.length);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
          <span>{isSwahili ? 'Swali' : 'Question'} {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
          {questions.map((_, idx) => (
            <div 
              key={idx}
              className={`h-full flex-1 border-r border-white/20 last:border-0 ${
                idx < currentIndex ? 'bg-green-500' : idx === currentIndex ? 'bg-green-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
              
              if (isAnswered) {
                if (idx === currentQuestion.correctAnswer) {
                  btnClass += "border-green-500 bg-green-50 text-green-900";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-900";
                } else {
                  btnClass += "border-gray-200 bg-gray-50 opacity-50";
                }
              } else {
                if (idx === selectedOption) {
                  btnClass += "border-green-500 bg-green-50";
                } else {
                  btnClass += "border-gray-200 hover:border-green-300 hover:bg-green-50/50 cursor-pointer";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      idx === selectedOption ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {idx === selectedOption && <div className="w-3 h-3 rounded-full bg-green-500" />}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 overflow-hidden"
              >
                <div className={`p-4 rounded-xl flex gap-4 ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                  {isCorrect ? <CheckCircle className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
                  <div>
                    <h4 className="font-bold mb-1">
                      {isCorrect 
                        ? (isSwahili ? 'Sahihi!' : 'Correct!') 
                        : (isSwahili ? 'Fikiria njia nyingine.' : 'Consider another approach.')}
                    </h4>
                    <p className="text-sm opacity-90">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end">
            {!isAnswered ? (
              <button
                onClick={handleCheck}
                disabled={selectedOption === null}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSwahili ? 'Thibitisha' : 'Check Answer'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                {currentIndex < questions.length - 1 
                  ? (isSwahili ? 'Swali Linalofuata' : 'Next Question') 
                  : (isSwahili ? 'Ona Matokeo' : 'See Results')}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
