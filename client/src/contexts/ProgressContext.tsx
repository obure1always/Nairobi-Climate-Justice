import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, type LocalProgress, type UserSettings } from '../db';
import { SyncService } from '../SyncService';

interface ProgressContextType {
  progress: Record<string, LocalProgress>;
  settings: UserSettings | null;
  isLoading: boolean;
  updateLessonProgress: (moduleId: string, lessonIndex: number) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  achievements: string[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Record<string, LocalProgress>>({});
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allProgress = await db.progress.toArray();
        const progressMap = allProgress.reduce((acc, p) => ({ ...acc, [p.moduleId]: p }), {});
        setProgress(progressMap);

        const currentSettings = await db.settings.get('current');
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
          setSettings(defaultSettings);
        }

        const allAchievements = await db.achievements.toArray();
        setAchievements(allAchievements.map(a => a.id));
      } catch (error) {
        console.error("Failed to load local data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateLessonProgress = async (moduleId: string, lessonIndex: number) => {
    try {
      const current = progress[moduleId] || { moduleId, completedLessons: [], completed: false, lastAccessed: new Date().toISOString() };
      
      let newLessons = [...current.completedLessons];
      if (!newLessons.includes(lessonIndex)) {
        newLessons.push(lessonIndex);
      }

      const newProgress = {
        ...current,
        completedLessons: newLessons,
        lastAccessed: new Date().toISOString()
      };

      await db.progress.put(newProgress);
      setProgress(prev => ({ ...prev, [moduleId]: newProgress }));
      SyncService.queueRecord('PROGRESS', newProgress);
    } catch (e) {
      console.error(e);
    }
  };

  const completeModule = async (moduleId: string) => {
    try {
      const current = progress[moduleId] || { moduleId, completedLessons: [], completed: false, lastAccessed: new Date().toISOString() };
      const newProgress = { ...current, completed: true, lastAccessed: new Date().toISOString() };
      await db.progress.put(newProgress);
      setProgress(prev => ({ ...prev, [moduleId]: newProgress }));
      SyncService.queueRecord('PROGRESS', newProgress);
    } catch (e) {
      console.error(e);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return;
    try {
      const updated = { ...settings, ...newSettings };
      await db.settings.put(updated);
      setSettings(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (achievements.includes(achievementId)) return;
    try {
      await db.achievements.put({ id: achievementId, unlockedAt: new Date().toISOString() });
      setAchievements(prev => [...prev, achievementId]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      settings,
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
