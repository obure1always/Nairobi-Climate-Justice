import { Op } from 'sequelize';
import { Certificate, CertificateDelivery, User } from '../models/index';
import { createCertificatePdf } from './certificatePdf';

type CertificateEmailSender = (
  recipient: string,
  certificate: Certificate,
  pdf: Buffer
) => Promise<void>;

const sendWithResend: CertificateEmailSender = async (recipient, certificate, pdf) => {
  if (process.env.NODE_ENV === 'test') {
    throw new Error('Live certificate email delivery is disabled during tests.');
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CERTIFICATE_FROM_EMAIL;
  if (process.env.CERTIFICATE_EMAIL_PROVIDER !== 'resend') {
    throw new Error('CERTIFICATE_EMAIL_PROVIDER must be configured as resend.');
  }
  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY and CERTIFICATE_FROM_EMAIL are required.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `certificate-${certificate.id}`
    },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      from,
      to: [recipient],
      subject: `Your Nairobi Climate Justice certificate (${certificate.id})`,
      text: `Congratulations ${certificate.learnerName}, your certificate is attached.`,
      html: `<p>Congratulations ${escapeHtml(certificate.learnerName)},</p><p>Your Nairobi Climate Justice certificate is attached.</p>`,
      attachments: [{
        filename: `${certificate.id}.pdf`,
        content: pdf.toString('base64')
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Configured email provider returned HTTP ${response.status}.`);
  }
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character] || character);

export const attemptCertificateEmail = async (
  certificateId: string,
  sender: CertificateEmailSender = sendWithResend,
  retryFailed = false
): Promise<CertificateDelivery | null> => {
  const delivery = await CertificateDelivery.findByPk(certificateId);
  if (!delivery || ['sent', 'blocked', 'sending'].includes(delivery.status)) return delivery;
  if (delivery.status === 'failed' && !retryFailed) return delivery;

  const [claimed] = await CertificateDelivery.update({
    status: 'sending',
    attemptCount: delivery.attemptCount + 1,
    lastAttemptAt: new Date(),
    lastError: null
  }, {
    where: {
      certificateId,
      status: retryFailed
        ? { [Op.in]: ['pending', 'failed'] }
        : 'pending'
    }
  });
  if (!claimed) return CertificateDelivery.findByPk(certificateId);

  try {
    const [certificate, user] = await Promise.all([
      Certificate.findByPk(certificateId),
      User.findByPk(delivery.userId)
    ]);
    if (!certificate || !user) throw new Error('Certificate delivery record is incomplete.');
    if (!user.email || !user.emailVerified) {
      await delivery.update({
        status: 'blocked',
        recipientEmail: null,
        lastError: 'A verified account email address is required.'
      });
      return delivery;
    }

    delivery.recipientEmail = user.email;
    await delivery.save();
    const pdf = await createCertificatePdf(certificate);
    await sender(user.email, certificate, pdf);
    await delivery.update({
      status: 'sent',
      sentAt: new Date(),
      lastError: null
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown certificate email failure.';
    await delivery.update({
      status: 'failed',
      lastError: message.slice(0, 1000)
    });
    console.error('[certificate.email] delivery_failed', {
      certificateId,
      attemptCount: delivery.attemptCount,
      error: message
    });
  }

  return delivery.reload();
};

export const attemptPendingCertificateEmails = async () => {
  const pending = await CertificateDelivery.findAll({
    where: { status: 'pending' },
    order: [['createdAt', 'ASC']]
  });
  for (const delivery of pending) {
    await attemptCertificateEmail(delivery.certificateId);
  }
};
