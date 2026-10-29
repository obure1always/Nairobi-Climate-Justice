import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Lock,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'tree', label: 'Indigenous Forest', icon: '🌲', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=200&q=80' },
  { id: 'sun', label: 'Solar Energy', icon: '☀️', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=200&q=80' },
  { id: 'river', label: 'Riparian Sponge', icon: '💧', url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=200&q=80' },
  { id: 'sprout', label: 'Community Agroforestry', icon: '🌱', url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=200&q=80' },
  { id: 'geothermal', label: 'Geothermal Rift', icon: '⚡', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=200&q=80' },
  { id: 'crane', label: 'Wetland Sanctuary', icon: '🪶', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=200&q=80' }
];

export default function Profile() {
  const { language, setLanguage } = useLanguage();
  const { updateSettings, progress } = useProgress();
  const { user, isGuest, logout, changePassword, regenerateRecoveryCode, deleteAccount, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSwahili = language === 'sw';

  // Profile Edit form state
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Sync state with logged-in user
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.name || '');
      setAvatarUrl(user.avatarUrl || '');
      setBio(user.bio || '');
    }
  }, [user]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    const trimmedName = displayName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setProfileError(isSwahili ? 'Jina linahitaji herufi angalau 2.' : 'Display name must be at least 2 characters.');
      return;
    }

    setIsSavingProfile(true);
    const res = await updateProfile({
      displayName: trimmedName,
      name: trimmedName,
      avatarUrl: avatarUrl.trim() || undefined,
      bio: bio.trim() || undefined
    });
    setIsSavingProfile(false);

    if (res.success) {
      setProfileSuccess(isSwahili ? 'Profaili yako imehifadhiwa kikamilifu!' : 'Profile updated and saved to your account!');
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccess(null), 4000);
    } else {
      setProfileError(res.error || (isSwahili ? 'Imeshindwa kuhifadhi mabadiliko ya profaili.' : 'Failed to save profile changes.'));
    }
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
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto pb-28 font-inter">
      {/* Top Breadcrumb & Page Heading */}
      <div className="mb-6">
        <span className="text-xs font-bold text-forest-green uppercase tracking-wider">
          {isSwahili ? 'Akaunti na Mipangilio' : 'Learner Account'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          {isSwahili ? 'Profaili na Mipangilio ya Akaunti' : 'Profile & Account Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {isSwahili 
            ? 'Dhibiti maelezo yako binafsi, usalama wa akaunti, na mipangilio ya mtaala.' 
            : 'Manage personal details, credential verification statuses, security, and curriculum preferences.'}
        </p>
      </div>

      {/* Guest Mode Protection Banner if signed out */}
      {(!user || isGuest) && (
        <div className="mb-6 p-5 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🌿</span>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                {isSwahili ? 'Uko katika Hali ya Mgeni' : 'Currently in Guest Mode'}
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5 max-w-xl leading-relaxed">
                {isSwahili 
                  ? 'Masomo yako yanahifadhiwa kwenye kifaa hiki tu. Ingia au sajili akaunti ya bure ili kuhariri jina lako, kubadilisha picha ya wasifu, na kuhifadhi vyeti vyako mtandaoni.'
                  : 'You are exploring anonymously. Sign in or create an account to personalize your profile, choose an avatar, and synchronize your verified course certificates across multiple devices.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
            className="self-start sm:self-center shrink-0 px-4 py-2.5 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSwahili ? 'Ingia / Fungua Akaunti' : 'Sign In / Connect Account'}</span>
          </button>
        </div>
      )}

      {/* Notification Toasts */}
      {profileSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {profileError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* SECTION 1: ACCOUNT DETAILS & VERIFICATION STATUS */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Avatar Preview */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-forest-green/10 text-forest-green flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden border border-gray-100">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName || 'Avatar'} className="w-full h-full object-cover" />
                ) : (
                  <span>{user ? (user.displayName || user.name || user.email || 'U')[0].toUpperCase() : '🌿'}</span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {user ? (user.displayName || user.name || user.email?.split('@')[0]) : (isSwahili ? 'Mwanafunzi Mgeni' : 'Guest Learner')}
                  </h2>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${user ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {user ? (user.authProvider === 'google' ? 'Google Account' : user.authProvider === 'phone' ? 'Phone Account' : 'Email Account') : (isSwahili ? 'Mgeni' : 'Guest')}
                  </span>
                  {user?.role && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {user?.email ? user.email : (isSwahili ? 'Hakuna barua pepe iliyounganishwa' : 'No email attached')}
                </p>

                {user?.bio && (
                  <p className="text-xs text-gray-600 mt-2 max-w-xl italic leading-relaxed">
                    "{user.bio}"
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-3 text-xs">
                  <span className="font-semibold text-forest-green">
                    {Object.values(progress).filter(p => p.completed).length} / 7 {isSwahili ? 'Moduli Zimekamilika' : 'Modules Completed'}
                  </span>
                  {user?.institution && (
                    <span className="text-gray-500">
                      • {user.institution}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {user && (
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-3.5 py-2 border border-gray-200 hover:border-forest-green hover:bg-forest-green/5 text-gray-700 hover:text-forest-green rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingProfile ? (isSwahili ? 'Funga' : 'Close') : (isSwahili ? 'Hariri' : 'Edit Profile')}</span>
                </button>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isSwahili ? 'Ondoka' : 'Sign Out'}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login', { state: { from: location.pathname } })}
                  className="px-4 py-2 bg-forest-green text-white rounded-xl text-xs font-bold hover:bg-forest-green/90 transition"
                >
                  {isSwahili ? 'Ingia' : 'Sign In'}
                </button>
              )}
            </div>
          </div>

          {/* Verification Statuses Checklist (Honest reporting: Do NOT claim unverified state is verified) */}
          {user && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                {isSwahili ? 'Hali ya Uthibitishaji wa Akaunti' : 'Account Verification Statuses'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Email Verification State */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-start gap-3">
                  <div className="mt-0.5">
                    {user.emailVerified ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">Email Address</span>
                      {user.emailVerified ? (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          Verified (OAuth)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {user.emailVerified 
                        ? 'Confirmed through Google authentication provider.'
                        : 'Transactional verification email service is pending production deployment. All learning features remain fully accessible.'}
                    </p>
                  </div>
                </div>

                {/* Phone Identifier (Password Secured - Unverified Phone Ownership) */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-start gap-3">
                  <div className="mt-0.5">
                    <Phone className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">Phone Identifier</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {user.phone ? 'Password-Secured (Unverified)' : 'Not Linked'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {user.phone 
                        ? `Registered phone identifier: ${user.phone}. Authentication is secured by password; phone ownership is unverified.`
                        : 'No mobile phone number attached to this account.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: EDIT PROFILE FORM (Supported Fields: Display Name, Avatar, Bio) */}
        {user && isEditingProfile && (
          <section className="bg-white rounded-3xl shadow-sm border border-emerald-200 p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                <Edit3 className="w-5 h-5 text-forest-green" />
                <span>{isSwahili ? 'Hariri Maelezo Yako ya Profaili' : 'Edit Profile Information'}</span>
              </div>
              <span className="text-[11px] text-gray-400">Persists to secure backend</span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Jina la Wasifu (Display Name) *' : 'Display Name (Learner / Practitioner) *'}
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Amina Wanjiku"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-forest-green"
                />
                <p className="text-[11px] text-gray-400 mt-1">This name will appear on discussion replies and verifiable certificate ledgers.</p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-forest-green" />
                  <span>{isSwahili ? 'Picha ya Wasifu (Chagua au Weka Kiungo)' : 'Avatar (Choose Curated or Paste Custom URL)'}</span>
                </label>

                {/* Preset Avatars */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setAvatarUrl(av.url)}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        avatarUrl === av.url 
                          ? 'border-forest-green bg-emerald-50 ring-2 ring-emerald-500/20' 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{av.icon}</span>
                      <span className="text-[10px] font-bold text-gray-700 truncate w-full">{av.label}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Maelezo Mafupi (Bio / Eneo la Tabianchi)' : 'Short Bio / Climate Action Focus'}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={isSwahili ? 'Mfano: Mwanafunzi wa mazingira mtaani Mathare, ninazingatia upandaji miti na mifereji safi.' : 'e.g. Community organizer based in Kibera focused on urban agroforestry and localized riparian buffers.'}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? (isSwahili ? 'Inahifadhi...' : 'Saving Changes...') : (isSwahili ? 'Hifadhi Mabadiliko' : 'Save Changes')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  {isSwahili ? 'Ghairi' : 'Cancel'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* SECTION 3: EMAIL ACCOUNT SECURITY & PASSWORD (FOR EMAIL USERS) */}
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
                  <p className="text-[11px] text-gray-500 mt-0.5">{isSwahili ? 'Weka nenosiri jipya salama' : 'Update your password'}</p>
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

        {/* SECTION 4: LANGUAGE PREFERENCE */}
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
                : 'All 7 modules, 42 lessons, quizzes, study notes, and speech synthesis narration are completely bilingual.'}
            </p>
          </div>
        </section>

        {/* SECTION 5: DATA & PRIVACY MANAGEMENT */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base border-b border-gray-100 pb-3">
            <Shield className="w-5 h-5 text-forest-green" />
            <span>{isSwahili ? 'Faragha na Usimamizi wa Data' : 'Privacy & Device Management'}</span>
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
                ? 'Hatua hii itafuta barua pepe yako, nenosiri, na maelezo yako ya masomo kwenye seva zetu za wingu. Ukiamua kujiandikisha tena baadaye, itabidi uanze akaunti mpya.'
                : 'This action will permanently delete your account credentials, login sessions, and cloud-synced progress from our servers. You will be returned to Guest mode.'}
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
