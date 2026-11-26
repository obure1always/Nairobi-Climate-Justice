import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../LanguageContext';
import { apiUrl } from '../lib/api';
import {
  CONFIDENCE_ITEMS, CONFIDENCE_LABELS, INTENTION_LABELS, INTENTION_TEXT,
  KNOWLEDGE_QUESTIONS, OUTCOMES_VERSION,
  type OutcomeLanguage, type OutcomePhase, type OutcomeStatus, type OutcomeSubmission
} from '../../../shared/learningOutcomes';

const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-4 py-2 font-semibold focus-visible:ring-2 focus-visible:ring-forest-green disabled:opacity-50';
const primaryClass = `${buttonClass} border-forest-green bg-forest-green text-white`;
const statusPath = '/learning-outcomes/status';

function useOutcomeStatus(token: string | null) {
  const [result, setResult] = useState<{ token: string; data: OutcomeStatus | null; error: boolean } | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetch(apiUrl(statusPath), { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Could not check the survey');
        const data = await response.json() as OutcomeStatus;
        if (data.instrumentVersion !== OUTCOMES_VERSION || !['baseline_available', 'baseline_saved', 'learning_in_progress', 'endline_available', 'submitted'].includes(data.status)) throw new Error('Unexpected survey status');
        if (!controller.signal.aborted) setResult({ token, data, error: false });
      }).catch(() => { if (!controller.signal.aborted) setResult({ token, data: null, error: true }); });
    return () => controller.abort();
  }, [token, version]);
  useEffect(() => {
    window.addEventListener('online', refresh);
    window.addEventListener('climate-justice-data-changed', refresh);
    return () => {
      window.removeEventListener('online', refresh);
      window.removeEventListener('climate-justice-data-changed', refresh);
    };
  }, [refresh]);
  return {
    data: token && result?.token === token ? result.data : null,
    error: Boolean(token && result?.token === token && result.error), refresh,
    accept: (data: OutcomeStatus) => { if (token) setResult({ token, data, error: false }); }
  };
}

export function LearningOutcomesInvite() {
  const { user, token } = useAuth();
  const { language } = useLanguage();
  const { data } = useOutcomeStatus(user?.role === 'learner' ? token : null);
  if (user?.role !== 'learner') return null;
  const sw = language === 'sw';
  const description = data?.status === 'baseline_available'
    ? (sw ? 'Jibu kabla ya kuanza kozi ili tuweze kulinganisha maarifa na ujasiri wako baadaye.' : 'Answer before starting the course so we can compare your knowledge and confidence afterwards.')
    : data?.status === 'endline_available'
      ? (sw ? 'Umemaliza kozi. Tuambie unachojua sasa na ujasiri wako wa kuchukua hatua.' : 'You have finished the course. Share what you know now and how confident you feel to act.')
      : data?.status === 'submitted'
        ? (sw ? 'Asante. Unaweza kuona majibu yako na matokeo ya utafiti wako hapa.' : 'Thank you. Your survey results are available here.')
        : (sw ? 'Utafiti wa hiari wa maarifa na ujasiri. Sehemu ya baada ya kozi itafunguka ukimaliza.' : 'An optional knowledge and confidence survey. The after-course form opens when you finish.');
  return (
    <section aria-labelledby="outcomes-invite" className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="max-w-xl">
        <h2 id="outcomes-invite" className="text-lg font-bold text-gray-900">{sw ? 'Utafiti wa mafunzo' : 'Learning survey'}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-700">{description}</p>
      </div>
      <Link to="/learning-survey" className={primaryClass}>{sw ? 'Fungua utafiti' : 'Open learning survey'}</Link>
    </section>
  );
}

type Draft = {
  clientSubmissionId: string;
  knowledge: Record<string, number>;
  confidence: Array<number | null>;
  intention: number | null;
  consent: boolean;
  notStarted: boolean;
  recallEnabled: boolean;
  recalledConfidence: Array<number | null>;
  recalledIntention: number | null;
  comment: string;
};
const draftKey = (userId: string, phase: OutcomePhase) => `ncj-outcomes:${OUTCOMES_VERSION}:${userId}:${phase}`;
function readDraft(key: string): Draft {
  const fresh: Draft = { clientSubmissionId: crypto.randomUUID(), knowledge: {}, confidence: [null, null, null, null], intention: null,
    consent: false, notStarted: false, recallEnabled: false, recalledConfidence: [null, null, null, null], recalledIntention: null, comment: '' };
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (value && typeof value === 'object' && typeof value.clientSubmissionId === 'string' &&
        value.knowledge && typeof value.knowledge === 'object' && Array.isArray(value.confidence) && value.confidence.length === 4 &&
        Array.isArray(value.recalledConfidence) && value.recalledConfidence.length === 4 && typeof value.comment === 'string') {
      return { ...fresh, ...value };
    }
  } catch { /* A full or disabled browser store does not stop the form. */ }
  return fresh;
}
function clearDrafts(userId: string) {
  try { localStorage.removeItem(draftKey(userId, 'baseline')); localStorage.removeItem(draftKey(userId, 'endline')); } catch { /* No local draft available. */ }
}

export default function LearningOutcomesSurvey() {
  const { user, token } = useAuth();
  const { progress } = useProgress();
  const { language } = useLanguage();
  const sw = language === 'sw';
  const { data, error, refresh, accept } = useOutcomeStatus(user?.role === 'learner' ? token : null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(false);
  // Unsynchronised work also prevents the interface from claiming a true before-course baseline.
  const localActivity = Object.values(progress).some(row => row.ownerId === user?.id && row.completedLessons.length > 0);
  const canStart = data?.status === 'baseline_available' && !localActivity;
  const canFinish = data?.status === 'endline_available';
  const withdraw = async () => {
    if (!token || !user || !window.confirm(sw ? 'Unataka kufuta majibu yako ya utafiti? Hii haitaathiri kozi au cheti chako.' : 'Withdraw your survey responses? Your course progress and certificate will not be affected.')) return;
    setWithdrawing(true); setWithdrawError(false);
    try {
      const response = await fetch(apiUrl('/learning-outcomes/responses'), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok || !(await response.json()).withdrawn) throw new Error('Could not withdraw');
      clearDrafts(user.id); refresh();
    } catch { setWithdrawError(true); }
    finally { setWithdrawing(false); }
  };
  return (
    <section lang={language} aria-labelledby="learning-survey-title" className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 id="learning-survey-title" className="text-3xl font-bold text-gray-900">{sw ? 'Utafiti wa mafunzo' : 'Learning survey'}</h1>
      <p className="mt-2 leading-relaxed text-gray-700">{sw ? 'Maswali mafupi kuhusu maarifa ya tabianchi, haki na ujasiri wa kuchukua hatua.' : 'Short questions about climate knowledge, fairness and confidence to act.'}</p>
      {user?.role !== 'learner' ? <p className="mt-6">{sw ? 'Utafiti huu ni wa akaunti za wanafunzi.' : 'This survey is for learner accounts.'}</p>
        : error ? <div role="alert" className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <p>{sw ? 'Hatukuweza kuangalia hali ya utafiti. Unganisha mtandao na ujaribu tena.' : 'We could not check your survey status. Connect to the internet and try again.'}</p>
          <button onClick={refresh} className={`${buttonClass} mt-3`}>{sw ? 'Jaribu tena' : 'Try again'}</button>
        </div> : !data ? <p role="status" className="mt-6">{sw ? 'Inakagua utafiti…' : 'Checking your survey…'}</p>
          : (canStart || canFinish) && user && token ? <OutcomeForm
            key={`${user.id}:${canStart ? 'baseline' : 'endline'}`} userId={user.id} token={token} language={language}
            phase={canStart ? 'baseline' : 'endline'} hasBaseline={data.hasBaseline}
            onSaved={saved => { accept(saved); window.dispatchEvent(new Event('climate-justice-data-changed')); }}
          /> : <div role="status" className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-xl font-bold">{data.status === 'submitted' ? (sw ? 'Asante kwa kujibu' : 'Thank you for responding') : (sw ? 'Endelea kujifunza' : 'Continue learning')}</h2>
            <p>{data.status === 'submitted'
              ? (sw ? 'Majibu yako yamehifadhiwa kwenye seva.' : 'Your responses are saved on the server.')
              : data.hasBaseline
                ? (sw ? 'Majibu yako ya kabla ya kozi yamehifadhiwa. Rudi ukimaliza masomo na majaribio.' : 'Your before-course response is saved. Return after completing the required lessons and quizzes.')
                : (sw ? 'Kwa kuwa tayari umeanza, hatutaweka majibu mapya kama ya kabla ya kozi. Utafiti wa baada ya kozi utafunguka ukimaliza.' : 'You have already started learning, so a new response will not be labelled as before-course. The after-course survey opens when you finish.')}</p>
            {data.endline && <div className="grid gap-3 sm:grid-cols-2">
              <p><strong>{sw ? 'Maarifa sasa' : 'Knowledge now'}:</strong> {data.endline.knowledgePercent.toFixed(1)}% ({data.endline.knowledgeCorrect}/8)</p>
              <p><strong>{sw ? 'Ujasiri sasa' : 'Confidence now'}:</strong> {data.endline.confidenceMean.toFixed(2)}/5</p>
              {data.baseline && <>
                <p><strong>{sw ? 'Mabadiliko ya maarifa' : 'Knowledge change'}:</strong> {(data.endline.knowledgePercent - data.baseline.knowledgePercent).toFixed(1)} {sw ? 'pointi za asilimia' : 'percentage points'}</p>
                <p><strong>{sw ? 'Mabadiliko ya ujasiri' : 'Confidence change'}:</strong> {(data.endline.confidenceMean - data.baseline.confidenceMean).toFixed(2)} {sw ? 'pointi' : 'points'}</p>
              </>}
            </div>}
            <Link to="/learn" className={primaryClass}>{sw ? 'Fungua masomo' : 'Go to the course'}</Link>
          </div>}
      {data && (data.hasBaseline || data.endline) && <div className="mt-6 text-sm text-gray-600">
        <button onClick={withdraw} disabled={withdrawing} className="min-h-11 font-semibold underline">{sw ? 'Ondoa majibu yangu ya utafiti' : 'Withdraw my survey responses'}</button>
        <p>{sw ? 'Nakala zilizopakuliwa awali zinaweza kubaki; wasiliana nasi kuhusu nakala hizo.' : 'Previously downloaded copies may remain; contact us about those copies.'}</p>
        {withdrawError && <p role="alert">{sw ? 'Majibu hayajafutwa. Jaribu tena.' : 'Your responses were not withdrawn. Please try again.'}</p>}
      </div>}
      <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold text-forest-green underline">
        <Link to="/dashboard">{sw ? 'Rudi kwenye dashibodi' : 'Back to dashboard'}</Link>
        <Link to="/privacy">{sw ? 'Sera ya faragha' : 'Privacy policy'}</Link>
        <Link to="/help">{sw ? 'Wasiliana nasi' : 'Contact us'}</Link>
      </div>
    </section>
  );
}

function RatingQuestion({ id, text, labels, value, onChange }: { id: string; text: string; labels: string[]; value: number | null; onChange: (value: number) => void }) {
  return <fieldset className="space-y-3 border-t border-gray-200 pt-4">
    <legend className="pt-3 font-semibold leading-relaxed text-gray-900">{text}</legend>
    <div className="grid gap-2 sm:grid-cols-5">
      {labels.map((label, index) => <label key={label} className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 p-3 text-sm has-[:checked]:border-forest-green has-[:checked]:bg-forest-green/5">
        <input className="h-4 w-4 shrink-0 accent-green-700" type="radio" name={id} value={index + 1} checked={value === index + 1} onChange={() => onChange(index + 1)} />
        <span><strong>{index + 1}.</strong> {label}</span>
      </label>)}
    </div>
  </fieldset>;
}

function OutcomeForm({ userId, token, language, phase, hasBaseline, onSaved }: {
  userId: string; token: string; language: OutcomeLanguage; phase: OutcomePhase; hasBaseline: boolean; onSaved: (status: OutcomeStatus) => void;
}) {
  const sw = language === 'sw';
  const key = draftKey(userId, phase);
  const [draft, setDraft] = useState<Draft>(() => readDraft(key));
  const [step, setStep] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const patch = (values: Partial<Draft>) => {
    const next = { ...draft, ...values };
    setDraft(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  };
  useEffect(() => { heading.current?.focus(); }, [step]);
  const title = phase === 'baseline' ? (sw ? 'Kabla ya kozi' : 'Before the course') : (sw ? 'Baada ya kozi' : 'After the course');
  const knowledgePage = step < 2 ? KNOWLEDGE_QUESTIONS.slice(step * 4, step * 4 + 4) : [];
  const confidenceDone = draft.confidence.every(value => value !== null);
  const recallDone = !draft.recallEnabled || (draft.recalledConfidence.every(value => value !== null) && draft.recalledIntention !== null);
  const pageComplete = step < 2 ? knowledgePage.every(question => draft.knowledge[question.id] !== undefined)
    : step === 2 ? confidenceDone : draft.intention !== null && recallDone;
  const submit = async () => {
    if (saving || !draft.consent || !pageComplete || (phase === 'baseline' && !draft.notStarted) ||
        !KNOWLEDGE_QUESTIONS.every(item => draft.knowledge[item.id] !== undefined) || !confidenceDone) return;
    setSaving(true); setError(false);
    const payload: OutcomeSubmission = {
      instrumentVersion: OUTCOMES_VERSION, clientSubmissionId: draft.clientSubmissionId, phase, language, consent: true,
      knowledge: draft.knowledge, confidence: draft.confidence as number[], intention: draft.intention!,
      ...(phase === 'baseline' ? { notStarted: true as const } : { comment: draft.comment }),
      ...(phase === 'endline' && !hasBaseline && draft.recallEnabled
        ? { recalledConfidence: draft.recalledConfidence as number[], recalledIntention: draft.recalledIntention! } : {})
    };
    try {
      const response = await fetch(apiUrl('/learning-outcomes/responses'), {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || data.saved !== true || data.instrumentVersion !== OUTCOMES_VERSION) throw new Error('Response was not saved');
      try { localStorage.removeItem(key); } catch { /* The server acknowledgement remains authoritative. */ }
      onSaved(data as OutcomeStatus);
    } catch { setError(true); }
    finally { setSaving(false); }
  };
  return <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
    <p className="text-sm font-semibold text-forest-green">{title} · {sw ? 'Maswali 13 mafupi' : '13 short questions'}</p>
    {step === -1 ? <div className="mt-4 space-y-5">
      <h2 className="text-xl font-bold">{sw ? 'Kushiriki ni hiari' : 'Taking part is optional'}</h2>
      <p className="leading-relaxed text-gray-700">{sw
        ? 'Tutalinganisha maarifa na ujasiri kabla na baada ya kozi. Kukataa au kujibu vibaya hakutaathiri masomo, alama za majaribio au cheti chako. Chagua “Sijui” ikiwa hujui jibu. Huu si mtihani wa kufaulu.'
        : 'We compare knowledge and confidence before and after the course. Skipping the survey or answering incorrectly will not affect your lessons, quiz grades or certificate. Choose “I do not know” when unsure. This is not a pass-or-fail exam.'}</p>
      {phase === 'endline' && !hasBaseline && <p className="rounded-lg border border-gray-200 p-3 text-sm">{sw
        ? 'Hatuna majibu yako yaliyopimwa kabla ya kozi. Tutahifadhi maarifa yako ya sasa. Ukichagua kukumbuka ujasiri wako wa zamani, tutauonyesha tofauti kama kumbukumbu, si kipimo cha kabla ya kozi.'
        : 'You do not have a measured before-course response. We will record your current knowledge. Optional ratings remembered from before the course are reported separately, not as a measured baseline.'}</p>}
      <p className="text-sm leading-relaxed text-gray-700">{sw
        ? 'Majibu yanaunganishwa na akaunti yako ili kulinganisha nyakati mbili. Wasimamizi walioidhinishwa wanaweza kuyakagua na kupakua majibu yenye misimbo kwa tathmini ya elimu. Usiongeze majina au mawasiliano. Rasimu huhifadhiwa kwenye kivinjari cha kifaa hiki chini ya akaunti yako; toka kwenye akaunti ukitumia kifaa cha pamoja. Unaweza kuondoa majibu yako baadaye.'
        : 'Responses are linked to your account to match the two time points. Authorised administrators can review and export coded responses for educational evaluation. Do not add names or contact details. A draft is kept in this browser under your account; sign out on shared devices. You can withdraw your responses later.'}</p>
      <label className="flex items-start gap-3"><input className="mt-1 h-5 w-5 shrink-0" type="checkbox" checked={draft.consent} onChange={event => patch({ consent: event.target.checked })} />
        <span>{sw ? 'Nimesoma maelezo na ninakubali kushiriki kwa hiari.' : 'I have read this information and freely agree to take part.'}</span>
      </label>
      {phase === 'baseline' && <label className="flex items-start gap-3"><input className="mt-1 h-5 w-5 shrink-0" type="checkbox" checked={draft.notStarted} onChange={event => patch({ notStarted: event.target.checked })} />
        <span>{sw ? 'Sijaanza kusoma masomo au kufanya majaribio ya kozi hii.' : 'I have not started studying lessons or taking quizzes in this course.'}</span>
      </label>}
      <div className="flex flex-wrap gap-4"><button onClick={() => setStep(0)} disabled={!draft.consent || (phase === 'baseline' && !draft.notStarted)} className={primaryClass}>{sw ? 'Anza utafiti' : 'Start survey'}</button>
        <Link to="/learn" className={buttonClass}>{sw ? 'Ruka kwa sasa' : 'Skip for now'}</Link></div>
    </div> : <>
      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-gray-600"><span>{sw ? 'Sehemu' : 'Section'} {step + 1}/4</span><span>{sw ? 'Rasimu ya akaunti yako' : 'Draft for your account'}</span></div>
      <progress className="mt-2 h-2 w-full accent-green-700" max={4} value={step + 1} aria-label={sw ? 'Maendeleo ya utafiti' : 'Survey progress'} />
      <h2 ref={heading} tabIndex={-1} className="mt-5 text-xl font-bold outline-none">{step < 2 ? (sw ? 'Unajua nini sasa?' : 'What do you know now?') : step === 2 ? (sw ? 'Una ujasiri kiasi gani sasa?' : 'How confident are you now?') : (sw ? 'Kuchukua hatua' : 'Taking action')}</h2>
      <fieldset disabled={saving} className="mt-4 space-y-6">
        {step < 2 && knowledgePage.map(question => <fieldset key={question.id} className="space-y-2 border-t border-gray-200 pt-3">
          <legend className="pt-3 font-semibold leading-relaxed">{question.text[language]}</legend>
          {question.options[language].map((option, index) => <label key={index} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-3 leading-relaxed has-[:checked]:border-forest-green has-[:checked]:bg-forest-green/5">
            <input className="mt-1 h-4 w-4 shrink-0 accent-green-700" type="radio" name={question.id} checked={draft.knowledge[question.id] === index}
              onChange={() => patch({ knowledge: { ...draft.knowledge, [question.id]: index } })} /><span>{option}</span>
          </label>)}
        </fieldset>)}
        {step === 2 && CONFIDENCE_ITEMS.map((item, index) => <RatingQuestion key={item.id} id={item.id} text={item[language]} labels={CONFIDENCE_LABELS[language]}
          value={draft.confidence[index]!} onChange={value => patch({ confidence: draft.confidence.map((old, at) => at === index ? value : old) })} />)}
        {step === 3 && <>
          <RatingQuestion id="intention" text={INTENTION_TEXT[language]} labels={INTENTION_LABELS[language]} value={draft.intention} onChange={value => patch({ intention: value })} />
          {phase === 'endline' && !hasBaseline && <div className="rounded-xl border border-gray-200 p-4">
            <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={draft.recallEnabled} onChange={event => patch({ recallEnabled: event.target.checked })} />
              <span>{sw ? 'Hiari: Ningependa pia kukadiria ujasiri na nia niliyokuwa nayo kabla ya kozi, kutoka kwenye kumbukumbu.' : 'Optional: I would also like to rate my confidence and intention before the course, from memory.'}</span>
            </label>
            {draft.recallEnabled && <div className="mt-4 space-y-5">
              <p className="font-semibold">{sw ? 'Ukikumbuka kabla ya kozi, ungejikadiriaje?' : 'Thinking back to before the course, how would you rate yourself?'}</p>
              {CONFIDENCE_ITEMS.map((item, index) => <RatingQuestion key={item.id} id={'recalled-' + item.id} text={item[language]} labels={CONFIDENCE_LABELS[language]}
                value={draft.recalledConfidence[index]!} onChange={value => patch({ recalledConfidence: draft.recalledConfidence.map((old, at) => at === index ? value : old) })} />)}
              <RatingQuestion id="recalled-intention" text={sw ? 'Kabla ya kozi, ulikuwa na uwezekano gani wa kuchukua hatua kama hii katika siku 30 zilizofuata?' : 'Before the course, how likely were you to take such an action in the following 30 days?'}
                labels={INTENTION_LABELS[language]} value={draft.recalledIntention} onChange={value => patch({ recalledIntention: value })} />
            </div>}
          </div>}
          {phase === 'endline' && <div><label htmlFor="outcomes-comment" className="block font-semibold">{sw ? 'Ni jambo gani moja unalotaka kutumia baada ya kozi? (Hiari)' : 'What is one thing you want to apply after the course? (Optional)'}</label>
            <p id="outcomes-comment-hint" className="mt-1 text-sm text-gray-600">{sw ? 'Usiweke majina au taarifa za mawasiliano.' : 'Leave out names and contact details.'}</p>
            <textarea id="outcomes-comment" aria-describedby="outcomes-comment-hint" maxLength={600} rows={3} value={draft.comment} onChange={event => patch({ comment: event.target.value })}
              className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></div>}
        </>}
      </fieldset>
      {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 p-3 text-red-800">{sw
        ? 'Majibu hayajathibitishwa kuwa yamehifadhiwa. Majibu yako bado yako hapa. Angalia mtandao na hali ya kuingia, kisha jaribu tena. Ikiwa kozi imeanza, majibu mapya ya kabla ya kozi hayawezi kuongezwa.'
        : 'Your response has not been confirmed as saved. Your answers are still here. Check your connection and sign-in, then retry. A new before-course response cannot be added once learning has started.'}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button className={buttonClass} disabled={saving} onClick={() => setStep(value => value - 1)}>{sw ? 'Rudi' : 'Back'}</button>
        {step < 3 ? <button className={primaryClass} disabled={!pageComplete || saving} onClick={() => setStep(value => value + 1)}>{sw ? 'Endelea' : 'Next'}</button>
          : <button className={primaryClass} disabled={!pageComplete || saving} onClick={submit}>{saving ? (sw ? 'Inahifadhi…' : 'Saving…') : (sw ? 'Wasilisha utafiti' : 'Submit survey')}</button>}
      </div>
      <Link to="/learn" className="mt-4 inline-block min-h-11 py-2 font-semibold text-forest-green underline">{sw ? 'Hifadhi rasimu na uendelee kujifunza' : 'Leave this draft and continue learning'}</Link>
    </>}
    {storageError && <p role="alert" className="mt-4 text-sm text-amber-800">{sw ? 'Kivinjari hakiwezi kuhifadhi rasimu. Usifunge ukurasa kabla ya kuwasilisha.' : 'This browser cannot save your draft. Keep this page open until you submit.'}</p>}
  </div>;
}
