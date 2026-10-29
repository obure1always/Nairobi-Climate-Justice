import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { climateLearningPathways } from '../data/pathways';
import { 
  Compass, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Layers, 
  FileCheck, 
  Filter
} from 'lucide-react';

export default function Pathways() {
  const { language } = useLanguage();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';

  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredPathways = climateLearningPathways.filter(p => 
    levelFilter === 'all' || p.level === levelFilter
  );

  return (
    <div className="min-h-full pb-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-forest-green to-emerald-800 rounded-3xl p-8 md:p-10 text-white shadow-lg mb-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-4 h-4" />
              {isSwahili ? 'Mtaala Uliopangika wa Tabianchi' : 'Structured Climate Curricula'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              {isSwahili ? 'Njia 6 za Mafunzo ya Haki ya Tabianchi' : '6 Climate Justice Learning Pathways'}
            </h1>
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
              {isSwahili
                ? 'Badala ya masomo yaliyotengwa, jifunze kupitia njia zilizopangika kuanzia ngazi ya awali, kati, hadi ya juu, zikijumuisha miradi ya vitendo na vyeti vinavyothibitishwa.'
                : 'Progress from foundational science to advanced municipal policy. Each pathway includes structured prerequisite checks, learning outcomes, linked course modules, and a practical applied project.'}
            </p>
          </div>
        </div>

        {/* Level Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-600">{isSwahili ? 'Chuja kwa Ngazi:' : 'Filter by Level:'}</span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  levelFilter === lvl
                    ? 'bg-forest-green text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-500 font-semibold">
            Showing {filteredPathways.length} of 6 pathways
          </span>
        </div>

        {/* Pathway Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPathways.map((pathway) => {
            // Compute completion of associated modules
            const totalMods = pathway.associatedModuleIds.length;
            const completedMods = pathway.associatedModuleIds.filter(id => progress[id]?.completed).length;
            const isCompleted = totalMods > 0 && completedMods === totalMods;
            const progressPercent = totalMods > 0 ? Math.round((completedMods / totalMods) * 100) : 0;

            const levelColors = {
              beginner: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
              advanced: 'bg-purple-100 text-purple-800 border-purple-200'
            };

            return (
              <div 
                key={pathway.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${levelColors[pathway.level]}`}>
                      {pathway.level}
                    </span>
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {pathway.durationHours} hrs
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-forest-green transition-colors leading-snug mb-2">
                    {isSwahili ? pathway.swTitle : pathway.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {isSwahili ? pathway.swDescription : pathway.description}
                  </p>

                  {/* Prerequisites */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200/70 text-xs">
                    <span className="font-bold text-gray-700 block mb-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-gray-500" />
                      {isSwahili ? 'Sharti Kabla:' : 'Prerequisites:'}
                    </span>
                    <p className="text-gray-600 text-[11px]">{pathway.prerequisites.join(', ')}</p>
                  </div>

                  {/* Key Learning Outcomes (Top 2) */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      {isSwahili ? 'Matokeo Makuu ya Mafunzo:' : 'Key Learning Outcomes:'}
                    </span>
                    {pathway.learningOutcomes.slice(0, 2).map((outc, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{outc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Applied Project Brief */}
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-950 mb-4">
                    <span className="font-bold text-amber-900 block mb-0.5 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                      {isSwahili ? 'Mradi wa Vitendo wa Mwisho:' : 'Final Applied Project:'}
                    </span>
                    <p className="text-[11px] text-amber-900 font-medium">
                      {pathway.finalProjectTitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Progress & Action CTA */}
                <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
                  <div className="pt-4 mb-3">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                      <span>Pathway Progress</span>
                      <span>{completedMods} of {totalMods} Modules ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-forest-green h-full rounded-full transition-all"
                        style={{ width: `${Math.max(4, progressPercent)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const firstModule = pathway.associatedModuleIds[0] || 'm1';
                      navigate(`/module/${firstModule}`);
                    }}
                    className="w-full py-2.5 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{isCompleted ? 'Review Pathway' : (progressPercent > 0 ? 'Resume Pathway' : 'Start Pathway')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
