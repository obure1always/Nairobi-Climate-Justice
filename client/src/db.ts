import Dexie, { type Table } from 'dexie';

export interface LocalModule {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface SyncQueueItem {
  id?: number;
  clientEventId: string;
  entityType: 'PROGRESS' | 'ASSESSMENT' | 'ACHIEVEMENT' | 'QUIZ_ATTEMPT' | 'SETTINGS';
  entityData: any;
  status: 'pending' | 'syncing' | 'failed';
  createdAt: string;
}

export interface LocalProgress {
  moduleId: string;
  completedLessons: number[]; // Array of completed lesson indices
  completed: boolean;
  lastAccessed: string;
}

export interface QuizAttempt {
  id?: number;
  moduleId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface Achievement {
  id: string;
  unlockedAt: string;
}

export interface UserSettings {
  id: string; // usually 'current'
  language: 'en' | 'sw';
  onboardingComplete: boolean;
  reducedMotion: boolean;
}

export class ClimateJusticeDB extends Dexie {
  modules!: Table<LocalModule>;
  syncQueue!: Table<SyncQueueItem>;
  progress!: Table<LocalProgress>;
  quizAttempts!: Table<QuizAttempt>;
  achievements!: Table<Achievement>;
  settings!: Table<UserSettings>;

  constructor() {
    super('ClimateJusticeDB');
    this.version(2).stores({
      modules: 'id, order',
      syncQueue: '++id, clientEventId, status',
      progress: 'moduleId',
      quizAttempts: '++id, moduleId',
      achievements: 'id',
      settings: 'id'
    });
  }
}

export const db = new ClimateJusticeDB();
