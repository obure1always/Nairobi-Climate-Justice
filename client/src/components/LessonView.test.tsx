import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { SyncService } from '../SyncService';
import LessonView from './LessonView';

vi.mock('../LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('../contexts/AuthContext', () => {
  const user = { id: 'learner', name: 'Test Learner' };
  return { useAuth: () => ({ user }) };
});
vi.mock('../contexts/ProgressContext', () => ({ useProgress: vi.fn() }));
vi.mock('../SyncService', () => ({
  SyncService: { queueRecord: vi.fn(), syncNow: vi.fn() }
}));

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
    completeModule: vi.fn().mockResolvedValue(undefined),
    updateSettings: vi.fn(),
    unlockAchievement: vi.fn().mockResolvedValue(undefined),
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

async function finishQuiz() {
  openModule(courseModule.content.map((_, index) => index));
  fireEvent.click(screen.getByRole('button', { name: 'Module Quiz' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Start Quiz' }));
  for (const question of courseModule.quiz) {
    await screen.findByRole('heading', { name: question.question });
    fireEvent.click(screen.getByRole('button', { name: question.options[question.correctAnswer] }));
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    const isLastQuestion = question === courseModule.quiz.at(-1);
    fireEvent.click(screen.getByRole('button', { name: isLastQuestion ? 'See Results' : 'Next Question' }));
  }
}

describe('Module quizzes and lesson text', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ questions: [] }) }));
  });

  afterEach(() => {
    localStorage.clear();
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

  it('shows the score during submission and displays the server-confirmed result when it arrives', async () => {
    localStorage.setItem('climate_justice_user_id', 'learner');
    localStorage.setItem('climate_justice_token', 'test-token');
    let respond!: (response: Response) => void;
    const submission = new Promise<Response>(resolve => { respond = resolve; });
    vi.mocked(fetch).mockImplementation(async input => String(input).endsWith('/assessments/submit')
      ? submission
      : Response.json([]));

    await finishQuiz();
    const heading = await screen.findByRole('heading', { name: 'Quiz Results' });
    expect(document.activeElement).toBe(heading);
    expect(screen.getByText('100%', { exact: true })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Saving your attempt…');
    expect(useProgress().completeModule).not.toHaveBeenCalled();

    await act(async () => {
      respond(Response.json({ score: 6, totalQuestions: 8, passed: true }));
    });
    expect(screen.getByRole('status').textContent).toBe('You passed the quiz.');
    expect(screen.getByText('75%', { exact: true })).toBeTruthy();
    expect(useProgress().completeModule).toHaveBeenCalledWith(courseModule.id);
  });

  it('keeps the result visible after a failed save, retries the same attempt, and confirms it after sync', async () => {
    localStorage.setItem('climate_justice_user_id', 'learner');
    localStorage.setItem('climate_justice_token', 'test-token');
    const requests: Array<{ clientEventId: string; answers: Record<string, number> }> = [];
    let savedAttempts: object[] = [];
    vi.mocked(fetch).mockImplementation(async (input, options) => {
      if (String(input).endsWith('/assessments/submit')) {
        requests.push(JSON.parse(String(options?.body)));
        return new Response(null, { status: requests.length === 1 ? 400 : 503 });
      }
      return Response.json(savedAttempts);
    });
    vi.mocked(SyncService.queueRecord).mockResolvedValue(undefined);

    await finishQuiz();
    expect((await screen.findByRole('alert')).textContent).toContain('could not be saved');
    expect(screen.getByText('100%', { exact: true })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Retry Save' }));
    await screen.findByText('Your attempt is saved on this device and awaiting server verification.');
    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual(requests[0]);
    const { clientEventId, answers } = requests[0];
    expect(SyncService.queueRecord).toHaveBeenCalledWith(
      'QUIZ_ATTEMPT', { moduleId: courseModule.id, answers }, 'learner', clientEventId
    );
    expect(useProgress().completeModule).not.toHaveBeenCalled();

    savedAttempts = [{
      id: 'saved-attempt',
      moduleId: courseModule.id,
      clientEventId,
      score: 5,
      totalQuestions: 8,
      passed: false,
      createdAt: '2026-11-11T08:00:00Z'
    }];
    act(() => {
      window.dispatchEvent(new CustomEvent('climate-justice-sync-complete', {
        detail: { clientEventIds: [clientEventId] }
      }));
    });
    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('You did not pass. You can retake the quiz.');
    });
    expect(screen.getByText('63%', { exact: true })).toBeTruthy();
    expect(useProgress().completeModule).not.toHaveBeenCalled();
  });
});
