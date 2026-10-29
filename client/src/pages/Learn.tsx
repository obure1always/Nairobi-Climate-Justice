import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Play, 
  RotateCcw, 
  Bot, 
  Compass, 
  ClipboardCheck, 
  BookA,
  Tv
} from 'lucide-react';

export default function Learn() {
  const { language } = useLanguage();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';
  const currentModules = modules[language];

  return (
    <div className="p-6 md:p-8 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {isSwahili ? 'Mtaala wa Tabianchi' : 'Climate Justice Curriculum'}
        </h1>
        <p className="text-gray-600">
          {isSwahili 
            ? 'Kamilisha moduli hizi saba zilizobuniwa mahsusi kwa ajili ya vijana wa Kibera na Ruaraka, Nairobi. Masomo yote yana maelezo kamili na yanafanya kazi bila mtandao.' 
            : 'Complete these seven comprehensive modules designed for Nairobi youth in Kibera and Ruaraka. Includes full substantive lessons, practical examples, and offline quizzes.'}
        </p>
      </div>

      {/* Quick Interactive Tools Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        <Link
          to="/awareness"
          className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-forest-green hover:shadow-md transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
            <Tv className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-gray-900">{isSwahili ? 'Video za Tabianchi' : 'Awareness Hub'}</span>
          <span className="text-[10px] text-gray-500">{isSwahili ? 'Ushahidi & Hatua' : 'Verified Videos'}</span>
        </Link>

        <Link
          to="/buddy"
          className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-forest-green hover:shadow-md transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-forest-green/10 text-forest-green flex items-center justify-center mb-2 group-hover:scale-110 transition">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-gray-900">Climate Buddy</span>
          <span className="text-[10px] text-gray-500">{isSwahili ? 'Msaidizi wa Sauti' : 'Voice Assistant'}</span>
        </Link>

        <Link
          to="/scenarios"
          className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-forest-green hover:shadow-md transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-gray-900">{isSwahili ? 'Matukio (14)' : 'Scenarios (14)'}</span>
          <span className="text-[10px] text-gray-500">{isSwahili ? 'Mazoezi ya Uamuzi' : 'Decision Dilemmas'}</span>
        </Link>

        <Link
          to="/action-guides"
          className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-forest-green hover:shadow-md transition flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-gray-900">{isSwahili ? 'Miongozo (7)' : 'Action Guides'}</span>
          <span className="text-[10px] text-gray-500">{isSwahili ? 'Mbinu za Mtaani' : 'Checklists & Steps'}</span>
        </Link>

        <Link
          to="/glossary"
          className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-forest-green hover:shadow-md transition flex flex-col items-center text-center group col-span-2 sm:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition">
            <BookA className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-gray-900">{isSwahili ? 'Kamusi (70+)' : 'Glossary (70+)'}</span>
          <span className="text-[10px] text-gray-500">{isSwahili ? 'Istilahi za Tabianchi' : 'Bilingual Terms'}</span>
        </Link>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {currentModules.map((module, index) => {
          const modProgress = progress[module.id];
          const isCompleted = modProgress?.completed;
          const completedCount = modProgress?.completedLessons?.length || 0;
          const totalLessons = module.content.length;
          const percent = isCompleted ? 100 : Math.round((completedCount / totalLessons) * 100);
          const inProgress = percent > 0 && percent < 100;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              key={module.id} 
              className={`bg-white rounded-organic border ${isCompleted ? 'border-forest-green/30' : 'border-gray-200'} shadow-natural overflow-hidden flex flex-col md:flex-row`}
            >
              <div className="md:w-64 h-48 md:h-auto relative bg-gray-100">
                {module.image && (
                  <img src={module.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                {isCompleted && (
                  <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-white drop-shadow-md" />
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-forest-green uppercase tracking-wider">
                      {isSwahili ? 'Moduli' : 'Module'} {index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {totalLessons} {isSwahili ? 'Masomo' : 'Lessons'} • {module.quiz.length} {isSwahili ? 'Maswali' : 'Quizzes'}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {module.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                      <span>{isCompleted ? (isSwahili ? 'Imekamilika' : 'Completed') : (isSwahili ? 'Maendeleo' : 'Progress')}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isCompleted ? 'bg-forest-green' : 'bg-forest-green/70'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/module/${module.id}`)}
                      className={`flex-1 py-3 px-5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm ${
                        isCompleted
                          ? 'bg-cream-bg text-earth-brown hover:bg-earth-brown/10 border border-earth-brown/20'
                          : inProgress
                          ? 'bg-forest-green text-white hover:bg-forest-green/90'
                          : 'bg-forest-green text-white hover:bg-forest-green/90'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          {isSwahili ? 'Pitia Somo Tena' : 'Review Module'}
                        </>
                      ) : inProgress ? (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          {isSwahili ? 'Endelea Kujifunza' : 'Continue Learning'}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          {isSwahili ? 'Anza Somo Hili' : 'Start Module'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
