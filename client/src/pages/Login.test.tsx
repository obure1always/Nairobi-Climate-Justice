import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as AuthContextModule from '../contexts/AuthContext';
import * as LanguageContextModule from '../LanguageContext';

describe('Authentication Interface', () => {
  const mockContinueAsGuest = vi.fn();
  const mockLogin = vi.fn().mockResolvedValue({ success: true });
  const mockRegister = vi.fn().mockResolvedValue({ 
    success: true, 
    recoveryCode: 'ABCD-EF12-34GH-56JK' 
  });
  const mockLoginWithGoogle = vi.fn().mockResolvedValue({ success: true });
  const mockLoginWithPhone = vi.fn().mockResolvedValue({ success: true });
  const mockRegisterWithPhone = vi.fn().mockResolvedValue({ 
    success: true, 
    recoveryCode: 'WXYZ-1234-ABCD-5678' 
  });
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
      loginWithPhone: mockLoginWithPhone,
      registerWithPhone: mockRegisterWithPhone,
      logout: vi.fn(),
      transferGuestProgress: vi.fn(),
      dismissTransferModal: vi.fn(),
      changePassword: vi.fn(),
      regenerateRecoveryCode: vi.fn(),
      deleteAccount: vi.fn(),
      updateProfile: vi.fn()
    });

    vi.spyOn(LanguageContextModule, 'useLanguage').mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
      t: (key: string) => key
    });

    // Mock fetch for API requests
    (globalThis as any).fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    });
  });

  it('renders the brand header, title, and language toggle without demo or guest bypass buttons', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Nairobi Climate Justice').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Climate Learning Platform')).toBeDefined();
    
    // Confirms demo passes and guest bypass buttons have been removed
    expect(screen.queryByRole('button', { name: /Continue as Guest \(No Account Needed\)/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Demo Pass/i })).toBeNull();
  });

  it('switches between Sign In, Create Account, and Recovery modes', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Initial mode is Sign In with Email (Primary)
    expect(screen.getByRole('button', { name: /Sign In with Email/i })).toBeDefined();

    // Switch to Phone method in Sign In
    const phoneMethodBtn = screen.getByRole('button', { name: /Phone & Password/i });
    fireEvent.click(phoneMethodBtn);
    expect(screen.getByRole('button', { name: /Sign In with Phone/i })).toBeDefined();

    // Switch back to Email method
    const emailMethodBtn = screen.getByRole('button', { name: /Email & Password/i });
    fireEvent.click(emailMethodBtn);
    expect(screen.getByRole('button', { name: /Sign In with Email/i })).toBeDefined();

    // Switch to Create Account mode
    const createAccountTab = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountTab);
    expect(screen.getByRole('button', { name: /Create My Account/i })).toBeDefined();

    // Switch back to Sign In then click Forgot password
    const signInTab = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInTab);
    const forgotPwdBtn = screen.getByRole('button', { name: /Forgot password\?/i });
    fireEvent.click(forgotPwdBtn);

    expect(screen.getByText(/16-Character Recovery Code/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Reset Password/i })).toBeDefined();
  });

  it('signs in using email and password', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('you@example.org');
    fireEvent.change(emailInput, { target: { value: 'amina@example.org' } });

    const passwordInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordInput, { target: { value: 'SecretPass123!' } });

    const signInBtn = screen.getByRole('button', { name: /Sign In with Email/i });
    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('amina@example.org', 'SecretPass123!');
    });
  });

  it('registers a new user with email and displays the 16-character recovery code dialog', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Switch to Create Account
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Fill in registration inputs
    fireEvent.change(screen.getByLabelText(/Full Name or Learner Nickname/i), { target: { value: 'Amina Learner' } });
    fireEvent.change(screen.getByLabelText(/^Email Address/i), { target: { value: 'amina@test.org' } });
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'SuperSecret123!' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'SuperSecret123!' } });

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
      expect(screen.getByText(/Save Your Recovery Key/i)).toBeDefined();
    });
  });

  it('handles language toggle click', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const langBtn = screen.getByText(/English/i);
    fireEvent.click(langBtn);

    expect(mockSetLanguage).toHaveBeenCalledWith('sw');
  });

  it('signs in using phone number and password', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Switch to Phone & Password method
    fireEvent.click(screen.getByRole('button', { name: /Phone & Password/i }));

    const phoneInput = screen.getByPlaceholderText('712 345 678');
    fireEvent.change(phoneInput, { target: { value: '0712345678' } });

    const passwordInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordInput, { target: { value: 'CorrectPassword123!' } });

    const signInBtn = screen.getByRole('button', { name: /Sign In with Phone/i });
    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(mockLoginWithPhone).toHaveBeenCalledWith('+254', '0712345678', 'CorrectPassword123!');
    });
  });

  it('creates an account using name, phone number, password, and optional recovery email', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Switch to Create Account mode
    const createAccountTab = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountTab);

    // Switch to Phone method
    fireEvent.click(screen.getByRole('button', { name: /Phone & Password/i }));

    // Fill phone registration form
    fireEvent.change(screen.getByPlaceholderText('e.g. Amina Wanjiku'), { target: { value: 'Amina Wanjiku' } });
    fireEvent.change(screen.getByPlaceholderText('712 345 678'), { target: { value: '0712345678' } });
    fireEvent.change(screen.getByPlaceholderText('backup@example.org (optional)'), { target: { value: 'backup@example.org' } });

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'StrongPass123!' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'StrongPass123!' } });

    const consentCheckbox = screen.getByRole('checkbox');
    fireEvent.click(consentCheckbox);

    const submitBtn = screen.getByRole('button', { name: /Create My Account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockRegisterWithPhone).toHaveBeenCalledWith(
        '+254',
        '0712345678',
        'StrongPass123!',
        'Amina Wanjiku',
        'backup@example.org'
      );
    });

    // Displays emergency recovery code dialog
    await waitFor(() => {
      expect(screen.getByText('WXYZ-1234-ABCD-5678')).toBeDefined();
      expect(screen.getByText(/Save Your Recovery Key/i)).toBeDefined();
    });
  });

  it('displays accurate error message when phone sign in fails and retains entered phone number', async () => {
    mockLoginWithPhone.mockResolvedValueOnce({ 
      success: false, 
      error: 'Invalid phone number or password.' 
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Switch to Phone method
    fireEvent.click(screen.getByRole('button', { name: /Phone & Password/i }));

    const phoneInput = screen.getByPlaceholderText('712 345 678') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '0712345678' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'WrongPassword!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In with Phone/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid phone number or password.')).toBeDefined();
    });

    // Verify entered information is kept when recoverable errors occur
    expect(phoneInput.value).toBe('0712345678');
  });

  it('toggles password visibility with visibility controls', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /Show password/i });
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');

    const hideBtn = screen.getByRole('button', { name: /Hide password/i });
    fireEvent.click(hideBtn);
    expect(passwordInput.type).toBe('password');
  });
});
