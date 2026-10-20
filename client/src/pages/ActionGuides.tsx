import { useState } from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  Users, 
  Package, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { actionGuides } from '../data/actionGuides';

export default function ActionGuides() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [expandedGuideId, setExpandedGuideId] = useState<string>(actionGuides[0]?.id || '');

  const moduleFilters = [
    { id: 'all', titleEn: 'All 7 Action Guides', titleSw: 'Miongozo Yote 7' },
    { id: 'm1', titleEn: 'M1: Risk Mapping', titleSw: 'M1: Ramani ya Hatari' },
    { id: 'm2', titleEn: 'M2: Flood Readiness', titleSw: 'M2: Mafuriko' },
    { id: 'm3', titleEn: 'M3: Heat Reduction', titleSw: 'M3: Kupunguza Joto' },
    { id: 'm4', titleEn: 'M4: Water Safety', titleSw: 'M4: Usalama wa Maji' },
    { id: 'm5', titleEn: 'M5: Project Checklist', titleSw: 'M5: Tathmini ya Miradi' },
    { id: 'm6', titleEn: 'M6: Green Claims', titleSw: 'M6: Madai ya Kijani' },
    { id: 'm7', titleEn: 'M7: Civic Memorandums', titleSw: 'M7: Ushiriki wa Umma' }
  ];

  const filteredGuides = actionGuides.filter(
    g => selectedModule === 'all' || g.moduleId === selectedModule
  );

  const toggleExpand = (id: string) => {
    setExpandedGuideId(prev => prev === id ? '' : id);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-green/10 text-forest-green text-xs font-semibold uppercase tracking-wider mb-2">
          <ClipboardCheck className="w-4 h-4" />
          {isSwahili ? 'Miongozo ya Vitendo vya Jamii (Miongozo 7)' : 'Practical Community Action Guides (7 Guides)'}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isSwahili ? 'Miongozo ya Vitendo vya Mitaani' : 'Field Action Guides & Checklists'}
        </h1>
        <p className="text-gray-600">
          {isSwahili 
            ? 'Miongozo ya vitendo ya hatua kwa hatua ya gharama nafuu ya kulinda familia, kusafisha mitaro, kupunguza joto, kutibu maji, na kuandika memoranda za kisheria.' 
            : 'Step-by-step, zero-to-low-cost practical protocols for mapping risk, floodproofing rooms, treating water, cooling homes, and drafting county petitions.'}
        </p>
      </div>

      {/* Module Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none text-xs">
        {moduleFilters.map(filter => {
          const isSelected = selectedModule === filter.id;
          const count = filter.id === 'all' 
            ? actionGuides.length 
            : actionGuides.filter(g => g.moduleId === filter.id).length;

          return (
            <button
              key={filter.id}
              onClick={() => setSelectedModule(filter.id)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-forest-green text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{isSwahili ? filter.titleSw : filter.titleEn}</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guides List */}
      <div className="space-y-6">
        {filteredGuides.map((guide) => {
          const isExpanded = expandedGuideId === guide.id;

          return (
            <div
              key={guide.id}
              className="bg-white rounded-organic border border-gray-200 shadow-natural overflow-hidden transition-all"
            >
              {/* Collapsible Card Header */}
              <button
                onClick={() => toggleExpand(guide.id)}
                className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-4 hover:bg-gray-50/70 transition"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest-green px-2.5 py-0.5 rounded-full bg-forest-green/10">
                    {guide.moduleId.toUpperCase()} • {isSwahili ? 'Mwongozo wa Vitendo' : 'Action Guide'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2 mb-1">
                    {guide.title[language]}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {guide.purpose[language]}
                  </p>
                </div>

                <div className="p-2 rounded-full bg-gray-100 text-gray-600 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="p-6 md:p-8 pt-0 border-t border-gray-100 space-y-6">
                  {/* Safety Disclaimer */}
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-0.5">{isSwahili ? 'Ilani Muhimu ya Usalama: ' : 'Important Safety Note: '}</strong>
                      {guide.disclaimer[language]}
                    </div>
                  </div>

                  {/* Target Audience & Materials Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-forest-green" />
                        {isSwahili ? 'Walengwa:' : 'Target Audience:'}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {guide.targetAudience[language]}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-forest-green" />
                        {isSwahili ? 'Vifaa Vinavyohitajika:' : 'Materials Needed:'}
                      </div>
                      <ul className="space-y-1 text-gray-700">
                        {guide.materialsNeeded[language].map((mat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-forest-green font-bold">•</span>
                            <span>{mat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step-by-Step Action Protocol */}
                  <div>
                    <h3 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-forest-green" />
                      {isSwahili ? 'Hatua za Utekelezaji:' : 'Step-by-Step Action Protocol:'}
                    </h3>

                    <div className="space-y-4">
                      {guide.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="p-5 rounded-2xl bg-cream-bg/40 border border-gray-200 hover:border-forest-green/40 transition"
                        >
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className="w-6 h-6 rounded-full bg-forest-green text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {st.stepNumber}
                            </span>
                            <h4 className="font-bold text-sm md:text-base text-gray-900">
                              {st.title[language]}
                            </h4>
                          </div>

                          <p className="text-sm text-gray-800 leading-relaxed mb-3 pl-8">
                            {st.action[language]}
                          </p>

                          <div className="ml-8 p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                            <span className="font-bold text-forest-green">
                              {isSwahili ? 'Kidokezo: ' : 'Practical Tip: '}
                            </span>
                            {st.tips[language]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
