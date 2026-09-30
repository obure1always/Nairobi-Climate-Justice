import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { Trophy, Star, BookOpen } from 'lucide-react';
import { modules } from '../data/modules';

export default function Progress() {
  const { language } = useLanguage();
  const { progress, achievements } = useProgress();
  const isSwahili = language === 'sw';
  const currentModules = modules[language];

  const completedModulesCount = Object.values(progress).filter(p => p.completed).length;
  const totalModules = currentModules.length;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isSwahili ? 'Maendeleo Yako' : 'Your Progress'}
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-4">
          <Trophy className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {completedModulesCount} {isSwahili ? 'Kati ya' : 'out of'} {totalModules} {isSwahili ? 'Masomo Yamekamilika' : 'Modules Completed'}
        </h2>
        <div className="max-w-md mx-auto mt-6 bg-gray-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-1000" 
            style={{ width: `${(completedModulesCount / totalModules) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-yellow-500 w-6 h-6" />
            <h3 className="text-lg font-bold">{isSwahili ? 'Mafanikio' : 'Achievements'}</h3>
          </div>
          {achievements.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {isSwahili ? 'Kamilisha masomo ili upate mafanikio.' : 'Complete lessons to earn achievements.'}
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {achievements.map(id => (
                <li key={id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {id}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-blue-500 w-6 h-6" />
            <h3 className="text-lg font-bold">{isSwahili ? 'Historia ya Kujifunza' : 'Learning History'}</h3>
          </div>
          <p className="text-gray-500 text-sm">
            {isSwahili ? 'Masomo yako uliyokamilisha hivi karibuni yataonekana hapa.' : 'Your recently completed modules will appear here.'}
          </p>
        </div>
      </div>
    </div>
  );
}
