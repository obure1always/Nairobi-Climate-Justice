import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../LanguageContext';
import { 
  Leaf, 
  Eye, 
  EyeOff, 
  Mail, 
  User as UserIcon, 
  Copy, 
  Check, 
  Phone, 
  ShieldCheck, 
  AlertCircle 
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
    login, 
    register, 
    loginWithGoogle, 
    registerWithPhone,
    loginWithPhone 
  } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isSwahili = language === 'sw';

  // Navigation target after authenticating
  const from = typeof (location.state as any)?.from === 'string'
    ? (location.state as any).from
    : (location.state as any)?.from?.pathname || '/';

  // Auth mode: 'signin' | 'register' | 'recovery'
  const [mode, setMode] = useState<'signin' | 'register' | 'recovery'>('signin');
  // Authentication identifier method: 'email' (primary) | 'phone' (alternative)
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Phone fields (for optional phone-and-password sign-in/registration)
  const [selectedCountry, setSelectedCountry] = useState('+254');
  const [nationalNumber, setNationalNumber] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Password Recovery fields
  const [recoveryIdentifierType, setRecoveryIdentifierType] = useState<'email' | 'phone'>('email');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // One-time recovery code modal state (after registration)
  const [createdRecoveryCode, setCreatedRecoveryCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Google OAuth Client ID check
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Google Identity Services initialization
  useEffect(() => {
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
      setErrorMessage(res.error || (isSwahili ? 'Barua pepe au nenosiri si sahihi' : 'Invalid email or password.'));
    }
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
      setErrorMessage(res.error || (isSwahili ? 'Nambari ya simu au nenosiri si sahihi' : 'Invalid phone number or password.'));
    }
  };

  // Email Registration Handler
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!name.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka jina lako.' : 'Please enter your full name or nickname.');
      return;
    }

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
      setErrorMessage(res.error || (isSwahili ? 'Usajili umeshindwa' : 'Registration failed.'));
    }
  };

  // Phone Registration Handler (Zero SMS dependency)
  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!name.trim()) {
      setErrorMessage(isSwahili ? 'Tafadhali weka jina lako.' : 'Please enter your full name or nickname.');
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
      setErrorMessage(res.error || (isSwahili ? 'Usajili umeshindwa' : 'Registration failed.'));
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
            ? `Nenosiri limerekebishwa! Msimbo mpya wa dharura ni: ${data.newRecoveryCode}. Unaweza kuingia sasa.` 
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
            <span className="text-base font-extrabold text-gray-900 tracking-tight block">
              Nairobi Climate Justice
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLanguage(isSwahili ? 'en' : 'sw')}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 hover:border-forest-green bg-white text-gray-700 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isSwahili ? '🇰🇪 Kiswahili' : '🇬🇧 English'}</span>
          <span className="text-[10px] text-gray-400 font-normal">| {isSwahili ? 'Badili' : 'Switch'}</span>
        </button>
      </header>

      {/* Main Card Container */}
      <main className="max-w-md w-full mx-auto my-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
        
        {/* Navigation Mode Switcher: Sign In vs Create Account */}
        {mode !== 'recovery' && (
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setStatusMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition text-center cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-forest-green shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {isSwahili ? 'Ingia (Sign In)' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setStatusMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition text-center cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-forest-green shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {isSwahili ? 'Fungua Akaunti' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Method Switcher: Email (Primary) vs Phone (Alternative) */}
        {mode !== 'recovery' && (
          <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-forest-green/10 text-forest-green border border-forest-green/20'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Barua Pepe' : 'Email & Password'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-forest-green/10 text-forest-green border border-forest-green/20'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Nambari ya Simu' : 'Phone & Password'}</span>
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {statusMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{statusMessage}</div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE: SIGN IN */}
        {/* ---------------------------------------------------- */}
        {mode === 'signin' && (
          <div>
            <div className="mb-5">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {isSwahili ? 'Karibu Tena' : 'Sign in to your account'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {authMethod === 'email'
                  ? (isSwahili ? 'Ingia kwa anwani yako ya barua pepe na nenosiri.' : 'Enter your email and password to access your learning dashboard.')
                  : (isSwahili ? 'Ingia kwa nambari yako ya simu na nenosiri.' : 'Enter your phone number and password.')}
              </p>
            </div>

            {authMethod === 'email' ? (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label htmlFor="signinEmail" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Barua Pepe' : 'Email Address'}
                  </label>
                  <input
                    id="signinEmail"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.org"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="signinEmailPassword" className="block text-xs font-bold text-gray-700">
                      {isSwahili ? 'Nenosiri' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('recovery');
                        setRecoveryIdentifierType('email');
                        setErrorMessage(null);
                        setStatusMessage(null);
                      }}
                      className="text-[11px] font-semibold text-forest-green hover:underline cursor-pointer"
                    >
                      {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="signinEmailPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isSwahili ? 'Inathibitisha...' : 'Signing in...'}</span>
                    </>
                  ) : (
                    <span>{isSwahili ? 'Ingia kwa Barua Pepe' : 'Sign In with Email'}</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneSignIn} className="space-y-4">
                <div>
                  <label htmlFor="signinPhone" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Nambari ya Simu' : 'Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-2.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-forest-green"
                      aria-label="Country Code"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="signinPhone"
                      type="tel"
                      autoComplete="tel"
                      value={nationalNumber}
                      onChange={(e) => setNationalNumber(e.target.value)}
                      placeholder="712 345 678"
                      required
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="signinPhonePassword" className="block text-xs font-bold text-gray-700">
                      {isSwahili ? 'Nenosiri' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('recovery');
                        setRecoveryIdentifierType('phone');
                        setErrorMessage(null);
                        setStatusMessage(null);
                      }}
                      className="text-[11px] font-semibold text-forest-green hover:underline cursor-pointer"
                    >
                      {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="signinPhonePassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isSwahili ? 'Inathibitisha...' : 'Signing in...'}</span>
                    </>
                  ) : (
                    <span>{isSwahili ? 'Ingia kwa Simu' : 'Sign In with Phone'}</span>
                  )}
                </button>
              </form>
            )}

            {/* Optional Google Identity Sign In */}
            {googleClientId && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div ref={googleButtonRef} className="w-full flex justify-center" />
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE: CREATE ACCOUNT */}
        {/* ---------------------------------------------------- */}
        {mode === 'register' && (
          <div>
            <div className="mb-5">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {isSwahili ? 'Fungua Akaunti ya Mwanafunzi' : 'Create your account'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {authMethod === 'email'
                  ? (isSwahili ? 'Jiandikishe kwa jina, barua pepe na nenosiri salama.' : 'Register with your name, email, and password to start learning.')
                  : (isSwahili ? 'Jiandikishe kwa jina, nambari ya simu na nenosiri.' : 'Register with your name, phone number, and password.')}
              </p>
            </div>

            {authMethod === 'email' ? (
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div>
                  <label htmlFor="regEmailName" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Jina Kamili au Lakabu' : 'Full Name or Learner Nickname'}
                  </label>
                  <div className="relative">
                    <input
                      id="regEmailName"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amina Wanjiku"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label htmlFor="regEmailAddress" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Barua Pepe' : 'Email Address'}
                  </label>
                  <input
                    id="regEmailAddress"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.org"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="regEmailPassword" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Nenosiri' : 'Password (min. 8 characters)'}
                  </label>
                  <div className="relative">
                    <input
                      id="regEmailPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="regEmailConfirmPassword" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <input
                      id="regEmailConfirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      id="regEmailPrivacy"
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      required
                      className="mt-0.5 rounded border-gray-300 text-forest-green focus:ring-forest-green"
                    />
                    <span className="leading-relaxed">
                      {isSwahili
                        ? 'Ninakubali ilani ya faragha na masharti ya elimu ya hali ya hewa ya jamii.'
                        : 'I agree to the privacy notice and climate learning platform terms.'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isSwahili ? 'Inaunda akaunti...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <span>{isSwahili ? 'Unda Akaunti Yangu' : 'Create My Account'}</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneRegister} className="space-y-4">
                <div>
                  <label htmlFor="regPhoneName" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Jina Kamili au Lakabu' : 'Full Name or Learner Nickname'}
                  </label>
                  <div className="relative">
                    <input
                      id="regPhoneName"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amina Wanjiku"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label htmlFor="regPhone" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Nambari ya Simu' : 'Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-2.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-forest-green"
                      aria-label="Country Code"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="regPhone"
                      type="tel"
                      autoComplete="tel"
                      value={nationalNumber}
                      onChange={(e) => setNationalNumber(e.target.value)}
                      placeholder="712 345 678"
                      required
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {selectedCountry === '+254' ? 'e.g. 0712 345 678 or 0112 345 678 (9 digits)' : 'Local phone format'}
                  </span>
                </div>

                <div>
                  <label htmlFor="regPhonePassword" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Nenosiri' : 'Password (min. 8 characters)'}
                  </label>
                  <div className="relative">
                    <input
                      id="regPhonePassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="regPhoneConfirmPassword" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <input
                      id="regPhoneConfirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={8}
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="regPhoneRecoveryEmail" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Barua Pepe ya Dharura (Hiari)' : 'Optional Recovery Email'}
                  </label>
                  <input
                    id="regPhoneRecoveryEmail"
                    type="email"
                    autoComplete="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="backup@example.org (optional)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {isSwahili ? 'Inatumika kusaidia kurejesha nenosiri iwapo utapoteza msimbo.' : 'Optional recovery address in case you misplace your recovery code.'}
                  </span>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      id="regPhonePrivacy"
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      required
                      className="mt-0.5 rounded border-gray-300 text-forest-green focus:ring-forest-green"
                    />
                    <span className="leading-relaxed">
                      {isSwahili
                        ? 'Ninakubali ilani ya faragha na masharti ya elimu ya hali ya hewa ya jamii.'
                        : 'I agree to the privacy notice and climate learning platform terms.'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isSwahili ? 'Inaunda akaunti...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <span>{isSwahili ? 'Unda Akaunti Yangu' : 'Create My Account'}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE: PASSWORD RECOVERY */}
        {/* ---------------------------------------------------- */}
        {mode === 'recovery' && (
          <div>
            <div className="mb-5">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {isSwahili ? 'Urejeshaji wa Nenosiri' : 'Password Recovery'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {isSwahili
                  ? 'Weka msimbo wako wa dharura wa tarakimu 16 uliopokea wakati wa usajili.'
                  : 'Enter your 16-character cryptographic recovery code issued when you created your account.'}
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setRecoveryIdentifierType('email')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    recoveryIdentifierType === 'email'
                      ? 'bg-forest-green text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isSwahili ? 'Kwa Barua Pepe' : 'Email Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setRecoveryIdentifierType('phone')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    recoveryIdentifierType === 'phone'
                      ? 'bg-forest-green text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isSwahili ? 'Kwa Simu' : 'Phone Account'}
                </button>
              </div>

              {recoveryIdentifierType === 'email' ? (
                <div>
                  <label htmlFor="recoveryEmailAddress" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Anwani ya Barua Pepe' : 'Account Email'}
                  </label>
                  <input
                    id="recoveryEmailAddress"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.org"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="recoveryPhone" className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isSwahili ? 'Nambari ya Simu' : 'Account Phone Number'}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-2.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="recoveryPhone"
                      type="tel"
                      value={nationalNumber}
                      onChange={(e) => setNationalNumber(e.target.value)}
                      placeholder="712 345 678"
                      required
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="recoveryCodeInput" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Msimbo wa Dharura (Tarakimu 16)' : '16-Character Recovery Code'}
                </label>
                <input
                  id="recoveryCodeInput"
                  type="text"
                  autoComplete="off"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <div>
                <label htmlFor="newPasswordInput" className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isSwahili ? 'Nenosiri Jipya' : 'New Password (min. 8 characters)'}
                </label>
                <div className="relative">
                  <input
                    id="newPasswordInput"
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isSwahili ? 'Inasasisha...' : 'Updating Password...'}</span>
                  </>
                ) : (
                  <span>{isSwahili ? 'Weka Nenosiri Jipya' : 'Reset Password'}</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setStatusMessage(null);
                  }}
                  className="text-xs text-forest-green font-bold hover:underline cursor-pointer"
                >
                  {isSwahili ? '← Rudi kwenye Kuingia' : '← Back to Sign In'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* One-Time 16-Character Recovery Code Modal */}
      {createdRecoveryCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isSwahili ? 'Hifadhi Msimbo Wako wa Dharura' : 'Save Your Recovery Key'}
              </h2>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {isSwahili
                  ? 'Ili kulinda akaunti yako na kuhakikisha unalindwa iwapo utasahau nenosiri lako, huu ndio msimbo wako wa dharura wa kurejesha akaunti. Hifadhi mahali salama sasa:'
                  : 'To safeguard your account and ensure you can reset your password securely, this 16-character code is your emergency recovery key. Save it in a safe place now:'}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 font-mono text-base font-bold text-gray-900 tracking-wider flex items-center justify-between">
              <span className="select-all">{createdRecoveryCode}</span>
              <button
                type="button"
                onClick={copyRecoveryCode}
                className="p-1.5 text-gray-500 hover:text-forest-green hover:bg-gray-100 rounded-lg transition cursor-pointer"
                title="Copy code"
              >
                {codeCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-amber-700 font-medium">
              {isSwahili
                ? '⚠️ Msimbo huu huonyeshwa mara hii moja tu. Hifadhi mahali salama.'
                : '⚠️ This code is shown only once. Keep it in a secure location.'}
            </p>

            <button
              type="button"
              onClick={handleFinishRegistration}
              className="w-full py-3.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl transition text-sm shadow cursor-pointer"
            >
              {isSwahili ? 'Nimehifadhi Msimbo, Endelea Kwenye Masomo' : 'I Have Saved My Code, Continue to Learning'}
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
