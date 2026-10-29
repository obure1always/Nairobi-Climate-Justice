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
  Info,
  ArrowRight,
  Phone,
  Clock,
  RotateCcw
} from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

const COUNTRY_OPTIONS = [
  { code: '+254', country: 'Kenya', flag: '🇰🇪', placeholder: '712 345 678' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬', placeholder: '772 123 456' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿', placeholder: '712 345 678' },
  { code: '+251', country: 'Ethiopia', flag: '🇪🇹', placeholder: '911 234 567' }
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    continueAsGuest, 
    login, 
    register, 
    loginWithGoogle, 
    requestPhoneOtp, 
    loginWithPhone 
  } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isSwahili = language === 'sw';

  // Navigation target after auth
  const from = (location.state as any)?.from?.pathname || '/';

  // Auth mode: 'signin' | 'phone' | 'register' | 'recovery'
  const [mode, setMode] = useState<'signin' | 'phone' | 'register' | 'recovery'>('signin');
  const [phoneAuthAvailable, setPhoneAuthAvailable] = useState<boolean>(false);

  // Phone Form fields
  const [selectedCountry, setSelectedCountry] = useState('+254');
  const [nationalNumber, setNationalNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Email Form fields
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
    fetch('/api/v1/auth/phone/status')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.available === 'boolean') {
          setPhoneAuthAvailable(data.available);
        }
      })
      .catch(() => setPhoneAuthAvailable(false));
  }, []);

  // Timer cooldown effect
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

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

  // Phone OTP Request Handler
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!nationalNumber.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka nambari yako ya simu.' : 'Please enter your phone number.');
      return;
    }

    setIsSubmitting(true);
    const res = await requestPhoneOtp(selectedCountry, nationalNumber.trim());
    setIsSubmitting(false);

    if (res.success) {
      setOtpSent(true);
      setCooldownRemaining(res.cooldownSeconds || 60);
      setStatusMessage(res.message || (isSwahili ? 'Msimbo wa uthibitishaji umetumwa!' : 'Verification code sent!'));
    } else {
      setErrorMessage(res.error || 'Failed to dispatch verification code');
    }
  };

  // Phone OTP Verify Handler
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMessage(isSwahili ? 'Tafadhali weka msimbo wenye tarakimu 6.' : 'Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginWithPhone(selectedCountry, nationalNumber.trim(), otpCode.trim(), displayName.trim() || undefined);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || (isSwahili ? 'Msimbo si sahihi' : 'Invalid verification code'));
    }
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
      const res = await fetch('/api/v1/auth/reset-password', {
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
    <div className="min-h-screen bg-canvas-bg text-gray-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-inter">
      {/* Top Header & Language Toggle */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-forest-green/10 text-forest-green flex items-center justify-center font-bold shadow-sm">
            <Leaf className="w-5 h-5 text-forest-green" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-green block leading-none">
              Climate Learning Platform
            </span>
            <span className="text-base font-black text-gray-900 leading-tight">
              Climate Justice Nairobi
            </span>
          </div>
        </div>

        <button
          onClick={() => setLanguage(isSwahili ? 'en' : 'sw')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-white transition-all bg-white/70 shadow-sm"
          aria-label="Toggle language"
        >
          <span>{isSwahili ? '🇰🇪 Kiswahili' : '🇬🇧 English'}</span>
          <span className="text-gray-400 font-normal">| {isSwahili ? 'Switch to EN' : 'Badili kwa SW'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-lg w-full mx-auto my-6 sm:my-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Organic Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-forest-green/5 rounded-bl-full pointer-events-none" />

          {/* Brand Welcome Area */}
          <div className="text-center space-y-1.5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {isSwahili ? 'Jifunze Haki ya Tabianchi' : 'Climate Justice Nairobi'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-forest-green">
              {isSwahili 
                ? 'Elewa tabianchi yako. Imarisha jamii yako.' 
                : 'Understand your climate. Strengthen your community.'}
            </p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {isSwahili
                ? 'Jukwaa la elimu ya tabianchi kwa vijana wa Afrika Mashariki. Ingia kuanza kujifunza:'
                : 'Africa-focused climate education platform. Sign in to start learning and earning verifiable credentials:'}
            </p>
          </div>

          {/* Primary Authentication Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                mode === 'signin' 
                  ? 'bg-white text-forest-green font-bold shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Ingia' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                mode === 'register' 
                  ? 'bg-white text-forest-green font-bold shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Unda Akaunti' : 'Create Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('phone'); setErrorMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                mode === 'phone' 
                  ? 'bg-white text-forest-green font-bold shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Simu (OTP)' : 'Phone Number'}</span>
            </button>
          </div>

          {/* Status and Error Messages */}
          {statusMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE 1: PHONE NUMBER AUTHENTICATION */}
          {mode === 'phone' && !phoneAuthAvailable && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{isSwahili ? 'Ilani ya Lango la SMS:' : 'SMS Provider Gateway Notice:'}</span>
                </div>
                <p className="leading-relaxed mb-3">
                  {isSwahili
                    ? 'Uwasilishaji wa msimbo wa SMS kwa sasa umesitishwa kwa kuwa kitambulisho cha lango la SMS (Africa\'s Talking au Twilio) hakijawekwa kwenye seva. Tafadhali tumia Barua Pepe na Nenosiri au endelea kama Mgeni.'
                    : 'Live SMS code dispatch is temporarily paused pending SMS provider gateway configuration (Africa\'s Talking / Twilio credentials in server environment). Please sign in using Email & Password or continue in Guest Mode.'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="px-3 py-1.5 bg-amber-900 text-white rounded-lg font-bold text-xs hover:bg-amber-800 transition"
                  >
                    {isSwahili ? 'Tumia Barua Pepe' : 'Sign in with Email'}
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="px-3 py-1.5 bg-white text-amber-950 border border-amber-300 rounded-lg font-bold text-xs hover:bg-amber-100 transition"
                  >
                    {isSwahili ? 'Endelea kama Mgeni' : 'Continue as Guest'}
                  </button>
                </div>
              </div>

              {/* Form inputs disabled until SMS gateway provider is configured in environment */}
              <div className="opacity-60 pointer-events-none space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Nchi na Nambari ya Simu' : 'Country & Mobile Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <select
                      disabled
                      value={selectedCountry}
                      className="bg-gray-100 border border-gray-300 rounded-xl px-2.5 py-3 text-xs font-semibold text-gray-500"
                    >
                      {COUNTRY_OPTIONS.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.country} ({c.code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      disabled
                      placeholder="712 345 678"
                      className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-500"
                    />
                  </div>
                </div>
                <button
                  disabled
                  className="w-full py-3.5 px-4 bg-gray-300 text-gray-600 font-bold rounded-xl text-sm cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isSwahili ? 'Lango la SMS Halijasanidiwa' : 'SMS Gateway Unconfigured'}</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'phone' && phoneAuthAvailable && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      {isSwahili ? 'Nchi na Nambari ya Simu' : 'Country & Mobile Phone Number'}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-green"
                      >
                        {COUNTRY_OPTIONS.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.country} ({c.code})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={nationalNumber}
                        onChange={(e) => setNationalNumber(e.target.value)}
                        placeholder="712 345 678"
                        required
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {isSwahili 
                        ? 'Tutakutumia msimbo wa SMS wenye tarakimu 6 bila malipo.' 
                        : 'We will dispatch a secure 6-digit SMS code to verify your phone.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      {isSwahili ? 'Jina Lako (Hiari)' : 'Full Name (For Certificate)'}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Amina Wanjiku"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{isSubmitting ? (isSwahili ? 'Inatuma...' : 'Sending Code...') : (isSwahili ? 'Tuma Msimbo wa SMS' : 'Send Verification Code')}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                    <p className="font-semibold">
                      {isSwahili ? 'Msimbo umetumwa kwa:' : 'Verification code sent to:'}
                    </p>
                    <p className="font-bold text-sm text-emerald-950 mt-0.5">
                      {selectedCountry} {nationalNumber}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      {isSwahili ? 'Weka Msimbo wa Tarakimu 6' : 'Enter 6-Digit Code'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      required
                      autoFocus
                      className="w-full text-center tracking-[0.5em] font-mono text-2xl bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setErrorMessage(null); }}
                      className="text-gray-600 hover:text-forest-green font-medium underline"
                    >
                      {isSwahili ? 'Badili nambari' : 'Change number'}
                    </button>

                    {cooldownRemaining > 0 ? (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Resend in {cooldownRemaining}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        className="text-forest-green font-bold hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isSwahili ? 'Tuma tena' : 'Resend code'}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otpCode.length !== 6}
                    className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSubmitting ? (isSwahili ? 'Inathibitisha...' : 'Verifying...') : (isSwahili ? 'Thibitisha & Anza Kujifunza' : 'Verify & Start Learning')}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 2: EMAIL SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Barua Pepe' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@climatejustice.ke"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    {isSwahili ? 'Nenosiri' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('recovery'); setErrorMessage(null); }}
                    className="text-xs font-semibold text-forest-green hover:underline"
                  >
                    {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? (isSwahili ? 'Inaingia...' : 'Signing in...') : (isSwahili ? 'Ingia kwa Barua Pepe' : 'Sign In with Email')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-gray-500 pt-2">
                <span>{isSwahili ? 'Huna akaunti?' : "Don't have an account?"} </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(null); }}
                  className="font-bold text-forest-green hover:underline"
                >
                  {isSwahili ? 'Jiunge Hapa' : 'Register Here'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: CREATE ACCOUNT */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Jina au Lakabu' : 'Name or Nickname'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amina Wanjiku"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Barua Pepe' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@climatejustice.ke"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Nenosiri (herufi 8+)' : 'Password (8+ chars)'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-forest-green focus:ring-forest-green"
                />
                <label htmlFor="privacy" className="text-xs text-gray-600 leading-tight">
                  {isSwahili 
                    ? 'Ninakubali ilani ya faragha ya utafiti na uhifadhi wa maendeleo yangu.' 
                    : 'I agree to the research privacy notice and progress tracking policy.'}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? (isSwahili ? 'Inaunda...' : 'Creating...') : (isSwahili ? 'Unda Akaunti Yangu' : 'Create My Account')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-gray-500 pt-2">
                <span>{isSwahili ? 'Tayari una akaunti? Tumia kichupo cha juu kuingia.' : 'Already have an account? Use the Sign In tab above.'}</span>
              </div>
            </form>
          )}

          {/* MODE 4: PASSWORD RECOVERY */}
          {mode === 'recovery' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isSwahili ? 'Urejeshaji Bila Gharama ya Barua Pepe' : 'Zero-Cost Emergency Recovery'}</span>
                </p>
                <p>
                  {isSwahili 
                    ? 'Tumia msimbo wa herufi 16 uliopewa wakati wa usajili kurekebisha nenosiri lako mara moja.' 
                    : 'Use the 16-character recovery code provided during account registration to instantly reset your password.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Barua Pepe Yako' : 'Your Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="learner@climatejustice.ke"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Msimbo wa Dharura (XXXX-XXXX-XXXX-XXXX)' : 'Recovery Code (XXXX-XXXX-XXXX-XXXX)'}
                </label>
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  placeholder="ABCD-EF12-34GH-56JK"
                  required
                  className="w-full font-mono uppercase bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Nenosiri Jipya' : 'New Password'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? (isSwahili ? 'Inarekebisha...' : 'Resetting...') : (isSwahili ? 'Rekebisha Nenosiri Langu' : 'Reset My Password')}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); }}
                  className="text-xs text-forest-green hover:underline font-semibold"
                >
                  {isSwahili ? '← Rudi kwenye kuingia' : '← Back to sign in'}
                </button>
              </div>
            </form>
          )}

          {/* Visual Divider & Secondary Options */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider absolute">
              {isSwahili ? 'Chaguo Zaidi' : 'Additional Options'}
            </span>
          </div>

          {/* Google Identity Services Container */}
          {googleClientId ? (
            <div ref={googleButtonRef} className="w-full flex justify-center min-h-[44px] mb-4" />
          ) : null}

          {/* Option: Continue as Guest (Public discovery / Preview mode) */}
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Leaf className="w-3.5 h-3.5 text-forest-green" />
            <span>{isSwahili ? 'Gundua Mtaala kama Mgeni' : 'Continue as Guest (Explore Catalog)'}</span>
          </button>
        </div>
      </main>

      {/* Recovery Code Display Modal (After Successful Registration) */}
      {createdRecoveryCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">
                {isSwahili ? 'Hifadhi Msimbo Wako wa Dharura' : 'Save Your Recovery Code'}
              </h2>
              <p className="text-xs text-gray-500">
                {isSwahili 
                  ? 'Msimbo huu unakuwezesha kurejesha akaunti yako ukisahau nenosiri bila kutegemea barua pepe.' 
                  : 'This zero-cost emergency code lets you reset your password without needing an email server.'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-between gap-2">
              <span className="font-mono text-base font-bold text-gray-900 tracking-wider">
                {createdRecoveryCode}
              </span>
              <button
                type="button"
                onClick={copyRecoveryCode}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-forest-green shadow-sm transition-all"
                title="Copy code"
              >
                {codeCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleFinishRegistration}
              className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md text-sm"
            >
              {isSwahili ? 'Nimehifadhi Msimbo, Endelea' : 'I have saved my code, Continue'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 max-w-xl mx-auto py-2">
        <p>
          Climate Justice Nairobi • Independent Climate Learning Platform
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Dedicated to Community Resilience, Urban Adaptation, and Environmental Rights
        </p>
      </footer>
    </div>
  );
}
