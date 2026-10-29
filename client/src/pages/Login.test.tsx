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
      deleteAccount: vi.fn(),
      requestPhoneOtp: vi.fn(),
      loginWithPhone: vi.fn(),
      updateProfile: vi.fn()
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

    expect(screen.getAllByText('Climate Justice Nairobi').length).toBeGreaterThanOrEqual(1);
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

    // Initial mode is Sign In (Phone & Password is the default method)
    expect(screen.getByRole('button', { name: /Sign In with Phone/i })).toBeDefined();

    // Switch to Email method in Sign In
    const emailMethodBtn = screen.getByRole('button', { name: /Email & Password/i });
    fireEvent.click(emailMethodBtn);
    expect(screen.getByRole('button', { name: /Sign In with Email/i })).toBeDefined();

    // Switch to Create Account (inherits selected email method)
    const createAccountTab = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountTab);
    expect(screen.getByRole('button', { name: /Create My Account/i })).toBeDefined();

    // Switch to Phone method in Create Account
    fireEvent.click(screen.getByRole('button', { name: /Phone & Password/i }));
    expect(screen.getByRole('button', { name: /Create Account with Phone/i })).toBeDefined();

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
    // Switch to Email registration
    fireEvent.click(screen.getByRole('button', { name: /Email & Password/i }));

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

  it('signs in using phone number and password', async () => {
    const mockLoginWithPhone = vi.fn().mockResolvedValue({ success: true });

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
      deleteAccount: vi.fn(),
      registerWithPhone: vi.fn(),
      loginWithPhone: mockLoginWithPhone,
      updateProfile: vi.fn()
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Default mode is sign in, default method is Phone & Password
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
    const mockRegisterWithPhone = vi.fn().mockResolvedValue({ 
      success: true, 
      recoveryCode: 'WXYZ-1234-ABCD-5678' 
    });

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
      deleteAccount: vi.fn(),
      registerWithPhone: mockRegisterWithPhone,
      loginWithPhone: vi.fn(),
      updateProfile: vi.fn()
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Switch to Create Account mode
    const createAccountTab = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountTab);

    // Fill phone registration form
    fireEvent.change(screen.getByPlaceholderText('e.g. Amina Wanjiku'), { target: { value: 'Amina Wanjiku' } });
    fireEvent.change(screen.getByPlaceholderText('712 345 678'), { target: { value: '0712345678' } });
    fireEvent.change(screen.getByPlaceholderText('optional.backup@example.org'), { target: { value: 'backup@example.org' } });

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'StrongPass123!' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'StrongPass123!' } });

    const consentCheckbox = screen.getByRole('checkbox');
    fireEvent.click(consentCheckbox);

    const submitBtn = screen.getByRole('button', { name: /Create Account with Phone/i });
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
      expect(screen.getByText(/Save Your Recovery Code/i)).toBeDefined();
    });
  });

  it('displays accurate error message when phone sign in fails without displaying any OTP code screens', async () => {
    const mockLoginWithPhone = vi.fn().mockResolvedValue({ 
      success: false, 
      error: 'Invalid phone number or password.' 
    });

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
      deleteAccount: vi.fn(),
      registerWithPhone: vi.fn(),
      loginWithPhone: mockLoginWithPhone,
      updateProfile: vi.fn()
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('712 345 678'), { target: { value: '0712345678' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'WrongPassword!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In with Phone/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid phone number or password.')).toBeDefined();
    });

    // Ensure no OTP code entry screen exists
    expect(screen.queryByText(/Enter 6-Digit Code/i)).toBeNull();
  });
});
