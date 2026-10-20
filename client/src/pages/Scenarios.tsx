import { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { scenarios } from '../data/scenarios';

export default function Scenarios() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({}); // scenarioId -> optionId

  const moduleFilters = [
    { id: 'all', titleEn: 'All Scenarios', titleSw: 'Mazingira Yote' },
    { id: 'm1', titleEn: 'M1: Risk Planning', titleSw: 'M1: Hatari' },
    { id: 'm2', titleEn: 'M2: Urban Floods', titleSw: 'M2: Mafuriko' },
    { id: 'm3', titleEn: 'M3: Heat & Health', titleSw: 'M3: Joto na Afya' },
    { id: 'm4', titleEn: 'M4: Water Safety', titleSw: 'M4: Usalama wa Maji' },
    { id: 'm5', titleEn: 'M5: Climate Justice', titleSw: 'M5: Haki ya Tabianchi' },
    { id: 'm6', titleEn: 'M6: Green Claims', titleSw: 'M6: Madai ya Kijani' },
    { id: 'm7', titleEn: 'M7: Civic Action', titleSw: 'M7: Ushiriki wa Umma' }
  ];

  const filteredScenarios = scenarios.filter(
    s => selectedModule === 'all' || s.moduleId === selectedModule
  );

  const handleSelectOption = (scenarioId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [scenarioId]: optionId }));
  };

  const handleResetScenario = (scenarioId: string) => {
    setSelectedOptions(prev => {
      const copy = { ...prev };
      delete copy[scenarioId];
      return copy;
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-green/10 text-forest-green text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          {isSwahili ? 'Mafunzo ya Vitendo vya Uamuzi (Matukio 14)' : 'Interactive Scenario Exercises (14 Scenarios)'}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isSwahili ? 'Mazoezi ya Uamuzi wa Mazingira' : 'Climate Dilemmas & Decision Scenarios'}
        </h1>
        <p className="text-gray-600">
          {isSwahili 
            ? 'Jifunze kufanya maamuzi salama na ya haki unapokabiliwa na majanga ya mafuriko, joto kali, mgao wa maji, matangazo ya ulaghai, na mikutano ya bajeti.' 
            : 'Explore real-world decision dilemmas faced by Nairobi youth and families. Test your choices, understand consequences, and build practical resilience offline.'}
        </p>
      </div>

      {/* Module Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none text-xs">
        {moduleFilters.map(filter => {
          const isSelected = selectedModule === filter.id;
          const count = filter.id === 'all' 
            ? scenarios.length 
            : scenarios.filter(s => s.moduleId === filter.id).length;

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

      {/* Scenarios List */}
      <div className="space-y-8">
        {filteredScenarios.map((scenario) => {
          const selectedOptId = selectedOptions[scenario.id];
          const chosenOption = scenario.options.find(o => o.id === selectedOptId);

          return (
            <div
              key={scenario.id}
              className="bg-white rounded-organic border border-gray-200 shadow-natural p-6 md:p-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest-green px-2.5 py-0.5 rounded-full bg-forest-green/10">
                    {scenario.moduleId.toUpperCase()} • {isSwahili ? 'Tukio la Jamii' : 'Field Scenario'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                    {scenario.title[language]}
                  </h2>
                </div>
                {chosenOption && (
                  <button
                    onClick={() => handleResetScenario(scenario.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                    title={isSwahili ? 'Jaribu tena' : 'Reset decision'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Context Badge */}
              <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 mb-4">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{scenario.context[language]}</span>
              </div>

              {/* Situation Prompt */}
              <div className="text-sm md:text-base text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                <strong>{isSwahili ? 'Hali Halisi: ' : 'The Dilemma: '}</strong>
                {scenario.situation[language]}
              </div>

              {/* Decision Options */}
              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {isSwahili ? 'Chagua hatua unayochukua:' : 'Choose your course of action:'}
                </p>

                {scenario.options.map((option, idx) => {
                  const isSelected = selectedOptId === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(scenario.id, option.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-sm leading-relaxed flex items-start gap-3 ${
                        isSelected
                          ? option.isRecommended
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-red-50 border-red-500 ring-2 ring-red-500/20'
                          : 'bg-white border-gray-200 hover:border-forest-green hover:bg-cream-bg/40'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? option.isRecommended
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="flex-grow">
                        <span className="font-medium text-gray-900 block">
                          {option.text[language]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Consequence and Reason Feedback (Revealed on selection) */}
              {chosenOption && (
                <div className={`p-5 rounded-2xl border mb-6 text-sm ${
                  chosenOption.isRecommended
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-red-50/80 border-red-300 text-red-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-2">
                    {chosenOption.isRecommended ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>{isSwahili ? 'Uamuzi Salama na Thabiti!' : 'Resilient & Recommended Choice!'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>{isSwahili ? 'Hatua Yenye Hatari Kubwa!' : 'High-Risk / Harmful Action!'}</span>
                      </>
                    )}
                  </div>

                  <p className="mb-3 leading-relaxed">
                    <strong>{isSwahili ? 'Matokeo: ' : 'Consequence: '}</strong>
                    {chosenOption.consequence[language]}
                  </p>

                  <p className="text-xs opacity-90 leading-relaxed">
                    <strong>{isSwahili ? 'Sababu za Kisayansi/Kisheria: ' : 'Reasoning: '}</strong>
                    {chosenOption.reasoning[language]}
                  </p>
                </div>
              )}

              {/* Reflection and Takeaway (Visible after choice) */}
              {chosenOption && (
                <div className="pt-4 border-t border-gray-100 space-y-3 text-xs">
                  <div className="flex items-start gap-2 text-purple-900 bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-0.5">{isSwahili ? 'Swali la Tafakari:' : 'Reflection Question:'}</strong>
                      {scenario.reflection[language]}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-forest-green bg-forest-green/5 p-3 rounded-xl border border-forest-green/20">
                    <Sparkles className="w-4 h-4 text-forest-green shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-0.5">{isSwahili ? 'Funzo Kuu:' : 'Key Takeaway:'}</strong>
                      {scenario.takeaway[language]}
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
