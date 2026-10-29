import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Compass
} from 'lucide-react';
import type { QuizQuestion } from '../data/modules';
import { useLanguage } from '../LanguageContext';

export interface ScenarioOption {
  id: string;
  strategy: string;
  description: string;
  isOptimal: boolean;
  score: number;
  explanation: string;
}

export const kenyaScenarioDilemma = {
  title: 'Field Dilemma: Nairobi River Basin Urban Flooding & Bio-Drainage',
  location: 'Mathare & Kibera Riparian Corridors, Nairobi County, Kenya',
  context: 'A dense riparian community along the Mathare and Nairobi rivers experiences acute seasonal flood surges during the March–May (MAM) Long Rains. Impervious tarmac and zinc roofs in upstream commercial zones accelerate stormwater runoff into the river within 30 minutes, breaching river banks, flooding houses, and washing sewage into shallow water lines.',
  question: 'As the community adaptation coordinator collaborating with NEMA and Nairobi City County, which integrated strategy maximizes flood protection without violating environmental regulations or displacing residents without shelter?',
  options: [
    {
      id: 'ke-opt-1',
      strategy: 'Riparian Bio-Swales + Permeable Retention Ponds + Indigenous Bamboo & Vetiver Buffer',
      description: 'Establish community-maintained 30-meter vegetated riparian buffers using indigenous bamboo and vetiver grass, coupled with upstream stormwater bio-retention swales to slow runoff velocity by over 60%.',
      isOptimal: true,
      score: 15,
      explanation: 'Optimal Choice: Documented by NEMA Kenya and urban hydrology research. Vegetated bio-swales restore infiltration capacity, reduce peak stormwater velocity, and stabilize vulnerable river banks under EMCA (1999) standards.'
    },
    {
      id: 'ke-opt-2',
      strategy: 'Unlicensed Concrete Riparian Wall Without Drainage Weep Holes',
      description: 'Erect a rigid vertical concrete retaining wall directly on the river edge to block water from entering immediate homes.',
      isOptimal: false,
      score: 4,
      explanation: 'High Risk: Rigid walls without weep holes collapse under hydraulic ground pressure. Furthermore, narrowing the natural river channel simply accelerates catastrophic flood surges into vulnerable communities immediately downstream.'
    },
    {
      id: 'ke-opt-3',
      strategy: 'Complete Monoculture Shift to Eucalyptus Plantations Along Stream',
      description: 'Clear indigenous riparian vegetation and plant high-density eucalyptus trees right up to the water channel.',
      isOptimal: false,
      score: 3,
      explanation: 'Severe Adverse Impact: Eucalyptus absorbs excessive baseflow from rivers, depleting essential water during dry seasons, while offering shallow root anchoring that easily washes out in high-velocity flash floods.'
    },
    {
      id: 'ke-opt-4',
      strategy: 'Seasonal Sirens and Early Warnings Without Physical Drainage Upgrades',
      description: 'Rely solely on SMS flood alerts while leaving blocked culverts and impervious surfaces unaddressed.',
      isOptimal: false,
      score: 6,
      explanation: 'Incomplete Strategy: Early warnings save lives during evacuations, but without physical infiltration bio-swales and culvert clearance, structural damage and contamination repeat every rainy season.'
    }
  ]
};

export interface MatchingPair {
  term: string;
  match: string;
}

export const climateMatchingExercises: MatchingPair[] = [
  { term: 'Urban Heat Island (UHI)', match: 'Dense zinc mabati roofs elevating informal settlement temperatures by 3-5°C' },
  { term: 'Infiltration Deficit', match: 'Impermeable asphalt reducing stormwater absorption and accelerating flood peaks' },
  { term: 'Article 42 Constitution', match: 'Guarantees every person the right to a clean and healthy environment' },
  { term: 'Loss & Damage Facility', match: 'Compensating vulnerable African nations for irreversible climate catastrophe' }
];

interface QuizEngineProps {
  questions: QuizQuestion[];
  moduleId?: string;
  includeKenyaScenario?: boolean;
  onComplete: (score: number, total: number) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ 
  questions, 
  moduleId, 
  includeKenyaScenario = false, 
  onComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Kenya Field Scenario stage
  const [inScenarioStage, setInScenarioStage] = useState(false);
  const [selectedScenarioOpt, setSelectedScenarioOpt] = useState<string | null>(null);
  const [scenarioAnswered, setScenarioAnswered] = useState(false);

  // Final summary state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const currentQuestion = questions[currentIndex];
  const isCorrect = currentQuestion && selectedOption === currentQuestion.correctAnswer;

  const handleSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleCheck = () => {
    if (selectedOption === null || !currentQuestion) return;
    
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
    } else if (includeKenyaScenario) {
      // Transition to Kenya dilemma stage
      setInScenarioStage(true);
    } else {
      onComplete(score, questions.length);
    }
  };

  const handleSelectScenario = (id: string) => {
    if (!scenarioAnswered) {
      setSelectedScenarioOpt(id);
    }
  };

  const handleCheckScenario = () => {
    if (!selectedScenarioOpt) return;
    setScenarioAnswered(true);
    const chosen = kenyaScenarioDilemma.options.find(o => o.id === selectedScenarioOpt);
    if (chosen?.isOptimal) {
      setScore(s => s + 1);
    }
  };

  const handleFinishAssessment = async () => {
    setIsSubmitting(true);
    const totalWithScenario = questions.length + 1;
    const finalScore = score + (selectedScenarioOpt === 'ke-opt-1' ? 1 : 0);

    // Persist to server if authenticated
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (token && moduleId) {
      try {
        await fetch('/api/v1/assessments/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            moduleId,
            answers: {},
            totalQuestions: totalWithScenario,
            scenarioDilemmaChoice: selectedScenarioOpt
          })
        });
      } catch (err) {
        // non-blocking
      }
    }

    setIsSubmitting(false);
    onComplete(finalScore, totalWithScenario);
  };

  // If in Scenario Dilemma Stage
  if (inScenarioStage) {
    const chosenOpt = kenyaScenarioDilemma.options.find(o => o.id === selectedScenarioOpt);

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 md:p-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-100 text-forest-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Kenyan Field Dilemma Assessment
            </span>
            <span className="text-xs font-semibold text-gray-500">Nairobi River Basin</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
            {kenyaScenarioDilemma.title}
          </h2>
          <div className="text-xs font-semibold text-emerald-800 mb-4 flex items-center gap-1">
            📍 {kenyaScenarioDilemma.location}
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs md:text-sm text-emerald-950 leading-relaxed mb-6">
            <strong>Context: </strong>{kenyaScenarioDilemma.context}
          </div>

          <p className="font-bold text-gray-900 text-sm md:text-base mb-4">
            {kenyaScenarioDilemma.question}
          </p>

          <div className="space-y-3 mb-6">
            {kenyaScenarioDilemma.options.map((opt) => {
              let borderClass = "border-gray-200 hover:border-forest-green/40 bg-white";
              if (scenarioAnswered) {
                if (opt.isOptimal) {
                  borderClass = "border-emerald-500 bg-emerald-50/80 text-emerald-950";
                } else if (opt.id === selectedScenarioOpt) {
                  borderClass = "border-red-400 bg-red-50 text-red-950";
                } else {
                  borderClass = "border-gray-200 bg-gray-50 opacity-60";
                }
              } else if (selectedScenarioOpt === opt.id) {
                borderClass = "border-forest-green bg-emerald-50/40";
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectScenario(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer ${borderClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedScenarioOpt === opt.id ? 'border-forest-green bg-forest-green text-white' : 'border-gray-300'
                    }`}>
                      {selectedScenarioOpt === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-gray-900 mb-1">{opt.strategy}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{opt.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanatory feedback */}
          {scenarioAnswered && chosenOpt && (
            <div className={`p-4 rounded-2xl mb-6 text-xs md:text-sm ${
              chosenOpt.isOptimal ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {chosenOpt.isOptimal ? <CheckCircle className="w-5 h-5 text-emerald-700" /> : <XCircle className="w-5 h-5 text-amber-700" />}
                <span>{chosenOpt.isOptimal ? 'Optimal Resilient Solution!' : 'Sub-optimal Adaptation Strategy:'}</span>
              </div>
              <p className="leading-relaxed">{chosenOpt.explanation}</p>
            </div>
          )}

          <div className="flex justify-end">
            {!scenarioAnswered ? (
              <button
                onClick={handleCheckScenario}
                disabled={!selectedScenarioOpt}
                className="bg-forest-green text-white px-8 py-3 rounded-xl font-bold hover:bg-forest-green/90 disabled:opacity-50 transition"
              >
                {isSwahili ? 'Thibitisha Uamuzi' : 'Submit Adaptation Strategy'}
              </button>
            ) : (
              <button
                onClick={handleFinishAssessment}
                disabled={isSubmitting}
                className="bg-forest-green text-white px-8 py-3 rounded-xl font-bold hover:bg-forest-green/90 transition flex items-center gap-2 shadow-sm"
              >
                <span>{isSubmitting ? 'Evaluating...' : (isSwahili ? 'Kamilisha Jaribio' : 'See Results')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard Questions Stage
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
          <span>{isSwahili ? 'Swali' : 'Question'} {currentIndex + 1} of {questions.length} (70% Pass Threshold)</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
          {questions.map((_, idx) => (
            <div 
              key={idx}
              className={`h-full flex-1 border-r border-white/20 last:border-0 ${
                idx < currentIndex ? 'bg-forest-green' : idx === currentIndex ? 'bg-emerald-400' : 'bg-gray-200'
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
          <div className="mb-2">
            <span className="text-[10px] uppercase font-bold text-forest-green bg-forest-green/10 px-2 py-0.5 rounded-full">
              Assessment Item {currentIndex + 1}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
            {currentQuestion?.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion?.options.map((option, idx) => {
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
                  btnClass += "border-forest-green bg-emerald-50/50";
                } else {
                  btnClass += "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/20 cursor-pointer";
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
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      idx === selectedOption ? 'border-forest-green' : 'border-gray-300'
                    }`}>
                      {idx === selectedOption && <div className="w-2.5 h-2.5 rounded-full bg-forest-green" />}
                    </div>
                    <span className="font-medium text-xs md:text-sm">{option}</span>
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
                <div className={`p-4 rounded-xl flex gap-3 text-xs md:text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-950' : 'bg-red-50 text-red-950'}`}>
                  {isCorrect ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-700" /> : <XCircle className="w-5 h-5 shrink-0 text-red-600" />}
                  <div>
                    <h4 className="font-bold mb-1">
                      {isCorrect 
                        ? (isSwahili ? 'Sahihi!' : 'Correct!') 
                        : (isSwahili ? 'Fikiria njia nyingine.' : 'Consider another approach.')}
                    </h4>
                    <p className="opacity-90 leading-relaxed">{currentQuestion.explanation}</p>
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
                className="bg-forest-green text-white px-8 py-3 rounded-xl font-bold hover:bg-forest-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSwahili ? 'Thibitisha' : 'Check Answer'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-forest-green text-white px-8 py-3 rounded-xl font-bold hover:bg-forest-green/90 transition-colors flex items-center gap-2"
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
