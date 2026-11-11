import { useEffect, useState, type FormEvent } from 'react';
import { supportRequest, type SupportTicket } from '../lib/supportTickets';

interface InboxTicket extends SupportTicket {
  userId: string | null;
  name: string;
  email: string;
}

interface InboxPage {
  tickets: InboxTicket[];
  hasMore: boolean;
}

export default function AdminSupportInbox({ token }: { token: string }) {
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [inbox, setInbox] = useState<InboxPage | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ id: string; text: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    supportRequest<InboxPage>('/admin/support/tickets?page=' + page, token, { signal: controller.signal })
      .then(result => {
        if (!controller.signal.aborted) {
          setInbox(result);
          setLoadError(null);
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) setLoadError(error.message);
      });
    return () => controller.abort();
  }, [page, refresh, token]);

  const sendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || !draft.text.trim() || sending) return;
    setSending(true);
    setReplyError(null);
    try {
      const { ticket } = await supportRequest<{ ticket: InboxTicket }>(
        '/admin/support/tickets/' + encodeURIComponent(draft.id) + '/reply',
        token,
        { method: 'PATCH', body: JSON.stringify({ reply: draft.text.trim() }) }
      );
      setInbox(current => current && {
        ...current,
        tickets: current.tickets.map(item => item.id === ticket.id ? ticket : item)
      });
      setDraft(null);
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : 'Could not save the reply.');
    } finally {
      setSending(false);
    }
  };

  const goToPage = (nextPage: number) => {
    setInbox(null);
    setLoadError(null);
    setDraft(null);
    setReplyError(null);
    setPage(nextPage);
  };

  const refreshInbox = () => {
    setInbox(null);
    setLoadError(null);
    setRefresh(value => value + 1);
  };

  return (
    <section className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-bold text-gray-900">Support Inbox</h2>
        <button type="button" disabled={sending} onClick={refreshInbox} className="text-sm font-bold text-forest-green hover:underline">
          Refresh inquiries
        </button>
      </div>
      {loadError && <p role="alert" className="text-sm text-red-700">{loadError}</p>}
      {!inbox && !loadError && <p role="status" className="text-sm text-gray-500">Loading inquiries…</p>}
      {inbox?.tickets.length === 0 && <p className="text-sm text-gray-500">No inquiries on this page.</p>}
      <div className="space-y-4">
        {inbox?.tickets.map(ticket => (
          <article key={ticket.id} className="min-w-0 rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-bold text-gray-900 break-words">{ticket.subject}</h3>
              <span className="text-xs text-gray-600">
                {ticket.reply ? 'Replied' : ticket.userId ? 'Awaiting reply' : 'Guest inquiry'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 break-words">
              {ticket.name}{ticket.email ? ' · ' + ticket.email : ''} · {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-1 text-xs font-mono text-gray-500">{ticket.id}</p>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-gray-700">{ticket.message}</p>
            {ticket.reply ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-bold text-gray-700">Support reply</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">{ticket.reply}</p>
              </div>
            ) : !ticket.userId ? (
              <a
                href={'mailto:' + encodeURIComponent(ticket.email).replace(/%40/g, '@')
                  + '?subject=' + encodeURIComponent('Re: ' + ticket.subject + ' [' + ticket.id + ']')}
                className="mt-3 inline-block text-sm font-bold text-forest-green hover:underline"
              >
                Reply using email app
              </a>
            ) : draft?.id === ticket.id ? (
              <form className="mt-4 space-y-2" onSubmit={sendReply}>
                <label className="block text-sm font-bold text-gray-700">
                  Reply to {ticket.name}
                  <textarea
                    required
                    maxLength={4000}
                    rows={4}
                    disabled={sending}
                    value={draft.text}
                    onChange={event => setDraft({ id: ticket.id, text: event.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm font-normal"
                  />
                </label>
                {replyError && <p role="alert" className="text-sm text-red-700">{replyError}</p>}
                <div className="flex gap-3">
                  <button type="submit" disabled={sending || !draft.text.trim()} className="rounded-lg bg-forest-green px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
                    {sending ? 'Sending…' : 'Send reply'}
                  </button>
                  <button type="button" disabled={sending} onClick={() => setDraft(null)} className="text-xs font-bold text-gray-600 hover:underline">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                disabled={sending}
                onClick={() => {
                  setReplyError(null);
                  setDraft({ id: ticket.id, text: '' });
                }}
                aria-label={'Reply to inquiry ' + ticket.subject}
                className="mt-3 text-sm font-bold text-forest-green hover:underline"
              >
                Reply
              </button>
            )}
          </article>
        ))}
      </div>
      {inbox && (page > 1 || inbox.hasMore) && (
        <div className="mt-5 flex items-center gap-4 text-sm">
          <button type="button" disabled={page === 1 || sending} onClick={() => goToPage(page - 1)} className="font-bold text-forest-green disabled:opacity-50">Previous</button>
          <span>Page {page}</span>
          <button type="button" disabled={!inbox.hasMore || sending} onClick={() => goToPage(page + 1)} className="font-bold text-forest-green disabled:opacity-50">Next</button>
        </div>
      )}
    </section>
  );
}
