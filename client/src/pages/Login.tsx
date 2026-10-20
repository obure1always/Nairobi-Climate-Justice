import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../LanguageContext';
import { 
  Leaf, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User as UserIcon, 
  KeyRound, 
  Copy, 
  Check, 
  ShieldCheck, 
  Info,
  ArrowRight,
  Shield
} from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { continueAsGuest, login, register, loginWithGoogle } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isSwahili = language === 'sw';

  // Navigation target after auth
  const from = (location.state as any)?.from?.pathname || '/';

  // Auth mode: 'signin' | 'register' | 'recovery'
  const [mode, setMode] = useState<'signin' | 'register' | 'recovery'>('signin');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // One-time recovery code modal state (after registration)
  const [createdRecoveryCode, setCreatedRecoveryCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Google OAuth Client ID check
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Google Identity Services if configured
    if (googleClientId && window.google?.accounts?.id && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsSubmitting(true);
              setErrorMessage(null);
              const res = await loginWithGoogle(response.credential);
              setIsSubmitting(false);
              if (res.success) {
                navigate(from, { replace: true });
              } else {
                setErrorMessage(res.error || 'Google sign-in failed');
              }
            }
          }
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill'
        });
      } catch (err) {
        console.warn('Google Identity initialization notice:', err);
      }
    }
  }, [googleClientId, mode]);

  // Guest Access Handler
  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate(from, { replace: true });
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage(isSwahili ? 'Tafadhali jaza barua pepe na nenosiri.' : 'Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || (isSwahili ? 'Barua pepe au nenosiri si sahihi' : 'Invalid email or password'));
    }
  };

  // Register Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage(isSwahili ? 'Tafadhali jaza barua pepe na nenosiri.' : 'Please enter your email and password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage(isSwahili ? 'Nenosiri lazima liwe na angalau herufi 8.' : 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(isSwahili ? 'Nenosiri halilingani.' : 'Passwords do not match.');
      return;
    }

    if (!privacyAgreed) {
      setErrorMessage(isSwahili ? 'Lazima ukubali ilani ya faragha.' : 'Please accept the privacy notice to create an account.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(email.trim(), password, confirmPassword, name.trim());
    setIsSubmitting(false);

    if (res.success && res.recoveryCode) {
      // Display the high-entropy recovery code
      setCreatedRecoveryCode(res.recoveryCode);
    } else if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || (isSwahili ? 'Usajili umeshindwa' : 'Registration failed'));
    }
  };

  // Password Recovery via Recovery Code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email.trim() || !recoveryCode.trim() || !newPassword) {
      setErrorMessage(isSwahili ? 'Tafadhali jaza maelezo yote ya urejeshaji.' : 'Please fill in all recovery fields.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(isSwahili ? 'Nenosiri jipya lazima liwe na herufi 8 au zaidi.' : 'New password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          recoveryCode: recoveryCode.trim().toUpperCase(),
          newPassword
        })
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        setStatusMessage(
          isSwahili 
            ? `Nenosiri limerekebishwa! Msimbo wako mpya wa dharura ni: ${data.newRecoveryCode}. Unaweza kuingia sasa.` 
            : `Password successfully reset! Your replacement recovery code is: ${data.newRecoveryCode}. You can now sign in.`
        );
        setPassword(newPassword);
        setMode('signin');
      } else {
        setErrorMessage(data.error || (isSwahili ? 'Msimbo wa urejeshaji si sahihi.' : 'Invalid email or recovery code.'));
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage(isSwahili ? 'Hitilafu ya mtandao wakati wa kurejesha nenosiri.' : 'Network error during password recovery.');
    }
  };

  const copyRecoveryCode = () => {
    if (createdRecoveryCode) {
      navigator.clipboard.writeText(createdRecoveryCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    }
  };

  const handleFinishRegistration = () => {
    setCreatedRecoveryCode(null);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream-bg text-gray-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-inter">
      {/* Top Header & Language Toggle */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-forest-green/10 text-forest-green flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5 text-forest-green" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-green block leading-none">
              Nairobi
            </span>
            <span className="text-sm font-black text-gray-900 leading-tight">
              Climate Justice
            </span>
          </div>
        </div>

        <button
          onClick={() => setLanguage(isSwahili ? 'en' : 'sw')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-white transition-all bg-white/70"
          aria-label="Toggle language"
        >
          <span>{isSwahili ? '🇰🇪 Kiswahili' : '🇬🇧 English'}</span>
          <span className="text-gray-400 font-normal">| {isSwahili ? 'Switch to EN' : 'Badili kwa SW'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-6 sm:my-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Organic Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/5 rounded-bl-full pointer-events-none" />

          {/* Brand Welcome Area */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {isSwahili ? 'Jifunze Haki ya Tabianchi' : 'Climate Justice Nairobi'}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-forest-green">
              {isSwahili 
                ? 'Elewa tabianchi yako. Imarisha jamii yako.' 
                : 'Understand your climate. Strengthen your community.'}
            </p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {isSwahili
                ? 'Jukwaa la bure la vijana wa Kibera na Ruaraka. Chagua namna ya kuanza kujifunza:'
                : 'Free open learning for Nairobi youth. Choose how you want to start learning:'}
            </p>
          </div>

          {/* Option A: CONTINUE AS GUEST (PROMINENT ZERO-BARRIER ENTRY) */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border-2 border-emerald-200/80 shadow-sm transition-all hover:border-emerald-300">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  {isSwahili ? 'Inapendekezwa • Hakuna Nenosiri' : 'Instant Access • No Account Needed'}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-100">
                100% Offline
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-3.5 leading-relaxed">
              {isSwahili
                ? 'Anza masomo 7, maswali, na msaidizi wa tabianchi mara moja. Maendeleo yanahifadhiwa kwenye simu hii.'
                : 'Access all 7 modules, quizzes, Climate Buddy, and narration offline. Learning saves automatically to this device.'}
            </p>

            <button
              id="continue-as-guest-btn"
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <Leaf className="w-5 h-5 text-emerald-200" />
              <span>{isSwahili ? 'Endelea kama Mgeni' : 'Continue as Guest'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Visual Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider absolute">
              {isSwahili ? 'Au Unganisha Akaunti' : 'Or Link An Account'}
            </span>
          </div>

          {/* Option B: GOOGLE IDENTITY SERVICES */}
          <div className="mb-5">
            {googleClientId ? (
              <div ref={googleButtonRef} className="w-full flex justify-center min-h-[44px]" />
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isSwahili ? 'Kuingia kwa Google kuko tayari' : 'Sign in with Google ready'}</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {isSwahili 
                    ? 'Weka VITE_GOOGLE_CLIENT_ID kwenye mazingira ili kuwezesha kitufe cha Google.' 
                    : 'Set VITE_GOOGLE_CLIENT_ID in your environment to enable instant Google sign-in.'}
                </p>
              </div>
            )}
          </div>

          {/* Option C: EMAIL & PASSWORD WITH SEGMENTED SWITCH */}
          <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
            {/* Segmented Switch */}
            <div className="flex bg-gray-200/70 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-lg transition-all ${mode === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {isSwahili ? 'Ingia' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {isSwahili ? 'Unda Akaunti' : 'Create Account'}
              </button>
            </div>

            {/* Status & Error Alerts */}
            {statusMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <p>{statusMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="signin-email">
                    {isSwahili ? 'Barua Pepe' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      id="signin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@example.org"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700" htmlFor="signin-password">
                      {isSwahili ? 'Nenosiri' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode('recovery'); setErrorMessage(null); }}
                      className="text-[11px] font-semibold text-forest-green hover:underline"
                    >
                      {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-0.5"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isSwahili ? 'Ingia kwenye Akaunti' : 'Sign In with Email'}</span>
                  )}
                </button>
              </form>
            )}

            {/* FORM 2: CREATE ACCOUNT */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="register-name">
                    {isSwahili ? 'Jina au Lakabu (Si lazima)' : 'Name or Nickname (Optional)'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Amina"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="register-email">
                    {isSwahili ? 'Barua Pepe' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      id="register-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@example.org"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="register-password">
                    {isSwahili ? 'Nenosiri (Herufi 8+)' : 'Password (8+ chars)'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-0.5"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="register-confirm-password">
                    {isSwahili ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      id="register-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="privacy-consent"
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-forest-green focus:ring-forest-green"
                  />
                  <label htmlFor="privacy-consent" className="text-xs text-gray-600 leading-tight">
                    {isSwahili ? (
                      <>Ninakubali ilani ya faragha na masharti ya mradi huu wa elimu ya tabianchi.</>
                    ) : (
                      <>I agree to the educational privacy notice and community learning terms.</>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isSwahili ? 'Unda Akaunti Yangu' : 'Create My Account'}</span>
                  )}
                </button>
              </form>
            )}

            {/* FORM 3: RECOVERY CODE PASSWORD RESET */}
            {mode === 'recovery' && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-forest-green" />
                    {isSwahili ? 'Urejeshaji wa Nenosiri' : 'Password Recovery'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMessage(null); }}
                    className="text-xs text-forest-green hover:underline font-medium"
                  >
                    {isSwahili ? 'Rudi Kuingia' : 'Back to Sign In'}
                  </button>
                </div>

                <p className="text-[11px] text-gray-600">
                  {isSwahili
                    ? 'Weka barua pepe na msimbo wako wa dharura wa herufi 16 (uliopewa wakati wa usajili) ili kuweka nenosiri jipya.'
                    : 'Enter your email and the 16-character recovery code issued when you created your account to reset your password.'}
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="rec-email">
                    {isSwahili ? 'Barua Pepe' : 'Email Address'}
                  </label>
                  <input
                    id="rec-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amina@example.org"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="rec-code">
                    {isSwahili ? 'Msimbo wa Dharura (XXXX-XXXX-XXXX-XXXX)' : 'Recovery Code (XXXX-XXXX-XXXX-XXXX)'}
                  </label>
                  <input
                    id="rec-code"
                    type="text"
                    required
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                    placeholder="ABCD-EF12-34GH-56JK"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-forest-green outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="rec-new-pwd">
                    {isSwahili ? 'Nenosiri Jipya' : 'New Password'}
                  </label>
                  <input
                    id="rec-new-pwd"
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-green outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isSwahili ? 'Weka Nenosiri Jipya' : 'Reset My Password'}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* ONE-TIME RECOVERY CODE DISPLAY MODAL (AFTER SUCCESSFUL REGISTRATION) */}
      {createdRecoveryCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <KeyRound className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  {isSwahili ? 'Muhimu Sana' : 'Zero-Cost Security'}
                </span>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {isSwahili ? 'Msimbo Wako wa Dharura' : 'Save Your Recovery Code'}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isSwahili
                ? 'Kwa sababu mradi huu ni wa bure na hautumii barua pepe za matangazo zenye malipo, msimbo huu ndio njia PEKEE ya kurejesha akaunti yako ukisahau nenosiri. Tafadhali unakili na uuhifadhi mahali salama!'
                : 'Because Climate Justice Nairobi is 100% free and does not send tracking emails, this 16-character code is the ONLY way to recover your account if you forget your password. Save it in a safe place!'}
            </p>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <span className="font-mono text-base sm:text-lg font-bold text-amber-950 tracking-wider">
                {createdRecoveryCode}
              </span>
              <button
                type="button"
                onClick={copyRecoveryCode}
                className="p-2 text-amber-800 hover:text-amber-950 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1 text-xs font-semibold"
                aria-label="Copy recovery code"
              >
                {codeCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{codeCopied ? (isSwahili ? 'Imenakiliwa!' : 'Copied!') : (isSwahili ? 'Nakili' : 'Copy')}</span>
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                {isSwahili
                  ? 'Msimbo huu unaweza kutumika mara moja tu. Ukishaingia, unaweza kutoa msimbo mpya katika sehemu ya Profaili.'
                  : 'This code can only be used once. After signing in, you can regenerate replacement codes anytime in your Profile.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinishRegistration}
              className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isSwahili ? 'Nimehifadhi Msimbo - Endelea' : "I've Saved My Code — Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Trust & Ethics Notice */}
      <footer className="max-w-md w-full mx-auto text-center text-xs text-gray-400 py-3 space-y-1">
        <p>
          {isSwahili
            ? 'Mradi wa haki ya tabianchi • Kibera & Ruaraka, Nairobi'
            : 'Climate Justice Youth Education Project • Kibera & Ruaraka, Nairobi'}
        </p>
        <p className="text-[11px] text-gray-400">
          {isSwahili
            ? 'Haki zote zimehifadhiwa. Mafunzo ni ya bure kwa kila kijana.'
            : 'Open educational resource. Ordinary learning never requires paid accounts.'}
        </p>
      </footer>
    </div>
  );
}
