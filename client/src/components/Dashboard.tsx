import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SyncService } from '../SyncService';
import { useLanguage } from '../LanguageContext';
import { modules } from '../data/modules';

const Dashboard = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const participantId = localStorage.getItem('participantId') || 'Unknown';
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="bg-canvas-bg text-on-surface flex flex-col min-h-screen antialiased">
      <header className="fixed top-0 w-full z-50 bg-canvas-bg/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(25,74,50,0.04)] pt-safe">
        <div className="h-20 px-margin-mobile flex flex-col justify-center gap-1.5 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-primary-container text-[20px] select-none">eco</span>
              <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary-container truncate select-none">CLIMATE JUSTICE NAIROBI</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
                aria-label="Toggle Language" 
                className="min-h-[44px] px-2.5 py-1.5 rounded-full bg-surface-elevated text-on-surface-variant flex items-center gap-1 text-[11px] font-semibold tracking-wider transition-colors hover:bg-surface-container" 
                type="button"
              >
                <span className={language === 'en' ? "text-primary font-bold" : "text-text-muted"}>EN</span>
                <span className="text-outline text-[10px]">|</span>
                <span className={language === 'sw' ? "text-primary font-bold" : "text-text-muted"}>SW</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-text-muted select-none truncate">{t('nav.dashboard')}</span>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-low ${isOnline ? 'text-success-acacia' : 'text-offline-slate'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success-acacia animate-pulse' : 'bg-offline-slate'}`}></span>
              <span className="text-[11px] font-semibold tracking-wide">{isOnline ? 'Mtandaoni • Synced' : 'Nje ya Mtandao • Offline'}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-canvas-bg min-h-screen max-w-md mx-auto">
        <div className="flex flex-col w-full px-margin-mobile pb-space-xl gap-space-lg select-none">
          <section className="flex flex-col gap-space-xs mt-space-sm">
            <div className="flex items-center justify-between gap-space-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                <span className="font-label-sm text-label-sm font-semibold">Nairobi, Kenya</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-elevated text-text-muted font-label-sm text-label-sm">
                ID: {participantId}
              </span>
            </div>
            <div className="flex flex-col mt-1">
              <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight font-bold">
                Habari!
              </h1>
              <p className="font-body-md text-body-md text-text-muted">
                {language === 'en' ? 'Welcome back. Your climate learning journey is saved and offline-ready.' : 'Karibu tena. Safari yako ya kujifunza imehifadhiwa na iko tayari kutumika nje ya mtandao.'}
              </p>
            </div>
          </section>

          <section className="bg-surface-card rounded-[20px] p-space-md shadow-[0_4px_20px_-2px_rgba(25,74,50,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between gap-space-sm">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0 ${isOnline ? 'text-success-acacia' : 'text-offline-slate'}`}>
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{isOnline ? 'wifi_tethering' : 'wifi_off'}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success-acacia' : 'bg-offline-slate'}`}></span>
                    <span className="font-label-md text-label-md text-primary font-semibold truncate">{isOnline ? 'Mtandaoni (Online)' : 'Nje ya Mtandao (Offline)'}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-text-muted truncate">
                    7 modules cached • Progress saved locally
                  </span>
                </div>
              </div>
              <button onClick={() => SyncService.syncNow()} aria-label="Manual Sync" className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-surface-elevated text-primary flex items-center justify-center transition-transform active:rotate-180" type="button">
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </button>
            </div>
          </section>

          <section className="bg-surface-container-low rounded-[20px] p-space-lg shadow-[0_4px_20px_-2px_rgba(25,74,50,0.06)] relative overflow-hidden">
            <div className="flex items-center justify-between gap-space-md mb-space-md">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-semibold">Safari ya Mafunzo • Progress</span>
                <h2 className="font-headline-md text-headline-md text-primary font-bold">0% Imekamilika</h2>
                <span className="font-body-md text-body-md text-on-surface-variant">0 kati ya 7 Modules Finished</span>
              </div>
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                  <circle className="text-surface-variant" cx="24" cy="24" fill="none" r="18" stroke="currentColor" strokeWidth="4.5"></circle>
                  <circle className="text-primary-container" cx="24" cy="24" fill="none" r="18" stroke="currentColor" strokeDasharray="113.1" strokeDashoffset="113.1" strokeLinecap="round" strokeWidth="4.5"></circle>
                </svg>
                <span className="absolute font-label-md text-label-md font-bold text-primary">0%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-surface-card shadow-sm mb-3">
              <div className="flex flex-col items-center text-center">
                <span className="font-title-md text-title-md font-bold text-primary">0</span>
                <span className="font-label-sm text-label-sm text-text-muted leading-tight">Lessons Mastered</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-title-md text-title-md font-bold text-primary">0</span>
                <span className="font-label-sm text-label-sm text-text-muted leading-tight">Quizzes Done</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-title-md text-title-md font-bold text-success-acacia">0</span>
                <span className="font-label-sm text-label-sm text-text-muted leading-tight">Pending Uploads</span>
              </div>
            </div>
          </section>

          <section className="bg-surface-card rounded-[20px] p-space-lg shadow-[0_4px_20px_-2px_rgba(25,74,50,0.08)] flex flex-col gap-space-md relative overflow-hidden">
             <h3 className="font-headline-md text-primary font-bold">Research Assessments</h3>
             <div className="flex flex-col gap-3">
               <div className="p-4 rounded-xl border border-border-subtle bg-background flex items-center justify-between">
                 <div>
                   <div className="text-title-md font-semibold text-on-surface">Baseline Assessment</div>
                   <div className="text-label-sm text-text-muted mt-1">Start here before taking modules</div>
                 </div>
                 <Link to="/assessment/baseline" className="h-10 px-4 bg-primary text-on-primary rounded-full font-label-md flex items-center justify-center">Take</Link>
               </div>
               <div className="p-4 rounded-xl border border-border-subtle bg-background flex items-center justify-between">
                 <div>
                   <div className="text-title-md font-semibold text-on-surface">Endline Assessment</div>
                   <div className="text-label-sm text-text-muted mt-1">Complete after all modules</div>
                 </div>
                 <Link to="/assessment/endline" className="h-10 px-4 border border-primary text-primary rounded-full font-label-md flex items-center justify-center hover:bg-surface-elevated">Take</Link>
               </div>
             </div>
          </section>

          <section className="bg-surface-card rounded-[20px] p-space-lg shadow-[0_4px_20px_-2px_rgba(25,74,50,0.08)] flex flex-col gap-space-md relative overflow-hidden">
             <h3 className="font-headline-md text-primary font-bold">{t('dashboard.modules')}</h3>
             <div className="flex flex-col gap-3">
               {modules[language].map((module, i) => (
                 <div key={i} className="p-4 rounded-xl border border-border-subtle bg-background flex items-center justify-between">
                   <div>
                     <div className="text-label-sm text-text-muted uppercase font-bold tracking-wider mb-1">Module 0{i + 1}</div>
                     <div className="text-title-md font-semibold text-on-surface">{module.title}</div>
                   </div>
                   <Link to={`/lesson/${module.id}`} className="h-10 px-4 bg-primary text-on-primary rounded-full font-label-md flex items-center justify-center">Start</Link>
                 </div>
               ))}
             </div>
          </section>
          
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="text-error font-label-sm px-4 py-2 rounded-full border border-error hover:bg-error/10"
            >
              Reset App Data (Testing)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
