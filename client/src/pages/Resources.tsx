import { ExternalLink, HelpCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { resourceCategories, resources } from '../data/resources';

export default function Resources() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isSwahili ? 'Rasilimali' : 'Resources'}
      </h1>
      <p className="text-gray-600 mb-8">
        {isSwahili ? 'Viungo muhimu kwa elimu zaidi na hatua.' : 'Useful links for further education and action.'}
      </p>

      <div className="space-y-8">
        {resourceCategories.map((category) => {
          const categoryResources = resources.filter(r => r.category === category.id);
          
          if (categoryResources.length === 0) return null;

          return (
            <div key={category.id} className="bg-white rounded-organic shadow-natural border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <category.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold">
                  {isSwahili ? category.titleSw : category.titleEn}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryResources.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col p-5 rounded-organic border border-gray-200 bg-gray-50 hover:border-forest-green/30 hover:bg-cream-bg/50 transition-colors h-full shadow-natural"
                  >
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                        Source: {item.source}
                      </div>
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-forest-green hover:bg-forest-green/90 text-white text-sm font-bold rounded-full transition-colors focus:ring-4 focus:ring-forest-green/30 outline-none shadow-natural"
                      >
                        {isSwahili ? 'Fungua Rasilimali' : 'Open Resource'}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {resources.length === 0 && (
          <div className="text-center p-12 bg-white rounded-organic border border-gray-100 shadow-natural">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isSwahili ? 'Hakuna Rasilimali Zilizopatikana' : 'No Resources Found'}
            </h3>
            <p className="text-gray-500">
              {isSwahili 
                ? 'Tafadhali rudi tena baadaye kwa rasilimali mpya.' 
                : 'Please check back later for new resources.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
