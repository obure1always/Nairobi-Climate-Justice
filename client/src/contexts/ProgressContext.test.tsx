import { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ProgressProvider, useProgress } from './ProgressContext';

vi.mock('./AuthContext', () => ({
  useAuth: () => ({ ownerId: 'learner', token: 'test-token', isLoading: false })
}));
vi.mock('../db', () => {
  const emptyOwnedRecords = {
    where: () => ({ equals: () => ({ toArray: async () => [] }) })
  };
  return {
    db: {
      accountProgress: { ...emptyOwnedRecords, bulkPut: async () => {} },
      learningTime: emptyOwnedRecords,
      settings: { get: async () => ({ id: 'current', onboardingComplete: true }) },
      achievements: { toArray: async () => [] }
    }
  };
});

function QuizPage() {
  const [finished, setFinished] = useState(false);
  return finished
    ? <h2>Quiz Results</h2>
    : <button onClick={() => setFinished(true)}>See Results</button>;
}

function LearnerRoute() {
  const { isLoading, progress } = useProgress();
  if (isLoading) return <p>Loading progress</p>;
  return (
    <>
      <QuizPage />
      {progress.m1?.completed && <p>Module completed</p>}
    </>
  );
}

afterEach(() => vi.unstubAllGlobals());

it('keeps the learner route mounted while refreshing saved progress', async () => {
  let respond!: (response: Response) => void;
  const refresh = new Promise<Response>(resolve => { respond = resolve; });
  const fetchProgress = vi.fn()
    .mockResolvedValueOnce(Response.json({ moduleProgress: [] }))
    .mockReturnValueOnce(refresh);
  vi.stubGlobal('fetch', fetchProgress);

  render(<ProgressProvider><LearnerRoute /></ProgressProvider>);
  fireEvent.click(await screen.findByRole('button', { name: 'See Results' }));
  expect(screen.getByRole('heading', { name: 'Quiz Results' })).toBeTruthy();

  act(() => { window.dispatchEvent(new Event('climate-justice-data-changed')); });
  await waitFor(() => expect(fetchProgress).toHaveBeenCalledTimes(2));
  expect(screen.getByRole('heading', { name: 'Quiz Results' })).toBeTruthy();

  await act(async () => {
    respond(Response.json({
      moduleProgress: [{ moduleId: 'm1', completedLessons: 6, completed: true }]
    }));
  });
  expect(screen.getByText('Module completed')).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Quiz Results' })).toBeTruthy();
});
