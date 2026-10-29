import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { language, setLanguage } = useLanguage();
  const { updateSettings } = useProgress();
  const navigate = useNavigate();

  const handleLanguageSelect = (lang: 'en' | 'sw') => {
    setLanguage(lang);
    setStep(2);
  };

  const handleComplete = async () => {
    try {
      // Register with backend
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ageGroup: 'Unknown', 
          location: 'Nairobi', 
          educationStatus: 'Unknown', 
          gender: 'Unknown' 
        })
      });
      if (res.ok) {
        const { participantId } = await res.json();
        localStorage.setItem('participantId', participantId);
      }
    } catch (e) {
      console.error('Failed to register participant:', e);
    }
    
    await updateSettings({ onboardingComplete: true, language });
    navigate('/');
  };

  const isSwahili = language === 'sw';

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 font-inter">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white rounded-organic shadow-natural p-8 space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-green-800">Welcome</h1>
              <p className="text-gray-600">Choose your preferred language to start learning.</p>
              <p className="text-gray-600 text-sm">Chagua lugha unayopendelea kuanza kujifunza.</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleLanguageSelect('en')}
                className="w-full py-4 px-6 rounded-organic border-2 border-earth-brown/20 hover:border-forest-green hover:bg-cream-bg/50 transition-all font-medium text-lg flex items-center justify-between"
              >
                <span>English</span>
                <span className="text-2xl">🇬🇧</span>
              </button>
              
              <button
                onClick={() => handleLanguageSelect('sw')}
                className="w-full py-4 px-6 rounded-organic border-2 border-earth-brown/20 hover:border-forest-green hover:bg-cream-bg/50 transition-all font-medium text-lg flex items-center justify-between"
              >
                <span>Kiswahili</span>
                <span className="text-2xl">🇰🇪</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white rounded-organic shadow-natural p-8 space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-green-800">
                {isSwahili ? 'Jinsi Kujifunza Kunavyofanya Kazi' : 'How Learning Works'}
              </h1>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{isSwahili ? 'Jifunze' : 'Learn'}</h3>
                  <p className="text-gray-600 text-sm">{isSwahili ? 'Soma kuhusu hali ya hewa ya Nairobi.' : 'Read about Nairobi\'s climate.'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{isSwahili ? 'Jibu Maswali' : 'Practice & Quiz'}</h3>
                  <p className="text-gray-600 text-sm">{isSwahili ? 'Jibu maswali ili kujaribu uelewa wako.' : 'Answer questions to test your understanding.'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{isSwahili ? 'Fuatilia Maendeleo' : 'Track Progress'}</h3>
                  <p className="text-gray-600 text-sm">{isSwahili ? 'Pata mafanikio unapojifunza.' : 'Earn achievements as you learn.'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 bg-forest-green hover:bg-forest-green/90 text-white rounded-full font-bold text-lg transition-colors shadow-natural"
            >
              {isSwahili ? 'Anza Kujifunza' : 'Start Learning'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
