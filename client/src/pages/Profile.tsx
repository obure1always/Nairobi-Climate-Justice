import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Globe, 
  Shield, 
  KeyRound, 
  LogOut, 
  Trash2, 
  RefreshCw, 
  Check, 
  Copy, 
  AlertTriangle, 
  MessageSquare,
  Sparkles,
  Lock
} from 'lucide-react';

export default function Profile() {
  const { language, setLanguage } = useLanguage();
  const { updateSettings, progress } = useProgress();
  const { user, logout, changePassword, regenerateRecoveryCode, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';

  // Change Password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Recovery Code state
  const [regeneratedCode, setRegeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Delete Account confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Clear Chat feedback
  const [chatCleared, setChatCleared] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'sw';
    setLanguage(newLang);
    updateSettings({ language: newLang });
  };

  const handleResetProgress = () => {
    if (window.confirm(isSwahili ? 'Una uhakika unataka kufuta maendeleo yako yote ya masomo kwenye kifaa hiki?' : 'Are you sure you want to reset all your local learning progress on this device?')) {
      localStorage.removeItem('climate_justice_is_guest');
      localStorage.removeItem('participantId');
      window.location.href = '/';
    }
  };

  const handleClearChatHistory = () => {
    localStorage.removeItem('climate_buddy_chat_history');
    setChatCleared(true);
    setTimeout(() => setChatCleared(false), 3000);
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordError(isSwahili ? 'Nenosiri lazima liwe na herufi 8 au zaidi.' : 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError(isSwahili ? 'Nenosiri jipya halilingani.' : 'New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (res.success) {
      setPasswordStatus(isSwahili ? 'Nenosiri limebadilishwa kikamilifu!' : 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 2000);
    } else {
      setPasswordError(res.error || (isSwahili ? 'Imeshindwa kubadilisha nenosiri.' : 'Failed to update password.'));
    }
  };

  const handleRegenerateCode = async () => {
    if (!window.confirm(isSwahili ? 'Je, ungependa kubadilisha msimbo wako wa dharura? Msimbo wa zamani hautafanya kazi tena.' : 'Generate a new recovery code? Any previously issued code will be invalidated.')) {
      return;
    }
    setIsRegenerating(true);
    const res = await regenerateRecoveryCode();
    setIsRegenerating(false);

    if (res.success && res.recoveryCode) {
      setRegeneratedCode(res.recoveryCode);
    }
  };

  const copyCode = () => {
    if (regeneratedCode) {
      navigator.clipboard.writeText(regeneratedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleDeleteAccountSubmit = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    const res = await deleteAccount();
    setIsDeleting(false);

    if (res.success) {
      navigate('/login', { replace: true });
    } else {
      setDeleteError(res.error || (isSwahili ? 'Hitilafu wakati wa kufuta akaunti.' : 'Failed to delete account.'));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto pb-28 font-inter">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
        {isSwahili ? 'Profaili na Mipangilio ya Akaunti' : 'Profile & Account Settings'}
      </h1>

      <div className="space-y-6">
        {/* SECTION 1: ACCOUNT STATUS */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-forest-green/10 text-forest-green rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
                {user ? (user.displayName || user.name || user.email || 'U')[0].toUpperCase() : '🌿'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {user ? (user.displayName || user.name || user.email?.split('@')[0]) : (isSwahili ? 'Mwanafunzi Mgeni' : 'Guest Learner')}
                  </h2>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${user ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {user ? (user.authProvider === 'google' ? 'Google Account' : 'Email Account') : (isSwahili ? 'Hali ya Mgeni' : 'Guest Mode')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {user?.email ? user.email : (isSwahili ? 'Maendeleo yanahifadhiwa kwenye kifaa hiki tu' : 'Progress saved on this device only')}
                </p>
                <p className="text-xs text-forest-green font-semibold mt-1">
                  {Object.values(progress).filter(p => p.completed).length} / 7 {isSwahili ? 'Moduli Zimekamilika' : 'Modules Completed'}
                </p>
              </div>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="self-start sm:self-center px-4 py-2 border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{isSwahili ? 'Ondoka' : 'Sign Out'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="self-start sm:self-center px-4 py-2.5 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSwahili ? 'Unda Akaunti / Ingia' : 'Create Account / Sign In'}</span>
              </button>
            )}
          </div>

          {/* Cloud Sync Status Note */}
          <div className="mt-5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600">
            {user ? (
              <p>
                {isSwahili 
                  ? 'Maendeleo yako yanahifadhiwa kwenye wingu na yanaweza kufikiwa kwenye kifaa chochote ukiingia kwenye akaunti yako.' 
                  : 'Your learning progress synchronizes securely to the cloud. You can restore your completions from any phone or computer.'}
              </p>
            ) : (
              <p>
                {isSwahili
                  ? 'Unajifunza kama mgeni. Masomo yako yapo salama hapa, lakini hayatapatikana ukibadili kivinjari au simu bila kuunganisha akaunti ya bure.'
                  : 'You are using free Guest access. Your learning is stored on this browser only. Connect a free account anytime to backup your badges and certificates.'}
              </p>
            )}
          </div>
        </section>

        {/* SECTION 2: EMAIL ACCOUNT SECURITY (IF EMAIL USER) */}
        {user && user.authProvider === 'email' && (
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-base border-b border-gray-100 pb-3">
              <KeyRound className="w-5 h-5 text-forest-green" />
              <span>{isSwahili ? 'Usalama wa Akaunti na Nenosiri' : 'Account Security & Password'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => { setShowPasswordModal(true); setPasswordStatus(null); setPasswordError(null); }}
                className="p-3.5 border border-gray-200 hover:border-forest-green rounded-2xl text-left transition-all hover:bg-forest-green/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{isSwahili ? 'Badilisha Nenosiri' : 'Change Password'}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{isSwahili ? 'Weka nenosiri jipya' : 'Update your password'}</p>
                </div>
                <Lock className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={handleRegenerateCode}
                disabled={isRegenerating}
                className="p-3.5 border border-gray-200 hover:border-amber-400 rounded-2xl text-left transition-all hover:bg-amber-50/50 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{isSwahili ? 'Toa Msimbo Mpya wa Dharura' : 'Regenerate Recovery Code'}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{isSwahili ? 'Badilisha msimbo wa kurejesha' : 'Replace your single-use code'}</p>
                </div>
                <RefreshCw className={`w-4 h-4 text-amber-500 ${isRegenerating ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Display newly regenerated recovery code */}
            {regeneratedCode && (
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-amber-900">
                  {isSwahili ? 'Msimbo Wako Mpya wa Dharura:' : 'Your New Replacement Recovery Code:'}
                </p>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200">
                  <span className="font-mono text-base font-bold text-gray-900 tracking-wider">
                    {regeneratedCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 rounded-lg hover:bg-amber-100"
                  >
                    {codeCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{codeCopied ? (isSwahili ? 'Imenakiliwa' : 'Copied') : (isSwahili ? 'Nakili' : 'Copy')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-700">
                  {isSwahili 
                    ? 'Hifadhi msimbo huu mahali salama. Msimbo wa zamani umezimwa kabisa.' 
                    : 'Save this code securely. Any previous recovery code is now permanently expired.'}
                </p>
              </div>
            )}
          </section>
        )}

        {/* SECTION 3: LANGUAGE PREFERENCE */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-3">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base border-b border-gray-100 pb-3">
            <Globe className="w-5 h-5 text-forest-green" />
            <span>{isSwahili ? 'Lugha ya Mtaala' : 'Curriculum Language'}</span>
          </div>

          <div className="pt-1">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none text-sm font-medium"
            >
              <option value="en">🇬🇧 English (East Africa)</option>
              <option value="sw">🇰🇪 Kiswahili (Sanifu na Mitaani)</option>
            </select>
            <p className="text-[11px] text-gray-500 mt-2">
              {isSwahili
                ? 'Unaweza kubadili lugha wakati wowote. Masomo yote 42 na sauti za maongezi zinapatikana kwa lugha zote mbili.'
                : 'All 7 modules, 42 lessons, quizzes, and speech synthesis narration are completely bilingual.'}
            </p>
          </div>
        </section>

        {/* SECTION 4: DATA & PRIVACY MANAGEMENT */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base border-b border-gray-100 pb-3">
            <Shield className="w-5 h-5 text-forest-green" />
            <span>{isSwahili ? 'Faragha na Usimamizi wa Data' : 'Privacy & Local Data Management'}</span>
          </div>

          <div className="space-y-3">
            {/* Clear Chat History */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-forest-green" />
                  <span>{isSwahili ? 'Historia ya Mazungumzo ya Climate Buddy' : 'Climate Buddy Chat History'}</span>
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {isSwahili ? 'Futa kumbukumbu za maswali uliyouliza msaidizi kwenye kifaa hiki.' : 'Clear cached questions and responses on this device.'}
                </p>
              </div>
              <button
                onClick={handleClearChatHistory}
                className="self-start sm:self-center px-3.5 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold rounded-xl transition-all"
              >
                {chatCleared ? (isSwahili ? '✓ Imefutwa!' : '✓ Cleared!') : (isSwahili ? 'Futa Mazungumzo' : 'Clear Chat')}
              </button>
            </div>

            {/* Reset Local Learning Data */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  {isSwahili ? 'Rejesha Masomo Upya (Kwenye Kifaa Hiki)' : 'Reset Local Learning Progress'}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {isSwahili ? 'Hii itafuta maendeleo ya ndani na kukuruhusu kuanza masomo upya.' : 'Clears locally cached module completions and restarts onboarding.'}
                </p>
              </div>
              <button
                onClick={handleResetProgress}
                className="self-start sm:self-center px-3.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-xl transition-all border border-red-100"
              >
                {isSwahili ? 'Weka Upya' : 'Reset Progress'}
              </button>
            </div>

            {/* Delete Account (For Registered Users) */}
            {user && (
              <div className="pt-2">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 hover:underline"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isSwahili ? 'Futa Akaunti Yangu Kabisa' : 'Permanently Delete Account'}</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL 1: CHANGE PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              {isSwahili ? 'Badilisha Nenosiri Lako' : 'Change Your Password'}
            </h3>

            {passwordStatus && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                {passwordStatus}
              </p>
            )}

            {passwordError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {passwordError}
              </p>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isSwahili ? 'Nenosiri la Sasa' : 'Current Password'}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isSwahili ? 'Nenosiri Jipya (Herufi 8+)' : 'New Password (8+ chars)'}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isSwahili ? 'Thibitisha Nenosiri Jipya' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 bg-forest-green text-white font-semibold rounded-xl text-sm transition-all hover:bg-forest-green/90 disabled:opacity-60"
                >
                  {isChangingPassword ? (isSwahili ? 'Inahifadhi...' : 'Saving...') : (isSwahili ? 'Hifadhi Nenosiri' : 'Update Password')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
                >
                  {isSwahili ? 'Ghairi' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE ACCOUNT CONFIRMATION */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {isSwahili ? 'Je, una uhakika unataka kufuta akaunti?' : 'Delete Your Account Permanently?'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isSwahili
                ? 'Hatua hii itafuta barua pepe yako, nenosiri, na maendeleo yako ya masomo kwenye seva. Kulingana na itifaki ya utafiti wa kimaadili, majibu ya tathmini ya utafiti yaliyopokelewa kwa siri (bila jina) hushughulikiwa kando na kanuni za utafiti na hayawezi kufutwa moja kwa moja bila idhini ya mtafiti mkuu.'
                : 'This will erase your account credentials, login sessions, and cloud learning records. Note: Under our approved research ethics protocol, pseudonymous baseline/endline assessment evaluation datasets are governed separately and cannot be silently erased.'}
            </p>

            {deleteError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {deleteError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleDeleteAccountSubmit}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60"
              >
                {isDeleting ? (isSwahili ? 'Inafuta...' : 'Deleting...') : (isSwahili ? 'Ndio, Futa Kabisa' : 'Yes, Delete My Account')}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="py-2.5 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
              >
                {isSwahili ? 'Ghairi' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
