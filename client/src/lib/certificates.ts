import { apiUrl } from './api';

export async function downloadCertificatePdf(certificateId: string, token: string) {
  const response = await fetch(apiUrl(`/certificates/${encodeURIComponent(certificateId)}/pdf`), {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || 'The certificate could not be downloaded. Please try again.');
  }
  if (!response.headers.get('Content-Type')?.startsWith('application/pdf')) {
    throw new Error('The server did not return a certificate PDF. Please try again.');
  }

  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = `${certificateId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
