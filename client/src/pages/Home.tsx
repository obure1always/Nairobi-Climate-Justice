import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { motion } from 'framer-motion';
import { ArrowRight, ThermometerSun, Droplets, CloudRain, Tv, Play } from 'lucide-react';

export default function Home() {
  const { language } = useLanguage();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';
  const currentModules = modules[language];

  const handleStartLearning = () => {
    // Find first unfinished module or default to first
    const unfinishedId = currentModules.find(m => !progress[m.id]?.completed)?.id || currentModules[0].id;
    navigate(`/module/${unfinishedId}`);
  };

  return (
    <div className="min-h-full pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 to-green-700 text-white rounded-b-3xl md:rounded-3xl md:mt-4 md:mx-4 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <motion.div 
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-green-300 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {isSwahili 
              ? 'Elewa hali ya hewa. Jua haki zako. Andaa jamii yako.' 
              : 'Understand the climate. Know your rights. Prepare your community.'}
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-xl">
            {isSwahili
              ? 'Jukwaa hili linakusaidia kuelewa mabadiliko ya tabianchi, hatari za Nairobi, na ushiriki wa kiraia.'
              : 'This platform helps learners understand climate change, Nairobi\'s climate risks, adaptation, climate justice, evaluating claims, and civic participation.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleStartLearning}
              className="bg-white text-forest-green px-8 py-4 rounded-full font-bold text-lg hover:bg-cream-bg transition-colors flex items-center justify-center gap-2 shadow-natural"
            >
              {isSwahili ? 'Anza Kujifunza' : 'Start Learning'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/learn')}
              className="bg-forest-green/90 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-forest-green transition-colors shadow-natural border border-forest-green"
            >
              {isSwahili ? 'Gundua Masomo' : 'Explore the Lessons'}
            </button>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="px-6 md:px-8 mt-12 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isSwahili ? 'Kwa Nini Hili Ni Muhimu' : 'Why This Matters'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: CloudRain, title: isSwahili ? 'Mafuriko Mjini' : 'Urban Flooding', desc: isSwahili ? 'Kuzuia uharibifu wa makazi na maji machafu.' : 'Preventing property damage and contaminated water.' },
            { icon: ThermometerSun, title: isSwahili ? 'Joto Kali' : 'Extreme Heat', desc: isSwahili ? 'Kulinda afya ya jamii wakati wa kiangazi.' : 'Protecting community health during heatwaves.' },
            { icon: Droplets, title: isSwahili ? 'Usalama wa Maji' : 'Water Security', desc: isSwahili ? 'Kuhakikisha maji safi na kuzuia magonjwa.' : 'Ensuring clean access and preventing disease.' }
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white p-6 rounded-organic shadow-natural border border-gray-100 flex items-start gap-4"
            >
              <div className="bg-green-100 p-3 rounded-lg text-green-700">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Climate Change Awareness Section */}
      <section className="px-6 md:px-8 mb-12">
        <div className="bg-forest-green rounded-3xl p-6 sm:p-8 text-white shadow-md border border-emerald-900 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-200 mb-3 border border-white/10">
              <Tv className="w-3.5 h-3.5" />
              {isSwahili ? 'Maudhui ya Kisayansi na Makala' : 'Scientific & Documentary Media'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
              {isSwahili ? 'Uelewa wa Mabadiliko ya Tabianchi' : 'Climate Awareness Media Hub'}
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed mb-4">
              {isSwahili 
                ? 'Tazama video halisi na michoro ya satelaiti kutoka Stockholm Environment Institute, NASA, na VOA News zikieleza ukame wa Afrika Mashariki, nishati safi ya jotoardhi Kenya, na mwenendo wa joto duniani.'
                : 'Watch verified video documentation and satellite data visualizations from Stockholm Environment Institute, NASA, and VOA News documenting East African drought anomalies, geothermal energy in Kenya, and global climate baselines.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/awareness')}
                className="bg-white text-forest-green px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4 fill-forest-green" />
                {isSwahili ? 'Tazama Video Zote' : 'Explore Verified Videos'}
              </button>
              <button
                onClick={() => navigate('/case-studies')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
              >
                {isSwahili ? 'Visa vya Vitendo' : 'Climate Action in Practice'}
              </button>
            </div>
          </div>

          <div 
            className="w-full md:w-64 aspect-video rounded-2xl bg-black/30 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0 relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/awareness')}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform mb-2">
              <Play className="w-5 h-5 ml-0.5 fill-white" />
            </div>
            <span className="text-xs font-bold text-white">
              {isSwahili ? 'Video 6 Zilizothibitishwa' : '6 Verified Videos'}
            </span>
            <span className="text-[10px] text-emerald-200">
              {isSwahili ? 'Kichezaji Asilia • Ufafanuzi Sahihi' : 'Native Player • Verified Sources'}
            </span>
          </div>
        </div>
      </section>

      {/* Modules Summary */}
      <section className="px-6 md:px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSwahili ? 'Masomo Yako' : 'Your Modules'}
          </h2>
          <button 
            onClick={() => navigate('/learn')}
            className="text-green-600 font-medium hover:text-green-700 text-sm"
          >
            {isSwahili ? 'Ona Yote' : 'View All'}
          </button>
        </div>
        
        <div className="space-y-4">
          {currentModules.slice(0, 3).map((module, index) => {
            const isCompleted = progress[module.id]?.completed;
            const completedCount = progress[module.id]?.completedLessons?.length || 0;
            const totalLessons = module.content.length;
            const percent = isCompleted ? 100 : Math.round((completedCount / totalLessons) * 100);

            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={module.id} 
                onClick={() => navigate(`/module/${module.id}`)}
                className="bg-white rounded-organic shadow-natural border border-gray-100 overflow-hidden flex flex-col sm:flex-row cursor-pointer hover:shadow-lg transition-shadow group"
              >
                <div className="sm:w-48 h-32 sm:h-auto relative bg-gray-200">
                  {module.image && (
                    <img src={module.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded">
                    Module {index + 1}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{module.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{module.description}</p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{percent}%</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
