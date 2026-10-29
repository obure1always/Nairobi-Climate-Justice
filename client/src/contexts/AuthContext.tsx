import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db';

export interface AuthUser {
  id: string;
  email: string | null;
  phone?: string | null;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  name: string | null;
  displayName: string | null;
  avatarUrl?: string | null;
  role: 'learner' | 'instructor' | 'admin' | 'researcher';
  title?: string | null;
  bio?: string | null;
  expertise?: string | null;
  institution?: string | null;
  authProvider: 'email' | 'google' | 'phone';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isGuest: boolean;
  guestId: string;
  isLoading: boolean;
  error: string | null;
  showTransferModal: boolean;
  continueAsGuest: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, confirmPassword?: string, name?: string) => Promise<{ success: boolean; recoveryCode?: string; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  registerWithPhone: (countryCode: string, nationalNumber: string, password: string, name: string, recoveryEmail?: string) => Promise<{ success: boolean; recoveryCode?: string; error?: string }>;
  loginWithPhone: (countryCode: string, nationalNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { displayName?: string; name?: string; avatarUrl?: string; bio?: string }) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => Promise<void>;
  transferGuestProgress: () => Promise<{ success: boolean; count: number }>;
  dismissTransferModal: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  regenerateRecoveryCode: () => Promise<{ success: boolean; recoveryCode?: string; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = '/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [guestId, setGuestId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);

  // Initialize guest ID and check existing session
  useEffect(() => {
    let existingGuestId = localStorage.getItem('climate_justice_guest_id');
    if (!existingGuestId) {
      existingGuestId = `guest_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('climate_justice_guest_id', existingGuestId);
    }
    setGuestId(existingGuestId);

    const initAuth = async () => {
      const savedToken = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token');
      if (savedToken) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setUser(data.user);
              setToken(savedToken);
              setIsGuest(false);
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // Network offline: retain offline guest mode
        }
      }

      // Default or saved guest status
      const guestFlag = localStorage.getItem('climate_justice_is_guest');
      setIsGuest(guestFlag !== 'false');
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const checkForLocalProgress = async () => {
    try {
      const records = await db.progress.toArray();
      const hasCompletedLessons = records.some(r => r.completedLessons && r.completedLessons.length > 0);
      if (hasCompletedLessons) {
        setShowTransferModal(true);
      }
    } catch {
      // Local DB read failure non-fatal
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('climate_justice_is_guest', 'true');
    setUser(null);
    setToken(null);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid email or password' };
      }

      setUser(data.user);
      setToken(data.token);
      setIsGuest(false);
      localStorage.setItem('climate_justice_is_guest', 'false');
      sessionStorage.setItem('climate_justice_token', data.token);

      await checkForLocalProgress();
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to authentication server. Please check your connection or continue as guest.' };
    }
  };

  const register = async (
    email: string, 
    password: string, 
    confirmPassword?: string, 
    name?: string
  ): Promise<{ success: boolean; recoveryCode?: string; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword, name, privacyConsent: true })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }

      setUser(data.user);
      setToken(data.token);
      setIsGuest(false);
      localStorage.setItem('climate_justice_is_guest', 'false');
      sessionStorage.setItem('climate_justice_token', data.token);

      await checkForLocalProgress();
      return { success: true, recoveryCode: data.recoveryCode };
    } catch {
      return { success: false, error: 'Cannot connect to registration server. Offline guest mode is available.' };
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Google authentication failed' };
      }

      setUser(data.user);
      setToken(data.token);
      setIsGuest(false);
      localStorage.setItem('climate_justice_is_guest', 'false');
      sessionStorage.setItem('climate_justice_token', data.token);

      await checkForLocalProgress();
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to verify Google identity. Check your network connection.' };
    }
  };

  const registerWithPhone = async (
    countryCode: string, 
    nationalNumber: string, 
    password: string, 
    name: string, 
    recoveryEmail?: string
  ): Promise<{ success: boolean; recoveryCode?: string; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/phone/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, nationalNumber, password, name, recoveryEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account with phone' };
      }

      setUser(data.user);
      setToken(data.token);
      setIsGuest(false);
      localStorage.setItem('climate_justice_is_guest', 'false');
      sessionStorage.setItem('climate_justice_token', data.token);

      await checkForLocalProgress();
      return { success: true, recoveryCode: data.recoveryCode };
    } catch {
      return { success: false, error: 'Cannot connect to authentication service. Please check your network connection.' };
    }
  };

  const loginWithPhone = async (
    countryCode: string, 
    nationalNumber: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/phone/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, nationalNumber, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid phone number or password' };
      }

      setUser(data.user);
      setToken(data.token);
      setIsGuest(false);
      localStorage.setItem('climate_justice_is_guest', 'false');
      sessionStorage.setItem('climate_justice_token', data.token);

      await checkForLocalProgress();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during phone login. Please try again.' };
    }
  };

  const updateProfile = async (data: { displayName?: string; name?: string; avatarUrl?: string; bio?: string }): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to update profile' };
      }
      setUser(result.user);
      return { success: true, user: result.user };
    } catch {
      return { success: false, error: 'Network error occurred while updating profile' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // Logout local cleanup anyway
      }
    }
    sessionStorage.removeItem('climate_justice_token');
    localStorage.removeItem('climate_justice_token');
    setUser(null);
    setToken(null);
    setIsGuest(true);
    localStorage.setItem('climate_justice_is_guest', 'true');
    setShowTransferModal(false);
  };

  const transferGuestProgress = async (): Promise<{ success: boolean; count: number }> => {
    if (!token) return { success: false, count: 0 };
    try {
      const records = await db.progress.toArray();
      const res = await fetch(`${API_BASE}/auth/transfer-guest-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progressRecords: records })
      });
      const data = await res.json();
      setShowTransferModal(false);
      if (res.ok) {
        return { success: true, count: data.transferredCount || 0 };
      }
      return { success: false, count: 0 };
    } catch {
      setShowTransferModal(false);
      return { success: false, count: 0 };
    }
  };

  const dismissTransferModal = () => {
    setShowTransferModal(false);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to change password' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred while changing password' };
    }
  };

  const regenerateRecoveryCode = async (): Promise<{ success: boolean; recoveryCode?: string; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/auth/regenerate-recovery-code`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to regenerate recovery code' };
      }
      return { success: true, recoveryCode: data.recoveryCode };
    } catch {
      return { success: false, error: 'Network error occurred while generating code' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/auth/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to delete account' };
      }
      await logout();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred during account deletion' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isGuest,
        guestId,
        isLoading,
        error,
        showTransferModal,
        continueAsGuest,
        login,
        register,
        loginWithGoogle,
        registerWithPhone,
        loginWithPhone,
        updateProfile,
        logout,
        transferGuestProgress,
        dismissTransferModal,
        changePassword,
        regenerateRecoveryCode,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
