import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'dashboard.title': 'Welcome to ClimateNrb',
    'dashboard.subtitle': 'Your Nairobi Climate Adaptation & Justice Guide',
    'dashboard.modules': 'Learning Modules',
    'dashboard.assessments': 'Assessments',
    'dashboard.baseline': 'Baseline Assessment',
    'dashboard.endline': 'Endline Assessment',
    'lesson.complete': 'Mark as Complete',
    'lesson.completed': 'Module Completed!',
    'lesson.back': 'Back to Dashboard',
    'assessment.submit': 'Submit Assessment',
    'assessment.next': 'Next Question',
  },
  sw: {
    'nav.dashboard': 'Dashibodi',
    'nav.profile': 'Profaili',
    'dashboard.title': 'Karibu ClimateNrb',
    'dashboard.subtitle': 'Mwongozo wako wa Hali ya Hewa na Haki Nairobi',
    'dashboard.modules': 'Moduli za Kujifunza',
    'dashboard.assessments': 'Tathmini',
    'dashboard.baseline': 'Tathmini ya Awali',
    'dashboard.endline': 'Tathmini ya Mwisho',
    'lesson.complete': 'Weka alama kuwa imekamilika',
    'lesson.completed': 'Moduli Imekamilika!',
    'lesson.back': 'Rudi kwenye Dashibodi',
    'assessment.submit': 'Wasilisha Tathmini',
    'assessment.next': 'Swali linalofuata',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
