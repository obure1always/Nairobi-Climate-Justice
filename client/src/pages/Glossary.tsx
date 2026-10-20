import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { glossaryTerms, type GlossaryTerm } from '../data/glossary';
import { speakText, stopSpeech, isSpeechSupported } from '../lib/speech';

export default function Glossary() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [speakingTermId, setSpeakingTermId] = useState<string | null>(null);

  const categories = [
    { id: 'all', titleEn: 'All Terms', titleSw: 'Istilahi Zote' },
    { id: 'climate-science', titleEn: 'Climate Science', titleSw: 'Sayansi ya Tabianchi' },
    { id: 'flooding-drainage', titleEn: 'Flooding & Drainage', titleSw: 'Mafuriko na Mifereji' },
    { id: 'heat-health', titleEn: 'Heat & Health', titleSw: 'Joto na Afya' },
    { id: 'water-sanitation', titleEn: 'Water & Sanitation', titleSw: 'Maji na Usafi' },
    { id: 'climate-justice', titleEn: 'Climate Justice', titleSw: 'Haki ya Tabianchi' },
    { id: 'green-claims', titleEn: 'Green Claims', titleSw: 'Madai ya Kijani' },
    { id: 'civic-governance', titleEn: 'Civic Governance', titleSw: 'Utawala wa Kiraia' }
  ];

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesCat = selectedCategory === 'all' || term.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const termMatch = term.term.en.toLowerCase().includes(q) || term.term.sw.toLowerCase().includes(q);
      const defMatch = term.definition.en.toLowerCase().includes(q) || term.definition.sw.toLowerCase().includes(q);
      const exMatch = term.example.en.toLowerCase().includes(q) || term.example.sw.toLowerCase().includes(q);

      return matchesCat && (termMatch || defMatch || exMatch);
    });
  }, [searchQuery, selectedCategory]);

  const handleSpeak = (term: GlossaryTerm) => {
    if (speakingTermId === term.id) {
      stopSpeech();
      setSpeakingTermId(null);
      return;
    }

    stopSpeech();
    setSpeakingTermId(term.id);

    const textToSpeak = `${term.term[language]}. ${term.definition[language]}`;
    speakText(textToSpeak, language, 1.0, {
      onEnd: () => setSpeakingTermId(null),
      onError: () => setSpeakingTermId(null)
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-green/10 text-forest-green text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          {isSwahili ? 'Kamusi ya Tabianchi (Istilahi 70+)' : 'Climate & Justice Glossary (70+ Terms)'}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isSwahili ? 'Kamusi ya Mazingira na Haki' : 'Bilingual Climate Glossary'}
        </h1>
        <p className="text-gray-600">
          {isSwahili 
            ? 'Tafuta na ujifunze tafsiri na mifano halisi ya istilahi za tabianchi kwa Kiingereza na Kiswahili. Inafanya kazi bila mtandao.' 
            : 'Search and understand essential climate justice concepts with clear English and Kiswahili definitions and practical Nairobi examples. Fully offline-accessible.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-organic border border-gray-200 shadow-natural p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="glossary-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isSwahili ? 'Tafuta istilahi yoyote (k.m., albedo, mafuriko, CBDR, klorini)...' : 'Search any term (e.g., albedo, runoff, CBDR, chlorination, greenwashing)...'}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-forest-green focus:ring-4 focus:ring-forest-green/20 outline-none transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? glossaryTerms.length 
              : glossaryTerms.filter(t => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-forest-green text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{isSwahili ? cat.titleSw : cat.titleEn}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-gray-200 text-gray-700'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-organic border border-gray-200 p-5 shadow-natural hover:border-forest-green/40 hover:bg-cream-bg/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {item.term[language]}
                  </h2>
                  <span className="text-xs text-forest-green font-semibold">
                    {language === 'sw' ? item.term.en : item.term.sw}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green">
                    {item.moduleId.toUpperCase()}
                  </span>
                  {isSpeechSupported() && (
                    <button
                      onClick={() => handleSpeak(item)}
                      className={`p-1.5 rounded-full transition-colors ${
                        speakingTermId === item.id 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isSwahili ? 'Sikiliza fasili' : 'Listen to definition'}
                    >
                      {speakingTermId === item.id ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {item.definition[language]}
              </p>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600">
                <span className="font-bold text-gray-800 flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  {isSwahili ? 'Mfano Halisi:' : 'Practical Example:'}
                </span>
                {item.example[language]}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 capitalize">
                {item.category.replace('-', ' ')}
              </span>
              <Link
                to={`/module/${item.moduleId}`}
                className="text-forest-green hover:underline font-semibold"
              >
                {isSwahili ? 'Soma Moduli' : 'View Module'} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center p-12 bg-white rounded-organic border border-gray-200 shadow-natural mt-6">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {isSwahili ? 'Hakuna Istilahi Iliyopatikana' : 'No Terms Found'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {isSwahili 
              ? 'Jaribu kutafuta kwa jina lingine au onyesha istilahi zote.' 
              : 'Try searching with another word or reset filters to view all 70 terms.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-5 py-2 bg-forest-green text-white text-xs font-bold rounded-full hover:bg-forest-green/90"
          >
            {isSwahili ? 'Onyesha Zote' : 'Reset Search'}
          </button>
        </div>
      )}
    </div>
  );
}
