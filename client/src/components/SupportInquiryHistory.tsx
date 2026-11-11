import { useEffect, useState } from 'react';
import { supportRequest, type SupportTicket } from '../lib/supportTickets';

export default function SupportInquiryHistory({ token, revision, isSwahili }: {
  token: string;
  revision: number;
  isSwahili: boolean;
}) {
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    supportRequest<{ tickets: SupportTicket[] }>('/support/tickets', token, { signal: controller.signal })
      .then(result => {
        if (!controller.signal.aborted) {
          setTickets(result.tickets);
          setLoadError(null);
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) setLoadError(error.message);
      });
    return () => controller.abort();
  }, [token, revision, refresh]);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-4" aria-labelledby="my-support-inquiries">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="my-support-inquiries" className="text-xl font-bold text-gray-900">
          {isSwahili ? 'Maombi Yangu ya Msaada' : 'My Support Inquiries'}
        </h2>
        <button type="button" onClick={() => setRefresh(value => value + 1)} className="text-sm font-bold text-forest-green hover:underline">
          {isSwahili ? 'Onyesha upya' : 'Refresh inquiries'}
        </button>
      </div>
      {loadError && <p role="alert" className="text-sm text-red-700">{loadError}</p>}
      {!tickets && !loadError && (
        <p role="status" className="text-sm text-gray-500">{isSwahili ? 'Inapakia maombi…' : 'Loading inquiries…'}</p>
      )}
      {tickets?.length === 0 && (
        <p className="text-sm text-gray-500">{isSwahili ? 'Bado hujatuma ombi la msaada.' : 'You haven’t submitted a support inquiry yet.'}</p>
      )}
      {tickets?.map(ticket => (
        <article key={ticket.id} className="rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap justify-between gap-2">
            <h3 className="font-bold text-gray-900 break-words">{ticket.subject}</h3>
            <span className="text-xs text-gray-600">
              {ticket.reply
                ? (isSwahili ? 'Limejibiwa' : 'Replied')
                : (isSwahili ? 'Linasubiri jibu' : 'Awaiting reply')}
            </span>
          </div>
          <p className="mt-1 text-xs font-mono text-gray-500">{ticket.id}</p>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm text-gray-700">{ticket.message}</p>
          {ticket.reply && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3">
              <p className="text-xs font-bold text-forest-green">{isSwahili ? 'Jibu kutoka kwa timu ya msaada' : 'Support reply'}</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800">{ticket.reply}</p>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
