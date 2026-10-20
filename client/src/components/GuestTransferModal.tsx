import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../LanguageContext';
import { Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';

export const GuestTransferModal: React.FC = () => {
  const { showTransferModal, transferGuestProgress, dismissTransferModal, user } = useAuth();
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [isTransferring, setIsTransferring] = useState(false);
  const [transferResult, setTransferResult] = useState<{ success: boolean; count: number } | null>(null);

  if (!showTransferModal) return null;

  const handleTransfer = async () => {
    setIsTransferring(true);
    const result = await transferGuestProgress();
    setIsTransferring(false);
    setTransferResult(result);
    setTimeout(() => {
      dismissTransferModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden">
        {/* Background decorative biophilic blob */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-forest-green/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={dismissTransferModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-green/10 text-forest-green flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-forest-green" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-green">
              {isSwahili ? 'Uhamisho wa Maendeleo' : 'Progress Sync'}
            </span>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {isSwahili ? 'Hamisha Masomo Yako?' : 'Transfer Your Guest Progress?'}
            </h2>
          </div>
        </div>

        {transferResult ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-gray-900">
              {isSwahili ? 'Maendeleo Yamehamishwa!' : 'Progress Successfully Transferred!'}
            </h3>
            <p className="text-sm text-gray-600">
              {isSwahili
                ? `Masomo yako ${transferResult.count} yameunganishwa kwenye akaunti yako ya ${user?.email || 'learner'}.`
                : `Synchronized ${transferResult.count} module records to your ${user?.email || 'learner'} account.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {isSwahili
                ? `Umekamilisha masomo ukiwa mgeni kwenye kifaa hiki. Je, ungependa kuunganisha maendeleo haya na akaunti yako ya ${user?.email || ''} ili uyapate kwenye kifaa kingine chochote?`
                : `You have completed lessons and quiz achievements saved on this device. Would you like to merge them with your account (${user?.email || 'signed in'}) so your learning journey stays synchronized?`}
            </p>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                {isSwahili ? 'Hakuna marudio ya masomo' : 'No duplicate lessons created'}
              </p>
              <p className="text-emerald-700 pl-3.5">
                {isSwahili
                  ? 'Masomo uliyosoma yatahifadhiwa salama kwenye akaunti yako.'
                  : 'Your completed modules, scores, and offline work will safely be associated with your account.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleTransfer}
                disabled={isTransferring}
                className="flex-1 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-semibold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isTransferring ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isSwahili ? 'Inahamisha...' : 'Transferring...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isSwahili ? 'Hamisha Maendeleo' : 'Transfer Progress'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={dismissTransferModal}
                disabled={isTransferring}
                className="py-3 px-4 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium rounded-2xl transition-all text-sm text-center"
              >
                {isSwahili ? 'Baki Kwenye Kifaa Hiki' : 'Keep Local Only'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
