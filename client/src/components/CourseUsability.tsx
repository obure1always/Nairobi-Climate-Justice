import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { assessments } from '../data/assessments';
import { apiUrl } from '../lib/api';

type SurveyStatus = 'loading' | 'locked' | 'available' | 'submitted' | 'error';
const ratings = [1, 2, 3, 4, 5];
const surveyEndpoint = '/assessments/sus';
const feedbackLinkClass = 'inline-flex items-center justify-center rounded-full border border-forest-green/30 px-5 py-2.5 font-semibold text-forest-green hover:bg-forest-green/5 focus-visible:ring-2 focus-visible:ring-forest-green';

function useSurveyStatus(token: string | null) {
  const [result, setResult] = useState<{ token: string; status: SurveyStatus } | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const refresh = useCallback(() => setRequestVersion(version => version + 1), []);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetch(apiUrl(surveyEndpoint), {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: controller.signal
    }).then(async response => {
      if (!response.ok) throw new Error('Could not check survey availability');
      const { status } = await response.json();
      if (status !== 'locked' && status !== 'available' && status !== 'submitted') {
        throw new Error('Unexpected survey status');
      }
      if (!controller.signal.aborted) setResult({ token, status });
    }).catch(() => {
      if (!controller.signal.aborted) setResult({ token, status: 'error' });
    });
    return () => controller.abort();
  }, [token, requestVersion]);

  useEffect(() => {
    if (!token) return;
    window.addEventListener('online', refresh);
    window.addEventListener('climate-justice-data-changed', refresh);
    return () => {
      window.removeEventListener('online', refresh);
      window.removeEventListener('climate-justice-data-changed', refresh);
    };
  }, [token, refresh]);

  const status = !token ? 'locked' : result?.token === token ? result.status : 'loading';
  return { status, refresh };
}

export function CourseUsabilityInvite({ className = '' }: { className?: string }) {
  const { token } = useAuth();
  const { language } = useLanguage();
  const { status } = useSurveyStatus(token);
  if (status !== 'available') return null;
  return (
    <Link to="/assessment?type=sus" className={`${feedbackLinkClass} ${className}`}>
      {language === 'sw' ? 'Toa maoni (hiari)' : 'Share feedback (optional)'}
    </Link>
  );
}

export function CourseUsabilitySurvey() {
  const { user, token } = useAuth();
  return <UsabilityForm key={user?.id} token={token} />;
}

function UsabilityForm({ token }: { token: string | null }) {
  const { language } = useLanguage();
  const { status, refresh } = useSurveyStatus(token);
  const isSwahili = language === 'sw';
  const questions = assessments[language].sus.questions;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const allRated = questions.every(question => answers[question.id] !== undefined);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !allRated || saving || saved || status !== 'available') return;
    setSaving(true);
    setSaveFailed(false);
    try {
      const response = await fetch(apiUrl(surveyEndpoint), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, answers: questions.map(question => answers[question.id]), comment })
      });
      if (!response.ok || (await response.json()).status !== 'submitted') {
        throw new Error('The survey response was not accepted');
      }
      setSaved(true);
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const messages = isSwahili ? {
    loading: 'Inakagua maendeleo yako ya kozi…',
    locked: 'Kamilisha masomo na ufaulu majaribio yanayohitajika ili kutoa maoni.',
    submitted: 'Asante kwa kutoa maoni yako.',
    error: 'Hatukuweza kukagua maendeleo yako. Unganisha intaneti kisha ujaribu tena.'
  } : {
    loading: 'Checking your course progress…',
    locked: 'Complete the required lessons and pass the module quizzes to share feedback.',
    submitted: 'Thank you for sharing your feedback.',
    error: 'We could not check your progress. Connect to the internet and try again.'
  };
  const pageStatus = saved ? 'submitted' : status;
  const dashboardLabel = isSwahili ? 'Rudi kwenye dashibodi' : 'Back to dashboard';

  return (
    <section aria-labelledby="sus-title" className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <h1 id="sus-title" className="text-2xl font-bold text-gray-900">
          {isSwahili ? 'Maoni kuhusu kozi' : 'Course feedback'}
        </h1>
        {pageStatus !== 'available' ? (
          <>
            <p role={pageStatus === 'error' ? 'alert' : 'status'} className="mt-3 text-gray-700">
              {messages[pageStatus]}
            </p>
            {pageStatus === 'error' && (
              <button type="button" onClick={refresh} className={`${feedbackLinkClass} mt-4`}>
                {isSwahili ? 'Jaribu tena' : 'Try again'}
              </button>
            )}
            <Link to="/dashboard" className="mt-4 block font-semibold text-forest-green underline">{dashboardLabel}</Link>
          </>
        ) : (
          <form onSubmit={submit} className="mt-3 space-y-5">
            <p className="text-gray-700">
              {isSwahili
                ? 'Kutoa maoni ni hiari. Ukiwasilisha, unakubali majibu yako yaliyo na msimbo yatumike kutathmini jukwaa hili.'
                : 'This survey is optional. By submitting, you agree that your coded responses can be used to evaluate the platform.'}
            </p>
            <p className="text-sm text-gray-700">
              {isSwahili ? '1 = Sikubaliani kabisa, 5 = Nakubaliana kabisa.' : '1 = Strongly disagree, 5 = Strongly agree.'}
            </p>
            {questions.map(question => (
              <fieldset key={question.id} disabled={saving} className="border-t border-gray-100 pt-3">
                <legend className="pt-3 font-medium text-gray-900">{question.text}</legend>
                <div className="mt-2 grid grid-cols-5 gap-2 sm:max-w-xs">
                  {ratings.map(rating => (
                    <label key={rating} className="cursor-pointer text-center">
                      <input
                        className="peer sr-only"
                        type="radio"
                        name={question.id}
                        value={rating}
                        checked={answers[question.id] === rating}
                        onChange={() => setAnswers(previous => ({ ...previous, [question.id]: rating }))}
                        required
                      />
                      <span className="flex min-h-11 items-center justify-center rounded-lg border border-gray-300 font-semibold text-gray-800 peer-checked:border-forest-green peer-checked:bg-forest-green peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-forest-green peer-focus-visible:ring-offset-2">
                        {rating}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <div>
              <label htmlFor="sus-comment" className="block font-medium text-gray-900">
                {isSwahili ? 'Ni nini kilichokuwa kigumu zaidi kufanya kwenye jukwaa? (Hiari)' : 'What was the hardest thing to do on the platform? (Optional)'}
              </label>
              <p id="sus-comment-hint" className="mt-1 text-sm text-gray-600">
                {isSwahili ? 'Andika maoni bila majina au taarifa za mawasiliano.' : 'Leave out names and contact information.'}
              </p>
              <textarea
                id="sus-comment"
                aria-describedby="sus-comment-hint"
                value={comment}
                onChange={event => setComment(event.target.value)}
                disabled={saving}
                maxLength={1000}
                rows={3}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:border-forest-green focus:outline-none focus:ring-1 focus:ring-forest-green"
              />
            </div>
            {saveFailed && (
              <p role="alert" className="text-sm text-red-700">
                {isSwahili
                  ? 'Maoni hayakuhifadhiwa. Majibu bado yapo hapa. Angalia muunganisho wako kisha ujaribu tena.'
                  : 'Your feedback could not be saved. Your answers are still here. Check your connection and try again.'}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={!allRated || saving} className="rounded-full bg-forest-green px-5 py-2.5 font-semibold text-white focus-visible:ring-2 focus-visible:ring-forest-green disabled:opacity-50">
                {saving ? (isSwahili ? 'Inahifadhi…' : 'Saving…') : (isSwahili ? 'Wasilisha maoni' : 'Submit feedback')}
              </button>
              <Link to="/dashboard" className="font-semibold text-forest-green underline">
                {isSwahili ? 'Ruka kwa sasa' : 'Skip for now'}
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
