import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supportRequest } from '../lib/supportTickets';
import SupportInquiryHistory from './SupportInquiryHistory';

export default function SupportInquiryForm({ privacyRequest = false }: { privacyRequest?: boolean }) {
  const { language } = useLanguage();
  const { user, token, isLoading } = useAuth();
  const isSwahili = language === 'sw';
  // Support Ticket Form State
  const [nameInput, setNameInput] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const ticketName = nameInput ?? (user?.displayName || user?.name || '');
  const ticketEmail = emailInput ?? user?.email ?? '';
  const [ticketCategory, setTicketCategory] = useState('video');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);
  const [ticketReference, setTicketReference] = useState<string | null>(null);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [ticketRevision, setTicketRevision] = useState(0);
  const submission = useRef<AbortController | null>(null);

  useEffect(() => () => submission.current?.abort(), []);

  const handleSupportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isLoading) return;
    setTicketError(null);
    setTicketSuccess(null);
    setTicketReference(null);

    if (!ticketName.trim()) {
      setTicketError(isSwahili ? 'Tafadhali ingiza jina lako.' : 'Please enter your name.');
      return;
    }
    if (user && !token) {
      setTicketError(isSwahili ? 'Tafadhali ingia tena.' : 'Sign in again to submit an inquiry from your account.');
      return;
    }
    if ((!user || ticketEmail.trim()) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticketEmail.trim())) {
      setTicketError(isSwahili ? 'Tafadhali ingiza barua pepe sahihi.' : 'Please enter a valid email address.');
      return;
    }
    if (!ticketSubject.trim()) {
      setTicketError(isSwahili ? 'Tafadhali ingiza mada ya swali.' : 'Please enter a subject.');
      return;
    }
    if (!ticketMessage.trim() || ticketMessage.trim().length < 10) {
      setTicketError(isSwahili ? 'Ujumbe lazima uwe na herufi angalau 10.' : 'Message must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    const controller = new AbortController();
    submission.current = controller;
    try {
      const data = await supportRequest<{ success: boolean; ticketId: string; message: string }>(
        '/support/tickets',
        token,
        {
          method: 'POST',
          signal: controller.signal,
          body: JSON.stringify({
            name: ticketName.trim(),
            email: ticketEmail.trim(),
            category: privacyRequest ? 'privacy' : ticketCategory,
            subject: ticketSubject.trim(),
            message: ticketMessage.trim()
          })
        }
      );
      if (controller.signal.aborted) return;
      if (!data.success || !data.ticketId) {
        throw new Error('The support desk could not confirm your submission.');
      }

      setTicketSuccess(isSwahili
        ? (user
          ? 'Ombi lako limepokelewa. Soma jibu chini ya Maombi Yangu ya Msaada.'
          : 'Ombi lako limepokelewa. Timu ya msaada inaweza kujibu kwa barua pepe.')
        : data.message);
      setTicketReference(data.ticketId);
      setTicketRevision(value => value + 1);
      setTicketSubject('');
      setTicketMessage('');
    } catch (error) {
      if (!controller.signal.aborted) {
        setTicketError(error instanceof Error ? error.message : 'Could not submit your inquiry.');
      }
    } finally {
      if (!controller.signal.aborted) setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div>
          {!privacyRequest && <span className="text-xs font-bold text-forest-green uppercase tracking-wider">
            {isSwahili ? 'Usaidizi wa Moja kwa Moja' : 'Direct Support Helpdesk'}
          </span>}
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {privacyRequest
              ? (isSwahili ? 'Tuma ombi kuhusu faragha' : 'Submit a privacy request')
              : (isSwahili ? 'Wasilisha Swali au Ripoti Tatizo' : 'Submit a Support Inquiry')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {privacyRequest
              ? (isSwahili
                ? 'Wasimamizi wa jukwaa hupokea jina, barua pepe ya mawasiliano ukiitoa, na maelezo ya ombi lako. Usitume nenosiri, msimbo wa kurejesha akaunti au hati ya utambulisho.'
                : 'Platform administrators receive your name, contact email if provided, and request. Leave out passwords, recovery codes and identity documents.')
              : (isSwahili
                ? 'Tuma ombi lako kwa timu ya msaada. Utapokea nambari ya kumbukumbu.'
                : 'Send an inquiry to our support desk. You’ll receive a reference number.')}
          </p>
        </div>

        {ticketSuccess && (
          <div role="status" className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-bold text-sm">{isSwahili ? 'Ombi lako limepokelewa' : 'Request received'}</h3>
            </div>
            <p className="text-xs leading-relaxed">{ticketSuccess}</p>
            {ticketReference && (
              <div className="pt-2">
                <span className="text-xs text-gray-600">{isSwahili ? 'Nambari ya kumbukumbu ' : 'Reference number '}</span>
                <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-emerald-900">
                  {ticketReference}
                </span>
              </div>
            )}
          </div>
        )}

        {ticketError && (
          <div role="alert" className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm flex items-center gap-2 font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{ticketError}</span>
          </div>
        )}

        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="support-name" className="block text-xs font-bold text-gray-700 mb-1">
                {isSwahili ? 'Jina Lako Kamili *' : 'Your Full Name *'}
              </label>
              <input
                type="text"
                id="support-name"
                required
                maxLength={255}
                value={ticketName}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Amina Wanjiku"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
              />
            </div>

            <div>
              <label htmlFor="support-email" className="block text-xs font-bold text-gray-700 mb-1">
                {isSwahili ? 'Barua Pepe ya Mawasiliano' : 'Contact email'}{user ? '' : ' *'}
              </label>
              <input
                type="email"
                id="support-email"
                required={!user}
                maxLength={254}
                value={ticketEmail}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
              />
            </div>
          </div>

          <div className={privacyRequest ? '' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
            {!privacyRequest && <div>
              <label htmlFor="support-category" className="block text-xs font-bold text-gray-700 mb-1">
                {isSwahili ? 'Aina ya Tatizo / Kategoria *' : 'Inquiry Category *'}
              </label>
              <select
                id="support-category"
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
              >
                <option value="video">Video Playback / Streaming Error</option>
                <option value="account">Sign-In / Password</option>
                <option value="privacy">{isSwahili ? 'Ombi kuhusu faragha' : 'Privacy request'}</option>
                <option value="certificates">Certificate Verification / QR</option>
                <option value="quizzes">Quizzes & Project Evaluations</option>
                <option value="curriculum">Curriculum Question / Fact Check</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>}

            <div>
              <label htmlFor="support-subject" className="block text-xs font-bold text-gray-700 mb-1">
                {isSwahili ? 'Mada ya Swali *' : 'Subject Line *'}
              </label>
              <input
                type="text"
                id="support-subject"
                required
                maxLength={255}
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder={privacyRequest
                  ? (isSwahili ? 'Mfano: Nakala ya rekodi zangu' : 'For example, a copy of my records')
                  : 'e.g. Video buffering on Module 2 Lesson 3'}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
              />
            </div>
          </div>

          <div>
            <label htmlFor="support-message" className="block text-xs font-bold text-gray-700 mb-1">
              {isSwahili ? 'Ujumbe / Maelezo ya Tatizo (Herufi 10+) *' : 'Detailed Message / Description *'}
            </label>
            <textarea
              id="support-message"
              rows={4}
              required
              maxLength={4000}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder={privacyRequest
                ? (isSwahili ? 'Eleza unachohitaji na rekodi zinazohusika.' : 'Describe your request and which records it concerns.')
                : (isSwahili ? 'Eleza tatizo unalokumbana nalo kwa kina...' : 'Describe what happened, the lesson you were studying, or the question you have...')}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-3 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting
              ? (isSwahili ? 'Inatuma…' : 'Sending…')
              : privacyRequest
                ? (isSwahili ? 'Tuma ombi' : 'Send request')
                : (isSwahili ? 'Wasilisha Ombi la Msaada' : 'Submit Support Ticket')}</span>
          </button>
        </form>
      </div>
      {!privacyRequest && user && token && (
        <SupportInquiryHistory key={user.id} token={token} revision={ticketRevision} isSwahili={isSwahili} />
      )}
    </>
  );
}
