import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import VerifyCertificate from './VerifyCertificate';

afterEach(() => vi.unstubAllGlobals());

it('renders the learner and issuer names from the certificate verification response', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({
    verified: true,
    certificateId: 'CJN-2026-ABC',
    learnerName: 'Njeri Wambũi',
    courseTitle: 'Nairobi Climate Justice',
    issueDate: '2026-11-11T08:00:00.000Z',
    issuingOrganization: 'Climate Justice Nairobi',
    instructor: 'John Obure',
    instructorTitle: 'Climate Activist and Founder',
    skillsVerified: ['Urban Flooding']
  })));
  render(
    <MemoryRouter initialEntries={['/verify/CJN-2026-ABC']}>
      <Routes>
        <Route path="/verify/:certId" element={<VerifyCertificate />} />
      </Routes>
    </MemoryRouter>
  );
  expect(await screen.findByRole('heading', { name: 'Njeri Wambũi' })).toBeTruthy();
  expect(screen.getByText('John Obure')).toBeTruthy();
  expect(screen.getByText('Urban Flooding')).toBeTruthy();
});
