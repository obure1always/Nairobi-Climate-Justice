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
  ShieldCheck
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
    registerWithPhone,
    loginWithPhone 
  } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isSwahili = language === 'sw';

  // Navigation target after auth
  const from = (location.state as any)?.from?.pathname || '/';

  // Auth mode: 'signin' | 'register' | 'recovery'
  const [mode, setMode] = useState<'signin' | 'register' | 'recovery'>('signin');
  // Authentication identifier method: 'phone' | 'email'
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');

  // Phone Form fields
  const [selectedCountry, setSelectedCountry] = useState('+254');
  const [nationalNumber, setNationalNumber] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Email Form fields
  const [email, setEmail] = useState('');

  // Shared Form fields
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Password Recovery fields
  const [recoveryIdentifierType, setRecoveryIdentifierType] = useState<'phone' | 'email'>('phone');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  // Phone Sign In Handler
  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!nationalNumber.trim() || !password) {
      setErrorMessage(isSwahili ? 'Tafadhali weka nambari ya simu na nenosiri.' : 'Please enter your phone number and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginWithPhone(selectedCountry, nationalNumber.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || (isSwahili ? 'Nambari ya simu au nenosiri si sahihi' : 'Invalid phone number or password'));
    }
  };

  // Email Sign In Handler
  const handleEmailSignIn = async (e: React.FormEvent) => {
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

  // Phone Registration Handler
  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!name.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka jina lako.' : 'Please enter your full name.');
      return;
    }

    if (!nationalNumber.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka nambari yako ya simu.' : 'Please enter your phone number.');
      return;
    }

    if (!password) {
      setErrorMessage(isSwahili ? 'Tafadhali weka nenosiri.' : 'Please enter a password.');
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
    const res = await registerWithPhone(
      selectedCountry,
      nationalNumber.trim(),
      password,
      name.trim(),
      recoveryEmail.trim() || undefined
    );
    setIsSubmitting(false);

    if (res.success && res.recoveryCode) {
      setCreatedRecoveryCode(res.recoveryCode);
    } else if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || (isSwahili ? 'Usajili umeshindwa' : 'Registration failed'));
    }
  };

  // Email Registration Handler
  const handleEmailRegister = async (e: React.FormEvent) => {
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

  // Password Recovery Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const identifier = recoveryIdentifierType === 'phone' ? nationalNumber.trim() : email.trim();
    if (!identifier || !recoveryCode.trim() || !newPassword) {
      setErrorMessage(isSwahili ? 'Tafadhali jaza maelezo yote ya urejeshaji.' : 'Please fill in all recovery fields.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(isSwahili ? 'Nenosiri jipya lazima liwe na herufi 8 au zaidi.' : 'New password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        recoveryCode: recoveryCode.trim().toUpperCase(),
        newPassword
      };
      if (recoveryIdentifierType === 'phone') {
        payload.countryCode = selectedCountry;
        payload.nationalNumber = nationalNumber.trim();
      } else {
        payload.email = email.trim();
      }

      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
        setErrorMessage(data.error || (isSwahili ? 'Msimbo wa urejeshaji si sahihi.' : 'Invalid account identifier or recovery code.'));
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
                ? 'Jukwaa la elimu ya tabianchi kwa vijana wa Kenya. Ingia kuanza kujifunza:'
                : 'Kenya-focused climate education platform. Sign in to start learning and earning verifiable credentials:'}
            </p>
          </div>

          {/* Primary Authentication Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-5 text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(null); setStatusMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                mode === 'signin' 
                  ? 'bg-white text-forest-green font-bold shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Ingia' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(null); setStatusMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                mode === 'register' 
                  ? 'bg-white text-forest-green font-bold shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Unda Akaunti' : 'Create Account'}</span>
            </button>
          </div>

          {/* Method Selector: Phone Number vs Email Address */}
          {mode !== 'recovery' && (
            <div className="flex bg-gray-100/80 p-0.5 rounded-xl mb-5 text-xs font-medium">
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'phone'
                    ? 'bg-white text-forest-green font-bold shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Phone className="w-3 h-3" />
                <span>{isSwahili ? 'Nambari ya Simu' : 'Phone & Password'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'email'
                    ? 'bg-white text-forest-green font-bold shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Mail className="w-3 h-3" />
                <span>{isSwahili ? 'Barua Pepe' : 'Email & Password'}</span>
              </button>
            </div>
          )}

          {/* Status and Error Messages */}
          {statusMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {mode === 'signin' && (
            <div>
              {authMethod === 'phone' ? (
                <form onSubmit={handlePhoneSignIn} className="space-y-4">
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
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        {isSwahili ? 'Nenosiri' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('recovery');
                          setRecoveryIdentifierType('phone');
                          setErrorMessage(null);
                        }}
                        className="text-[11px] font-semibold text-forest-green hover:underline"
                      >
                        {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
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
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? (isSwahili ? 'Inaingia...' : 'Signing in...') : (isSwahili ? 'Ingia kwa Nambari ya Simu' : 'Sign In with Phone')}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      {isSwahili ? 'Barua Pepe' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@example.org"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        {isSwahili ? 'Nenosiri' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('recovery');
                          setRecoveryIdentifierType('email');
                          setErrorMessage(null);
                        }}
                        className="text-[11px] font-semibold text-forest-green hover:underline"
                      >
                        {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
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
                    <Mail className="w-4 h-4" />
                    <span>{isSubmitting ? (isSwahili ? 'Inaingia...' : 'Signing in...') : (isSwahili ? 'Ingia kwa Barua Pepe' : 'Sign In with Email')}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 2: CREATE ACCOUNT */}
          {mode === 'register' && (
            <div>
              {authMethod === 'phone' ? (
                <form onSubmit={handlePhoneRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Jina Kamili au Jina la Utani' : 'Name or Nickname (For Certificate)'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amina Wanjiku"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Nchi na Nambari ya Simu' : 'Country & Mobile Phone Number'}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-green"
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
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Nenosiri (herufi 8+)' : 'Password (8+ chars)'}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Barua Pepe ya Dharura (Hiari)' : 'Optional Recovery Email (Backup)'}
                    </label>
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="optional.backup@example.org"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {isSwahili
                        ? 'Hiari: Njia mbadala ya kurejesha akaunti iwapo utapoteza msimbo wako wa dharura.'
                        : 'Optional: Secondary email for password recovery in addition to your one-time recovery code.'}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="privacyPhone"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-forest-green rounded border-gray-300 focus:ring-forest-green"
                    />
                    <label htmlFor="privacyPhone" className="text-[11px] text-gray-600 leading-snug">
                      {isSwahili 
                        ? 'Ninakubali ilani ya faragha ya utafiti na usalama wa data.' 
                        : 'I agree to the privacy notice, password security terms, and research data policy.'}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !privacyAgreed}
                    className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{isSubmitting ? (isSwahili ? 'Inaunda...' : 'Creating Account...') : (isSwahili ? 'Unda Akaunti kwa Simu' : 'Create Account with Phone')}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailRegister} className="space-y-3.5">
                  <div>
                    <label htmlFor="regEmailName" className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Jina Kamili au Jina la Utani' : 'Name or Nickname (For Certificate)'}
                    </label>
                    <input
                      id="regEmailName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amina Wanjiku"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="regEmailAddress" className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Barua Pepe' : 'Email Address'}
                    </label>
                    <input
                      id="regEmailAddress"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@example.org"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="regEmailPassword" className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Nenosiri (herufi 8+)' : 'Password (8+ chars)'}
                    </label>
                    <input
                      id="regEmailPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="regEmailConfirmPassword" className="block text-xs font-bold text-gray-700 mb-1">
                      {isSwahili ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                    </label>
                    <input
                      id="regEmailConfirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="privacyEmail"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-forest-green rounded border-gray-300 focus:ring-forest-green"
                    />
                    <label htmlFor="privacyEmail" className="text-[11px] text-gray-600 leading-snug">
                      {isSwahili 
                        ? 'Ninakubali ilani ya faragha ya utafiti na usalama wa data.' 
                        : 'I agree to the privacy notice, password security terms, and research data policy.'}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !privacyAgreed}
                    className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{isSubmitting ? (isSwahili ? 'Inaunda...' : 'Creating Account...') : (isSwahili ? 'Unda Akaunti kwa Barua Pepe' : 'Create My Account')}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE 3: PASSWORD RECOVERY */}
          {mode === 'recovery' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>{isSwahili ? 'Urejeshaji Salama wa Nenosiri' : 'Secure Password Recovery'}</span>
                </div>
                <p className="leading-relaxed">
                  {isSwahili 
                    ? 'Weka kitambulisho cha akaunti yako na msimbo wako wa dharura wa tarakimu 16 (XXXX-XXXX-XXXX-XXXX) uliotolewa ulipojiandikisha.' 
                    : 'Enter your registered phone or email along with the 16-character emergency recovery code issued at registration. Passwords cannot be reset by phone number alone.'}
                </p>
              </div>

              <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setRecoveryIdentifierType('phone')}
                  className={`flex-1 py-1 px-2.5 rounded-lg transition-all ${
                    recoveryIdentifierType === 'phone' ? 'bg-white text-forest-green font-bold shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {isSwahili ? 'Nambari ya Simu' : 'Phone Number'}
                </button>
                <button
                  type="button"
                  onClick={() => setRecoveryIdentifierType('email')}
                  className={`flex-1 py-1 px-2.5 rounded-lg transition-all ${
                    recoveryIdentifierType === 'email' ? 'bg-white text-forest-green font-bold shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {isSwahili ? 'Barua Pepe' : 'Email Address'}
                </button>
              </div>

              {recoveryIdentifierType === 'phone' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isSwahili ? 'Nchi na Nambari ya Simu' : 'Country & Mobile Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-gray-800"
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
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isSwahili ? 'Barua Pepe' : 'Registered Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amina@example.org"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Msimbo wa Dharura (XXXX-XXXX-XXXX-XXXX)' : 'Recovery Code (XXXX-XXXX-XXXX-XXXX)'}
                </label>
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  placeholder="A1B2-C3D4-E5F6-G7H8"
                  required
                  className="w-full font-mono bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Nenosiri Jipya (herufi 8+)' : 'New Password (8+ chars)'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); }}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
                >
                  {isSwahili ? 'Ghairi' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (isSwahili ? 'Inabadilisha...' : 'Resetting...') : (isSwahili ? 'Badilisha Nenosiri' : 'Reset My Password')}</span>
                </button>
              </div>
            </form>
          )}

          {/* Google Sign In (if Client ID configured) */}
          {googleClientId && mode !== 'recovery' && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div ref={googleButtonRef} className="w-full flex justify-center" />
            </div>
          )}

          {/* Prominent Continue as Guest Option */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2.5">
              {isSwahili 
                ? 'Ungependa kuchunguza masomo kwanza bila akaunti?' 
                : 'Want to explore the curriculum first without signing up?'}
            </p>
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-3 px-4 border border-forest-green/30 bg-forest-green/5 hover:bg-forest-green/10 text-forest-green font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <span>{isSwahili ? 'Endelea kama Mgeni (Nje ya Mtandao)' : 'Continue as Guest (No Account Needed)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* One-Time 16-Character Recovery Code Modal */}
      {createdRecoveryCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isSwahili ? 'Hifadhi Msimbo Wako wa Dharura' : 'Save Your Recovery Code'}
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {isSwahili
                  ? 'Ili kulinda akaunti yako bila kutumia SMS au barua pepe, huu ndio msimbo wako wa dharura wa kurejesha nenosiri lako. Hifadhi mahali salama sasa:'
                  : 'To safeguard your account securely without SMS reliance, this 16-character code is your emergency password recovery key. Save it in a safe place now:'}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 font-mono text-base font-bold text-gray-900 tracking-wider flex items-center justify-between">
              <span className="select-all">{createdRecoveryCode}</span>
              <button
                type="button"
                onClick={copyRecoveryCode}
                className="p-1.5 text-gray-500 hover:text-forest-green hover:bg-gray-100 rounded-lg transition"
                title="Copy code"
              >
                {codeCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-amber-700 font-medium">
              {isSwahili
                ? '⚠️ Msimbo huu huonyeshwa mara hii moja tu. Hatuwezi kurejesha nenosiri kwa nambari ya simu pekee.'
                : '⚠️ This code is shown only once. Passwords cannot be reset using a phone number alone.'}
            </p>

            <button
              type="button"
              onClick={handleFinishRegistration}
              className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition text-sm shadow"
            >
              {isSwahili ? 'Nimehifadhi Msimbo, Endelea' : 'I Have Saved My Code, Continue'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-3">
        Climate Justice Nairobi &bull; Independent Climate Education
      </footer>
    </div>
  );
}
