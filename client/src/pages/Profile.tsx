import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { User, Globe, Shield } from 'lucide-react';

export default function Profile() {
  const { language, setLanguage } = useLanguage();
  const { updateSettings, progress } = useProgress();
  const isSwahili = language === 'sw';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'sw';
    setLanguage(newLang);
    updateSettings({ language: newLang });
  };

  const handleReset = () => {
    if (window.confirm(isSwahili ? 'Una uhakika unataka kufuta maendeleo yako yote?' : 'Are you sure you want to reset all your progress?')) {
      // In a real app we'd clear the DB here and reload
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isSwahili ? 'Profaili na Mipangilio' : 'Profile & Settings'}
      </h1>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Learner</h2>
              <p className="text-gray-500 text-sm">
                {Object.values(progress).filter(p => p.completed).length} {isSwahili ? 'Masomo Yamekamilika' : 'Modules Completed'}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 flex items-center gap-2">
            <Globe className="w-4 h-4" /> {isSwahili ? 'Lugha' : 'Language'}
          </div>
          <div className="p-6">
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4" /> {isSwahili ? 'Faragha na Data' : 'Privacy & Data'}
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              {isSwahili 
                ? 'Maendeleo yako yanahifadhiwa kwenye kifaa chako.' 
                : 'Your learning progress is saved locally on your device.'}
            </p>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
            >
              {isSwahili ? 'Futa Maendeleo' : 'Reset Progress'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
