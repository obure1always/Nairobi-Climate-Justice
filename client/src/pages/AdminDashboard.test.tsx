import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import * as AuthContextModule from '../contexts/AuthContext';

describe('AdminDashboard Component', () => {
  const mockAdminUser: AuthContextModule.AuthUser = {
    id: 'admin-uuid-1',
    email: 'admin@climatejustice.ke',
    name: 'Dr. John Obure',
    displayName: 'Dr. John Obure',
    role: 'admin',
    authProvider: 'email'
  };

  const mockLearnerUser: AuthContextModule.AuthUser = {
    id: 'learner-uuid-2',
    email: 'learner@climatejustice.ke',
    name: 'Amina Learner',
    displayName: 'Amina Learner',
    role: 'learner',
    authProvider: 'email'
  };

  const mockDashboardData = {
    stats: {
      totalUsers: 22,
      totalParticipants: 19,
      totalLessonCompletions: 26,
      totalCertificates: 1,
      totalProjectSubmissions: 1,
      totalActiveSessions: 26,
      rolesCount: { learner: 18, instructor: 2, admin: 2 }
    },
    database: {
      dialect: 'sqlite',
      storage: 'server/database.sqlite',
      connected: true,
      tableCount: 21
    },
    users: [
      {
        id: 'admin-uuid-1',
        name: 'Dr. John Obure',
        email: 'admin@climatejustice.ke',
        phone: null,
        phoneVerified: false,
        role: 'admin',
        authProvider: 'email',
        title: 'Platform Lead',
        institution: 'Climate Justice Nairobi',
        createdAt: '2026-10-28T16:58:20.296Z',
        updatedAt: '2026-10-28T16:58:20.296Z'
      },
      {
        id: 'learner-uuid-2',
        name: 'Amina Learner',
        email: 'learner@climatejustice.ke',
        phone: '+254712345678',
        phoneVerified: false,
        role: 'learner',
        authProvider: 'email',
        title: null,
        institution: null,
        createdAt: '2026-10-29T22:25:59.026Z',
        updatedAt: '2026-10-29T22:25:59.026Z'
      }
    ],
    modules: [
      { id: 'm1', order: 1, title: 'Nairobi Climate Risk', description: 'Understand urban heat and vulnerability.' }
    ],
    moduleProgresses: [],
    lessonProgresses: [
      {
        id: 'lp-1',
        userId: 'learner-uuid-2',
        moduleId: 'm1',
        lessonId: 'm1-l1',
        completed: true,
        playbackSeconds: 120,
        notes: null,
        lastAccessedAt: '2026-10-28T20:07:53.052Z'
      }
    ],
    certificates: [
      {
        id: 'CJN-2026-DEMO',
        userId: 'learner-uuid-2',
        learnerName: 'Amina Learner',
        courseTitle: 'Climate Justice Fundamentals',
        pathwayId: 'pathway-fundamentals',
        issuingOrg: 'Climate Justice Nairobi',
        issueDate: '2026-10-28T00:00:00.000Z',
        verificationUrl: '/verify/CJN-2026-DEMO',
        distinction: 'Honors Distinction',
        createdAt: '2026-10-28T18:24:53.606Z'
      }
    ],
    projectSubmissions: [],
    recentActivity: [
      {
        id: 'act-1',
        type: 'registration',
        title: 'New Account Registered',
        description: 'Registered with email as learner',
        userName: 'Amina Learner',
        userEmail: 'learner@climatejustice.ke',
        timestamp: '2026-10-29T22:25:59.026Z'
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('climate_justice_token', 'mock_admin_token');

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/v1/admin/dashboard')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockDashboardData)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    });

    vi.stubGlobal('fetch', mockFetch);
  });

  it('renders access restriction prompt for non-admin accounts', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: mockLearnerUser,
      token: 'learner_token',
      isGuest: false,
      guestId: '',
      isLoading: false,
      error: null,
      showTransferModal: false,
      continueAsGuest: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      loginWithPhone: vi.fn(),
      registerWithPhone: vi.fn(),
      logout: vi.fn(),
      transferGuestProgress: vi.fn(),
      dismissTransferModal: vi.fn(),
      changePassword: vi.fn(),
      regenerateRecoveryCode: vi.fn(),
      deleteAccount: vi.fn(),
      updateProfile: vi.fn()
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Administrator Access Restricted/i)).toBeDefined();
    expect(screen.getByText(/requires verified platform administrator credentials/i)).toBeDefined();
    expect(screen.queryByText(/Administrator Command Console/i)).toBeNull();
  });

  it('renders administration dashboard for authenticated administrator', async () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: mockAdminUser,
      token: 'admin_token',
      isGuest: false,
      guestId: '',
      isLoading: false,
      error: null,
      showTransferModal: false,
      continueAsGuest: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      loginWithPhone: vi.fn(),
      registerWithPhone: vi.fn(),
      logout: vi.fn(),
      transferGuestProgress: vi.fn(),
      dismissTransferModal: vi.fn(),
      changePassword: vi.fn(),
      regenerateRecoveryCode: vi.fn(),
      deleteAccount: vi.fn(),
      updateProfile: vi.fn()
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Header and SQLite connection info
    expect(screen.getByText(/Administrator Command Console/i)).toBeDefined();
    expect(screen.getByText(/server\/database\.sqlite/i)).toBeDefined();

    // Verify metric cards
    await waitFor(() => {
      expect(screen.getByText('22')).toBeDefined(); // Total users
      expect(screen.getAllByText('26').length).toBeGreaterThanOrEqual(1); // Metric cards
    });

    // Verify user table lists records
    expect(screen.getByText('Dr. John Obure')).toBeDefined();
    expect(screen.getByText('Amina Learner')).toBeDefined();

    // Switch to Courses tab
    const coursesTab = screen.getByRole('button', { name: /Courses & Modules/i });
    fireEvent.click(coursesTab);
    expect(screen.getByText('Nairobi Climate Risk')).toBeDefined();

    // Switch to Certificates tab
    const certsTab = screen.getByRole('button', { name: /Certificates & Projects/i });
    fireEvent.click(certsTab);
    expect(screen.getByText('CJN-2026-DEMO')).toBeDefined();
    expect(screen.getByText('Honors Distinction')).toBeDefined();

    // Switch to Activity tab
    const activityTab = screen.getByRole('button', { name: /Live Activity Feed/i });
    fireEvent.click(activityTab);
    expect(screen.getByText('New Account Registered')).toBeDefined();
  });
});
