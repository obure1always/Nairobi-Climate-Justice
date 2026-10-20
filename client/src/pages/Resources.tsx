import { useState, useMemo } from 'react';
import { ExternalLink, HelpCircle, Search, ShieldCheck, Calendar, Info } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { resourceCategories, resources } from '../data/resources';

export default function Resources() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const titleMatch = (item.title || '').toLowerCase().includes(q) || (item.titleSw || '').toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q) || (item.descriptionSw || '').toLowerCase().includes(q);
      const sourceMatch = (item.source || '').toLowerCase().includes(q);
      const whyMatch = (item.whyUseful?.en || '').toLowerCase().includes(q) || (item.whyUseful?.sw || '').toLowerCase().includes(q);

      return matchesCategory && (titleMatch || descMatch || sourceMatch || whyMatch);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-green/10 text-forest-green text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          {isSwahili ? 'Rasilimali Zilizothibitishwa 100%' : '100% Verified Offline-Searchable Directory'}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isSwahili ? 'Kituo cha Rasilimali za Tabianchi' : 'Climate Justice Resource Directory'}
        </h1>
        <p className="text-gray-600">
          {isSwahili 
            ? 'Soma nyaraka rasmi za sheria, sera za Kaunti ya Nairobi, miongozo ya afya, na mbinu za usalama wa maji. Maelezo yote yanapatikana bila mtandao.' 
            : 'Explore Kenyan climate laws, Nairobi County plans, WHO health guides, seasonal forecasts, and civic action templates. All summaries remain readable offline.'}
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white rounded-organic border border-gray-200 shadow-natural p-4 mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="resource-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isSwahili ? 'Tafuta rasilimali kwa jina, mada, au taasisi...' : 'Search resources by title, topic, policy, or organization...'}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-forest-green focus:ring-4 focus:ring-forest-green/20 outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-forest-green text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isSwahili ? 'Zote' : 'All Categories'} ({resources.length})
          </button>
          {resourceCategories.map((cat) => {
            const count = resources.filter(r => r.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest-green text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{isSwahili ? cat.titleSw : cat.titleEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-gray-200 text-gray-700'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Rendering */}
      <div className="space-y-8">
        {resourceCategories.map((category) => {
          const categoryItems = filteredResources.filter(r => r.category === category.id);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="bg-white rounded-organic shadow-natural border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="bg-forest-green/10 text-forest-green p-2.5 rounded-xl">
                  <category.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {isSwahili ? category.titleSw : category.titleEn}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {categoryItems.length} {isSwahili ? 'rasilimali zilizothibitishwa' : 'verified resources'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {categoryItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col p-5 rounded-organic border border-gray-200 bg-gray-50/70 hover:border-forest-green/40 hover:bg-cream-bg/40 transition-all h-full shadow-natural"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green uppercase tracking-wider">
                        {item.sourceType.replace('-', ' ')}
                      </span>
                      {item.dateOrVersion && (
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.dateOrVersion}
                        </span>
                      )}
                    </div>

                    <div className="flex-grow mb-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 leading-snug">
                        {isSwahili && item.titleSw ? item.titleSw : item.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {isSwahili && item.descriptionSw ? item.descriptionSw : item.description}
                      </p>

                      {/* Why Useful Box */}
                      {item.whyUseful && (
                        <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600 mb-3 flex items-start gap-2">
                          <Info className="w-4 h-4 text-forest-green shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-gray-800">{isSwahili ? 'Kwa nini inasaidia: ' : 'Why it matters: '}</span>
                            {isSwahili ? item.whyUseful.sw : item.whyUseful.en}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-gray-200/60 flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-gray-500 truncate max-w-[55%]">
                        {item.source}
                      </div>
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-forest-green hover:bg-forest-green/90 text-white text-xs font-bold rounded-full transition-colors focus:ring-4 focus:ring-forest-green/30 outline-none shadow-sm shrink-0"
                      >
                        {isSwahili ? 'Fungua Chanzo' : 'Open Source'}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="text-center p-12 bg-white rounded-organic border border-gray-100 shadow-natural">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isSwahili ? 'Hakuna Rasilimali Zilizopatikana' : 'No Resources Found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {isSwahili 
                ? 'Hakuna rasilimali inayolingana na utafutaji wako. Jaribu maneno mengine.' 
                : 'No resources matched your search query. Try searching for "flood", "law", "KMD", or "WHO".'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 bg-forest-green text-white text-xs font-bold rounded-full hover:bg-forest-green/90"
            >
              {isSwahili ? 'Onyesha Zote' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
