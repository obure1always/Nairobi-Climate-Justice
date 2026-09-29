import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { motion } from 'framer-motion';
import { CheckCircle, Play, RotateCcw, Trophy } from 'lucide-react';

export default function Learn() {
  const { language } = useLanguage();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';
  const currentModules = modules[language];

  return (
    <div className="p-6 md:p-8 pb-24 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isSwahili ? 'Jifunze' : 'Learning Modules'}
        </h1>
        <p className="text-gray-600">
          {isSwahili 
            ? 'Kamilisha masomo haya saba ili kuelewa na kuchukua hatua kuhusu haki ya hali ya hewa Nairobi.' 
            : 'Complete these seven modules to understand and take action on climate justice in Nairobi.'}
        </p>
      </div>

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
              transition={{ delay: index * 0.1 }}
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
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm font-bold text-green-600 mb-1 uppercase tracking-wider">
                  {isSwahili ? 'Somo' : 'Module'} {index + 1}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1">{module.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 w-full max-w-xs flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-green-400'}`} style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-8">{percent}%</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/module/${module.id}`)}
                    className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-natural ${
                      isCompleted 
                        ? 'bg-cream-bg text-earth-brown hover:bg-earth-brown/10 border border-earth-brown/20'
                        : 'bg-forest-green text-white hover:bg-forest-green/90'
                    }`}
                  >
                    {isCompleted ? (
                      <><RotateCcw className="w-4 h-4" /> {isSwahili ? 'Pitia Tena' : 'Review'}</>
                    ) : inProgress ? (
                      <><Play className="w-4 h-4" /> {isSwahili ? 'Endelea' : 'Continue'}</>
                    ) : (
                      <><Play className="w-4 h-4" /> {isSwahili ? 'Anza' : 'Start'}</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Final Assessment Prompt */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 bg-gray-900 rounded-3xl p-8 text-center text-white"
      >
        <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {isSwahili ? 'Tathmini ya Mwisho' : 'Final Assessment'}
        </h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          {isSwahili 
            ? 'Kamilisha masomo yote saba ili kufungua mtihani wa mwisho na kupata cheti chako.'
            : 'Complete all seven modules to unlock the final assessment and earn your completion.'}
        </p>
        <button 
          onClick={() => navigate('/assessment')}
          className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
        >
          {isSwahili ? 'Nenda Kwenye Tathmini' : 'Go to Assessment'}
        </button>
      </motion.div>
    </div>
  );
}
