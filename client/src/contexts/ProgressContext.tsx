import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, type AccountProgress, type LearningTime, type UserSettings } from '../db';
import { SyncService } from '../SyncService';
import { useAuth } from './AuthContext';
import { apiUrl } from '../lib/api';
import { modules } from '../data/modules';

interface ProgressContextType {
  progress: Record<string, AccountProgress>;
  settings: UserSettings | null;
  learningTime: LearningTime[];
  isLoading: boolean;
  updateLessonProgress: (moduleId: string, lessonIndex: number) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  achievements: string[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ownerId, token, isLoading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Record<string, AccountProgress>>({});
  const [dataOwnerId, setDataOwnerId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [learningTime, setLearningTime] = useState<LearningTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !ownerId) return;
    let active = true;
    setIsLoading(true);

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [accountRecords, currentSettings, accountLearningTime, allAchievements] = await Promise.all([
          db.accountProgress.where('ownerId').equals(ownerId).toArray(),
          db.settings.get('current'),
          db.learningTime.where('ownerId').equals(ownerId).toArray(),
          db.achievements.toArray()
        ]);
        if (!active) return;

        const progressByModule = new Map(accountRecords.map(record => [record.moduleId, record]));
        if (token) {
          try {
            const response = await fetch(apiUrl('/learning/progress'), {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
              const serverData: {
                moduleProgress?: Array<{
                  moduleId: string;
                  completedLessons: number;
                  completed: boolean;
                  lastAccessed: string;
                }>;
                lessonProgress?: Array<{ moduleId: string; lessonId: string; completed: boolean }>;
              } = await response.json();
              const serverLessonIndices = new Map<string, number[]>();
              for (const lesson of serverData.lessonProgress || []) {
                if (!lesson.completed) continue;
                const courseModule = modules.en.find(item => item.id === lesson.moduleId);
                const lessonIndex = courseModule?.content.findIndex(item => item.id === lesson.lessonId) ?? -1;
                if (lessonIndex < 0) continue;
                const moduleIndices = serverLessonIndices.get(lesson.moduleId) || [];
                moduleIndices.push(lessonIndex);
                serverLessonIndices.set(lesson.moduleId, moduleIndices);
              }
              for (const record of serverData.moduleProgress || []) {
                const existing = progressByModule.get(record.moduleId);
                progressByModule.set(record.moduleId, {
                  ownerId,
                  moduleId: record.moduleId,
                  completedLessons: [...new Set([
                    ...(existing?.completedLessons || []),
                    ...(serverLessonIndices.get(record.moduleId) || [])
                  ])].sort((a, b) => a - b),
                  completed: Boolean(existing?.completed || record.completed),
                  lastAccessed: record.lastAccessed || existing?.lastAccessed || new Date().toISOString()
                });
              }
              await db.accountProgress.bulkPut([...progressByModule.values()]);
            }
          } catch (error) {
            console.warn('Unable to refresh account progress from the server; using local records', error);
          }
        }
        if (!active) return;
        setProgress(Object.fromEntries(progressByModule));
        setLearningTime(accountLearningTime);
        setDataOwnerId(ownerId);

        if (currentSettings) {
          setSettings(currentSettings);
        } else {
          const defaultSettings: UserSettings = {
            id: 'current',
            language: 'en',
            onboardingComplete: false,
            reducedMotion: false
          };
          await db.settings.put(defaultSettings);
          if (active) setSettings(defaultSettings);
        }

        setAchievements(allAchievements.map(achievement => achievement.id));
      } catch (error) {
        console.error('Failed to load local data', error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadData();
    window.addEventListener('climate-justice-data-changed', loadData);
    return () => {
      active = false;
      window.removeEventListener('climate-justice-data-changed', loadData);
    };
  }, [authLoading, ownerId, token]);

  const ownedProgress = dataOwnerId === ownerId ? progress : {};
  const ownedLearningTime = dataOwnerId === ownerId ? learningTime : [];

  useEffect(() => {
    if (authLoading || !ownerId) return;

    const idleTimeoutMs = 60_000;
    const flushIntervalMs = 10_000;
    let lastActivityAt = 0;
    let lastTickAt = Date.now();
    let secondsToRecord = 0;
    let isSaving = false;
    let active = true;

    const recordActivity = () => {
      if (!document.hidden) lastActivityAt = Date.now();
    };

    const saveTime = async () => {
      if (!secondsToRecord || isSaving) return;
      const seconds = secondsToRecord;
      secondsToRecord = 0;
      isSaving = true;
      const now = new Date();
      const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
      ].join('-');
      try {
        const key: [string, string] = [ownerId, date];
        const current = await db.learningTime.get(key);
        const updated: LearningTime = {
          ownerId,
          date,
          seconds: (current?.seconds || 0) + seconds
        };
        await db.learningTime.put(updated);
        if (active) {
          setLearningTime(items => [...items.filter(item => item.date !== date), updated]);
        }
      } catch (error) {
        secondsToRecord += seconds;
        console.error('Failed to save learning time', error);
      } finally {
        isSaving = false;
      }
    };

    const tick = () => {
      const now = Date.now();
      const elapsedSeconds = Math.min(10, Math.floor((now - lastTickAt) / 1000));
      lastTickAt = now;
      if (!document.hidden && lastActivityAt && now - lastActivityAt <= idleTimeoutMs) {
        secondsToRecord += elapsedSeconds;
      }
      if (secondsToRecord >= 10) void saveTime();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        lastActivityAt = 0;
        void saveTime();
      } else {
        lastTickAt = Date.now();
      }
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      'pointerdown', 'keydown', 'scroll', 'touchstart'
    ];
    activityEvents.forEach(event => window.addEventListener(event, recordActivity, { passive: true }));
    document.addEventListener('visibilitychange', onVisibilityChange);
    const interval = window.setInterval(tick, flushIntervalMs);

    return () => {
      active = false;
      window.clearInterval(interval);
      activityEvents.forEach(event => window.removeEventListener(event, recordActivity));
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void saveTime();
    };
  }, [authLoading, ownerId]);

  const updateLessonProgress = async (moduleId: string, lessonIndex: number) => {
    try {
      if (!ownerId) return;
      const current = ownedProgress[moduleId] || {
        ownerId, moduleId, completedLessons: [], completed: false, lastAccessed: new Date().toISOString()
      };
      const completedLessons = current.completedLessons.includes(lessonIndex)
        ? current.completedLessons
        : [...current.completedLessons, lessonIndex];
      const newProgress: AccountProgress = {
        ...current,
        ownerId,
        completedLessons,
        lastAccessed: new Date().toISOString()
      };

      await db.accountProgress.put(newProgress);
      setProgress(previous => ({ ...previous, [moduleId]: newProgress }));
      await SyncService.queueRecord('PROGRESS', newProgress, ownerId);
    } catch (error) {
      console.error('Failed to update lesson progress', error);
    }
  };

  const completeModule = async (moduleId: string) => {
    try {
      if (!ownerId) return;
      const current = ownedProgress[moduleId] || {
        ownerId, moduleId, completedLessons: [], completed: false, lastAccessed: new Date().toISOString()
      };
      const newProgress: AccountProgress = {
        ...current,
        ownerId,
        completed: true,
        lastAccessed: new Date().toISOString()
      };
      await db.accountProgress.put(newProgress);
      setProgress(previous => ({ ...previous, [moduleId]: newProgress }));
      await SyncService.queueRecord('PROGRESS', newProgress, ownerId);
    } catch (error) {
      console.error('Failed to complete module', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return;
    try {
      const updated = { ...settings, ...newSettings };
      await db.settings.put(updated);
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update settings', error);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (achievements.includes(achievementId)) return;
    try {
      await db.achievements.put({ id: achievementId, unlockedAt: new Date().toISOString() });
      setAchievements(previous => [...previous, achievementId]);
    } catch (error) {
      console.error('Failed to unlock achievement', error);
    }
  };

  return (
    <ProgressContext.Provider value={{
      progress: ownedProgress,
      settings,
      learningTime: ownedLearningTime,
      isLoading,
      updateLessonProgress,
      completeModule,
      updateSettings,
      unlockAchievement,
      achievements
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
