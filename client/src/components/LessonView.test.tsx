import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import LessonView from './LessonView';

vi.mock('../LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('../contexts/AuthContext', () => {
  const user = { id: 'learner', name: 'Test Learner' };
  return { useAuth: () => ({ user }) };
});
vi.mock('../contexts/ProgressContext', () => ({ useProgress: vi.fn() }));

const courseModule = modules.en.find(module => module.id === 'm6')!;

function openModule(completedLessons: number[]) {
  vi.mocked(useProgress).mockReturnValue({
    progress: {
      [courseModule.id]: {
        moduleId: courseModule.id,
        ownerId: 'learner',
        completed: false,
        completedLessons,
        lastAccessed: '2026-01-01'
      }
    },
    settings: null,
    learningTime: [],
    isLoading: false,
    updateLessonProgress: async (_moduleId, lessonIndex) => {
      if (!completedLessons.includes(lessonIndex)) completedLessons.push(lessonIndex);
    },
    completeModule: vi.fn(),
    updateSettings: vi.fn(),
    unlockAchievement: vi.fn(),
    achievements: []
  });

  return render(
    <MemoryRouter initialEntries={['/module/' + courseModule.id]}>
      <Routes>
        <Route path="/module/:moduleId" element={<LessonView />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Module quizzes and lesson text', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ questions: [] }) }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('opens the existing quiz directly from the module overview after all lessons are saved', async () => {
    openModule(courseModule.content.map((_, index) => index));

    fireEvent.click(screen.getByRole('button', { name: 'Module Quiz' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Start Quiz' }));
    expect(await screen.findByText(courseModule.quiz[0].question)).toBeTruthy();
  });

  it('shows the quiz before it unlocks and resumes the first incomplete lesson with bold terms', async () => {
    const { container } = openModule([0, 1, 2]);

    fireEvent.click(screen.getByRole('button', { name: 'Module Quiz' }));
    expect(await screen.findByText('Complete all lessons in this module to start the quiz.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Start Quiz' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Continue Lessons' }));
    expect(await screen.findByRole('heading', { level: 1, name: courseModule.content[3].heading })).toBeTruthy();
    const emphasized = Array.from(container.querySelectorAll('strong'));
    expect(emphasized.some(term => term.textContent === 'Life-Cycle Assessment (LCA)')).toBe(true);
    expect(container.textContent).not.toContain('**Life-Cycle Assessment (LCA)**');
  });

  it('opens the quiz after the final lesson is marked complete', async () => {
    openModule(courseModule.content.slice(0, -1).map((_, index) => index));

    fireEvent.click(screen.getByRole('button', { name: 'Continue Learning' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Take Module Quiz' }));
    expect(await screen.findByRole('button', { name: 'Start Quiz' })).toBeTruthy();
  });
});
