import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db';
import { apiUrl } from '../lib/api';
import { SyncService } from '../SyncService';

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
  ownerId: string | null;
  isLoading: boolean;
  error: string | null;
  showTransferModal: boolean;
  continueAsGuest: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, confirmPassword?: string, name?: string) => Promise<{ success: boolean; recoveryCode?: string; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  registerWithPhone: (
    countryCode: string, 
    nationalNumber: string, 
    password: string, 
    name: string, 
    recoveryEmail?: string
  ) => Promise<{ success: boolean; recoveryCode?: string; error?: string }>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [guestId, setGuestId] = useState<string>('');
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);

  const saveSession = (authenticatedUser: AuthUser, sessionToken: string) => {
    setUser(authenticatedUser);
    setToken(sessionToken);
    setIsGuest(false);
    setOwnerId(authenticatedUser.id);
    localStorage.setItem('climate_justice_user_id', authenticatedUser.id);
    localStorage.setItem('climate_justice_owner_id', authenticatedUser.id);
    localStorage.setItem('climate_justice_token', sessionToken);
    sessionStorage.setItem('climate_justice_token', sessionToken);
    localStorage.setItem('climate_justice_is_guest', 'false');
  };

  const clearSession = () => {
    const activeGuestId = localStorage.getItem('climate_justice_guest_id') || guestId;
    setUser(null);
    setToken(null);
    setIsGuest(true);
    setOwnerId(activeGuestId || null);
    localStorage.removeItem('climate_justice_user_id');
    if (activeGuestId) localStorage.setItem('climate_justice_owner_id', activeGuestId);
    else localStorage.removeItem('climate_justice_owner_id');
    localStorage.removeItem('climate_justice_token');
    sessionStorage.removeItem('climate_justice_token');
    localStorage.setItem('climate_justice_is_guest', 'true');
  };

  // Restore authentic session across page refreshes
  useEffect(() => {
    let existingGuestId = localStorage.getItem('climate_justice_guest_id');
    if (!existingGuestId) {
      existingGuestId = `guest_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('climate_justice_guest_id', existingGuestId);
    }
    setGuestId(existingGuestId);

    const initAuth = async () => {
      const savedToken = localStorage.getItem('climate_justice_token') || sessionStorage.getItem('climate_justice_token');
      const savedUserId = localStorage.getItem('climate_justice_user_id');
      if (savedToken) {
        try {
          const res = await fetch(apiUrl('/auth/me'), {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              saveSession(data.user, savedToken);
              setIsLoading(false);
              return;
            }
          } else if (res.status === 401) {
            clearSession();
          } else if (savedUserId) {
            setOwnerId(savedUserId);
          }
        } catch {
          if (savedUserId) setOwnerId(savedUserId);
        }
      } else {
        clearSession();
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const checkForLocalProgress = async (authenticatedUser: AuthUser) => {
    try {
      if (!guestId) return;
      const [guestProgress, legacyProgress, guestQueue, unassignedQueue] = await Promise.all([
        db.accountProgress.where('ownerId').equals(guestId).toArray(),
        db.progress.toArray(),
        db.syncQueue.where('ownerId').equals(guestId).toArray(),
        db.syncQueue.filter(record => !record.ownerId).toArray()
      ]);
      const untransferredLegacy = await Promise.all(legacyProgress.map(async record => ({
        record,
        transferred: await db.transferLog.get(`${authenticatedUser.id}:${record.moduleId}`)
      })));
      const hasProgress = guestProgress.length > 0
        || untransferredLegacy.some(item => !item.transferred && (item.record.completed || item.record.completedLessons.length > 0));
      if (hasProgress || guestQueue.length > 0 || unassignedQueue.length > 0) {
        setShowTransferModal(true);
      }
    } catch (error) {
      console.error('Failed to check local progress for transfer', error);
    }
  };

  const continueAsGuest = () => {
    clearSession();
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: `Backend API server unreachable (received status ${res.status}). Verify API server is listening on port 3001.`
        };
      }
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid email or password' };
      }

      saveSession(data.user, data.token);
      await checkForLocalProgress(data.user);
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || 'Cannot connect to authentication server. Please check your backend connection.' 
      };
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
      const res = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword, name, privacyConsent: true })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: `Backend API server unreachable (received status ${res.status}). Verify API server is listening on port 3001.`
        };
      }
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }

      saveSession(data.user, data.token);
      await checkForLocalProgress(data.user);
      return { success: true, recoveryCode: data.recoveryCode };
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || 'Cannot connect to registration server. Please check your network connection.' 
      };
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(apiUrl('/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Google authentication failed' };
      }

      saveSession(data.user, data.token);
      await checkForLocalProgress(data.user);
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
      const res = await fetch(apiUrl('/auth/phone/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, nationalNumber, password, name, recoveryEmail })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: `Backend API server unreachable (received status ${res.status}). Verify API server is listening on port 3001.`
        };
      }
      const data = await res.json();
      if (!res.ok) {
        return { 
          success: false, 
          error: data.error || 'Failed to create account with phone' 
        };
      }

      saveSession(data.user, data.token);
      await checkForLocalProgress(data.user);
      return { success: true, recoveryCode: data.recoveryCode };
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || 'Cannot connect to authentication service. Please check your network connection.' 
      };
    }
  };

  const loginWithPhone = async (
    countryCode: string, 
    nationalNumber: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const res = await fetch(apiUrl('/auth/phone/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, nationalNumber, password })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: `Backend API server unreachable (received status ${res.status}). Verify API server is listening on port 3001.`
        };
      }
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid phone number or password' };
      }

      saveSession(data.user, data.token);
      await checkForLocalProgress(data.user);
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || 'Network error during phone login. Please try again.' 
      };
    }
  };

  const updateProfile = async (data: { displayName?: string; name?: string; avatarUrl?: string; bio?: string }): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(apiUrl('/auth/profile'), {
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
        await fetch(apiUrl('/auth/logout'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // Logout local cleanup anyway
      }
    }
    clearSession();
    setShowTransferModal(false);
  };

  const transferGuestProgress = async (): Promise<{ success: boolean; count: number }> => {
    if (!token || !user || !guestId) return { success: false, count: 0 };
    try {
      const [guestProgress, legacyProgress, guestLearningTime] = await Promise.all([
        db.accountProgress.where('ownerId').equals(guestId).toArray(),
        db.progress.toArray(),
        db.learningTime.where('ownerId').equals(guestId).toArray()
      ]);
      const legacyRecords = await Promise.all(legacyProgress.map(async record => ({
        record,
        transferred: await db.transferLog.get(`${user.id}:${record.moduleId}`)
      })));
      const progressRecords = [
        ...guestProgress,
        ...legacyRecords
          .filter(item => !item.transferred)
          .map(({ record }) => ({ ...record, ownerId: undefined }))
      ];
      const res = await fetch(apiUrl('/auth/transfer-guest-progress'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progressRecords })
      });
      const data = await res.json();
      if (res.ok) {
        await db.transaction('rw', db.accountProgress, db.learningTime, db.syncQueue, db.transferLog, async () => {
          for (const record of progressRecords) {
            const existing = await db.accountProgress.get([user.id, record.moduleId]);
            await db.accountProgress.put({
              ownerId: user.id,
              moduleId: record.moduleId,
              completedLessons: [...new Set([...(existing?.completedLessons || []), ...record.completedLessons])],
              completed: Boolean(existing?.completed || record.completed),
              lastAccessed: record.lastAccessed
            });
            if (record.ownerId === undefined) {
              await db.transferLog.put({ id: `${user.id}:${record.moduleId}` });
            }
          }

          for (const time of guestLearningTime) {
            const existing = await db.learningTime.get([user.id, time.date]);
            await db.learningTime.put({
              ownerId: user.id,
              date: time.date,
              seconds: (existing?.seconds || 0) + time.seconds
            });
          }

          await db.syncQueue
            .filter(record => !record.ownerId || record.ownerId === guestId)
            .modify({ ownerId: user.id, status: 'pending' });
        });
        await db.learningTime.bulkDelete(guestLearningTime.map(time => [guestId, time.date]));
        await db.accountProgress.bulkDelete(guestProgress.map(record => [guestId, record.moduleId]));
        await SyncService.syncNow(user.id);
        window.dispatchEvent(new Event('climate-justice-data-changed'));
        setShowTransferModal(false);
        return { success: true, count: data.transferredCount || 0 };
      }
      setShowTransferModal(false);
      return { success: false, count: 0 };
    } catch (error) {
      console.error('Failed to transfer guest progress', error);
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
      const res = await fetch(apiUrl('/auth/change-password'), {
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
      const res = await fetch(apiUrl('/auth/regenerate-recovery-code'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to regenerate recovery code' };
      }
      return { success: true, recoveryCode: data.recoveryCode };
    } catch {
      return { success: false, error: 'Network error occurred while regenerating recovery code' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(apiUrl('/auth/account'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to delete account' };
      }
      await logout();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred while deleting account' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isGuest,
        guestId,
        ownerId,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
