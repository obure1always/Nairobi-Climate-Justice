import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as AuthContextModule from '../contexts/AuthContext';
import * as LanguageContextModule from '../LanguageContext';

describe('Login & Guest Access Page', () => {
  const mockContinueAsGuest = vi.fn();
  const mockLogin = vi.fn().mockResolvedValue({ success: true });
  const mockRegister = vi.fn().mockResolvedValue({ 
    success: true, 
    recoveryCode: 'ABCD-EF12-34GH-56JK' 
  });
  const mockLoginWithGoogle = vi.fn().mockResolvedValue({ success: true });
  const mockSetLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isGuest: true,
      guestId: 'guest_test_123',
      isLoading: false,
      error: null,
      showTransferModal: false,
      continueAsGuest: mockContinueAsGuest,
      login: mockLogin,
      register: mockRegister,
      loginWithGoogle: mockLoginWithGoogle,
      logout: vi.fn(),
      transferGuestProgress: vi.fn(),
      dismissTransferModal: vi.fn(),
      changePassword: vi.fn(),
      regenerateRecoveryCode: vi.fn(),
      deleteAccount: vi.fn()
    });

    vi.spyOn(LanguageContextModule, 'useLanguage').mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
      t: (key: string) => key
    });
  });

  it('renders the brand area, tagline, and prominent Continue as Guest button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Climate Justice Nairobi')).toBeDefined();
    expect(screen.getByText('Understand your climate. Strengthen your community.')).toBeDefined();
    
    // Prominent Continue as Guest button
    const guestBtn = screen.getByRole('button', { name: /Continue as Guest/i });
    expect(guestBtn).toBeDefined();
    
    fireEvent.click(guestBtn);
    expect(mockContinueAsGuest).toHaveBeenCalledTimes(1);
  });

  it('switches between Sign In, Create Account, and Recovery modes', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Initial mode is Sign In
    expect(screen.getByRole('button', { name: /Sign In with Email/i })).toBeDefined();

    // Switch to Create Account
    const createAccountTab = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountTab);
    expect(screen.getByRole('button', { name: /Create My Account/i })).toBeDefined();

    // Switch back to Sign In then click Forgot password
    const signInTab = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInTab);
    const forgotPwdBtn = screen.getByRole('button', { name: /Forgot password\?/i });
    fireEvent.click(forgotPwdBtn);

    expect(screen.getByText(/Recovery Code \(XXXX-XXXX-XXXX-XXXX\)/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Reset My Password/i })).toBeDefined();
  });

  it('submits registration and displays the zero-cost 16-character recovery code dialog', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Switch to Create Account
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Fill in registration inputs
    fireEvent.change(screen.getByLabelText(/Name or Nickname/i), { target: { value: 'Amina Learner' } });
    fireEvent.change(screen.getByLabelText(/^Email Address/i), { target: { value: 'amina@test.org' } });
    fireEvent.change(screen.getByLabelText(/^Password \(8\+ chars\)/i), { target: { value: 'SuperSecret123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'SuperSecret123!' } });

    // Check privacy consent
    const consentCheckbox = screen.getByRole('checkbox');
    fireEvent.click(consentCheckbox);

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Create My Account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'amina@test.org',
        'SuperSecret123!',
        'SuperSecret123!',
        'Amina Learner'
      );
    });

    // Verify recovery code dialog appears
    await waitFor(() => {
      expect(screen.getByText('ABCD-EF12-34GH-56JK')).toBeDefined();
      expect(screen.getByText(/Save Your Recovery Code/i)).toBeDefined();
    });
  });

  it('handles language toggle click', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const langBtn = screen.getByRole('button', { name: /Toggle language/i });
    fireEvent.click(langBtn);

    expect(mockSetLanguage).toHaveBeenCalledWith('sw');
  });
});
