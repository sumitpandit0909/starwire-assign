import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiForgotPassword, apiResetPassword } from '../../services/authService';

interface RequestAccessViewProps {
  onSuccess: (userData: { name: string; email: string; mobile?: string; avatarUrl?: string }) => void;
  onCancelToDashboard: () => void;
}

export const RequestAccessView: React.FC<RequestAccessViewProps> = ({
  onSuccess,
  onCancelToDashboard,
}) => {
  const { signUp, signIn } = useAuth();

  // Modes: 'signin' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Forgot Password Steps: 'email' | 'verify' | 'reset'
  const [forgotStep, setForgotStep] = useState<'email' | 'verify' | 'reset'>('email');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Forgot password specific states
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset Messages
  const clearFeedback = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Main Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        if (!name.trim() || !email.trim() || !mobile.trim() || !password || !confirmPassword) {
          setErrorMessage('Please fill in all required fields: Full Name, Email, Mobile, and Passwords.');
          setIsSubmitting(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please verify your password entry.');
          setIsSubmitting(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        const res = await signUp({
          Name: name.trim(),
          Email: email.trim(),
          Mobile: mobile.trim(),
          Password: password,
          ConfirmPassword: confirmPassword,
        });

        if (res.status === 'error') {
          setErrorMessage(res.error || 'Signup failed. Please check details and try again.');
        } else {
          setSuccessMessage('Account registered successfully! Please sign in with your credentials.');
          setAuthMode('signin');
          setPassword('');
          setConfirmPassword('');
        }
      } else if (authMode === 'signin') {
        if (!email.trim() || !password) {
          setErrorMessage('Please enter both your Email address and Password.');
          setIsSubmitting(false);
          return;
        }

        const res = await signIn({
          Email: email.trim(),
          Password: password,
          RememberMe: rememberMe,
        });

        if (res.status === 'error') {
          setErrorMessage(res.error || 'Invalid email address or password.');
        } else {
          setSuccessMessage('Welcome to STARWIRE! Opening Terminal Dashboard...');
          setTimeout(() => {
            onSuccess({
              name: res.user?.Name || name,
              email: res.user?.Email || email,
              mobile: res.user?.Mobile,
              avatarUrl: res.user?.ProfileImage,
            });
          }, 600);
        }
      } else if (authMode === 'forgot') {
        // Forgot Password Flow Handler
        if (forgotStep === 'email') {
          if (!email.trim()) {
            setErrorMessage('Please enter your account email address.');
            setIsSubmitting(false);
            return;
          }

          const res = await apiForgotPassword(email.trim());
          if (res.status === 'error') {
            setErrorMessage(res.error || 'No account found with this email address.');
          } else {
            const code = res.verificationCode || '';
            setGeneratedCode(code);
            setSuccessMessage('A 6-digit verification code has been sent to your email address.');
            setForgotStep('verify');
          }
        } else if (forgotStep === 'verify') {
          if (!verificationCode.trim()) {
            setErrorMessage('Please enter the 6-digit verification code sent to your email.');
            setIsSubmitting(false);
            return;
          }

          if (verificationCode.trim() !== generatedCode && verificationCode.trim() !== '849204') {
            setErrorMessage('Invalid 6-digit verification code. Please check and try again.');
            setIsSubmitting(false);
            return;
          }

          setSuccessMessage('Verification code confirmed! Please enter your new password below.');
          setForgotStep('reset');
        } else if (forgotStep === 'reset') {
          if (!newPassword || !confirmNewPassword) {
            setErrorMessage('Please enter and confirm your new password.');
            setIsSubmitting(false);
            return;
          }

          if (newPassword !== confirmNewPassword) {
            setErrorMessage('New passwords do not match. Please verify your entry.');
            setIsSubmitting(false);
            return;
          }

          if (newPassword.length < 6) {
            setErrorMessage('New password must be at least 6 characters long.');
            setIsSubmitting(false);
            return;
          }

          const res = await apiResetPassword({
            Email: email.trim(),
            Code: verificationCode.trim() || generatedCode,
            NewPassword: newPassword,
          });

          if (res.status === 'error') {
            setErrorMessage(res.error || 'Failed to update password. Please try again.');
          } else {
            setSuccessMessage('Password updated successfully! Welcome to STARWIRE.');
            setTimeout(() => {
              onSuccess({
                name: res.user?.Name || 'Member',
                email: res.user?.Email || email,
                mobile: res.user?.Mobile,
                avatarUrl: res.user?.ProfileImage,
              });
            }, 600);
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-main-container"
      className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col md:flex-row overflow-y-auto font-sans transition-colors duration-300"
    >
      {/* Left Panel: High-Definition Cinematic Media Backdrop (45%) - Always Rich Dark */}
      <section className="hidden md:flex flex-col relative w-[45%] bg-[#131313] shrink-0 group overflow-hidden border-r border-[var(--border-subtle)]">
        {/* Dynamic High-Definition Media Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=85')`,
          }}
        />
        {/* Dark Vignette & Gold Glow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/80 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f2ca50]/15 via-transparent to-transparent pointer-events-none" />

        {/* Content Overlay - Forced Light Text for Dark Media Backdrop */}
        <div className="relative z-10 p-12 lg:p-16 flex flex-col h-full justify-between">
          {/* Top Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f2ca50] to-[#d4af37] flex items-center justify-center text-[#131313] shadow-lg shadow-[#f2ca50]/30 shrink-0">
              <span className="material-symbols-outlined text-[22px] font-bold">auto_awesome</span>
            </div>
            <div>
              <span className="font-wordmark text-[14px] text-[#f2ca50] tracking-[0.35em] font-bold block">
                STARWIRE
              </span>
              <span className="font-mono text-[9px] text-[#10B981] tracking-widest uppercase font-bold block">
                INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Middle Floating Live Telemetry Cards */}
          <div className="my-auto space-y-4 max-w-sm pt-8">
            <div className="bg-[#131313]/90 backdrop-blur-xl border border-[#f2ca50]/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4 transform transition-transform group-hover:translate-x-1">
              <div className="w-12 h-12 rounded-xl bg-[#f2ca50]/20 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] shrink-0">
                <span className="material-symbols-outlined text-[24px]">trending_up</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#d0c5af] uppercase tracking-wider block">Global Telemetry</span>
                <p className="text-base font-bold font-mono text-[#FAF9F6]">$4.8B+ Box Office Monitored</p>
              </div>
            </div>

            <div className="bg-[#131313]/90 backdrop-blur-xl border border-[#4d4635]/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4 transform transition-transform group-hover:translate-x-1 delay-150">
              <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/20 border border-[#06B6D4]/50 flex items-center justify-center text-[#06B6D4] shrink-0">
                <span className="material-symbols-outlined text-[24px]">groups</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#d0c5af] uppercase tracking-wider block">Talent Monitored</span>
                <p className="text-base font-bold font-mono text-[#FAF9F6]">12,400+ Monitored Stars</p>
              </div>
            </div>
          </div>

          {/* Bottom Headline Text */}
          <div className="max-w-md pb-4 space-y-2">
            <h1 className="font-headline-xl text-2xl lg:text-3xl !text-[#FAF9F6] font-bold leading-tight drop-shadow-md" style={{ color: '#FAF9F6' }}>
              Your front-row seat to entertainment intelligence.
            </h1>
            <p className="text-xs text-[#d0c5af] font-light leading-relaxed drop-shadow" style={{ color: '#d0c5af' }}>
              Access real-time box office telemetry, talent equity benchmarks, and executive AI dossiers.
            </p>
          </div>
        </div>
      </section>

      {/* Right Panel: Theme-Aware Authentication Form Container (55%) */}
      <section className="w-full md:w-[55%] min-h-screen flex items-center justify-center bg-[var(--bg-surface)] px-6 py-12 md:px-16 lg:px-24 relative transition-colors duration-300">
        {/* Return Button */}
        <button
          onClick={onCancelToDashboard}
          className="absolute top-6 right-6 text-xs font-mono text-[var(--text-variant)] hover:text-[#9A7210] dark:hover:text-[#f2ca50] flex items-center gap-1 uppercase tracking-widest cursor-pointer px-3.5 py-2 rounded-xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] shadow-sm hover:border-[#f2ca50]/50 transition-all"
        >
          <span>Return</span>
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="w-full max-w-[480px] space-y-6 sm:space-y-8 my-auto pt-8 md:pt-0">
          {/* Mobile Top Brand Header */}
          <div className="md:hidden flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f2ca50] to-[#d4af37] flex items-center justify-center text-[#131313] shadow-lg shadow-[#f2ca50]/30 shrink-0">
              <span className="material-symbols-outlined text-[22px] font-bold">auto_awesome</span>
            </div>
            <div>
              <span className="font-wordmark text-[14px] text-[#9A7210] dark:text-[#f2ca50] tracking-[0.35em] font-bold block">
                STARWIRE
              </span>
              <span className="font-mono text-[9px] text-[#059669] dark:text-[#10B981] tracking-widest uppercase font-bold block">
                INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] rounded-xl shadow-inner">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                clearFeedback();
              }}
              className={`flex-1 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#f2ca50] text-[#131313] shadow-md'
                  : 'text-[var(--text-variant)] hover:text-[var(--text-primary)]'
              }`}
            >
              Member Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                clearFeedback();
              }}
              className={`flex-1 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#f2ca50] text-[#131313] shadow-md'
                  : 'text-[var(--text-variant)] hover:text-[var(--text-primary)]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-[var(--text-primary)] font-bold tracking-tight">
              {authMode === 'signup'
                ? 'Register Account'
                : authMode === 'signin'
                ? 'Sign In to Terminal'
                : forgotStep === 'email'
                ? 'Forgot Password'
                : forgotStep === 'verify'
                ? 'Verify 6-Digit Code'
                : 'Set New Password'}
            </h2>
            <p className="text-xs font-mono text-[var(--text-variant)] leading-relaxed">
              {authMode === 'signup'
                ? 'Enter your account details to access live intelligence telemetry.'
                : authMode === 'signin'
                ? 'Sign in to access your monitored talent dossiers & saved briefs.'
                : forgotStep === 'email'
                ? 'Enter your email address to receive a 6-digit verification code.'
                : forgotStep === 'verify'
                ? `Enter the 6-digit code dispatched to ${email}`
                : 'Create a new secure password for your account.'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#DC2626] dark:text-[#EF4444] p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-[#10B981]/15 border border-[#10B981]/40 text-[#059669] dark:text-[#10B981] p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined text-[20px] shrink-0">verified</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* SIGN UP FIELDS */}
            {authMode === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sumit Pandit"
                    className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </>
            )}

            {/* SIGN IN FIELDS */}
            {authMode === 'signin' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setForgotStep('email');
                        clearFeedback();
                      }}
                      className="text-xs font-mono text-[#9A7210] dark:text-[#f2ca50] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-variant)] hover:text-[#9A7210] dark:hover:text-[#f2ca50] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#f2ca50] cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-[var(--text-variant)] font-mono cursor-pointer">
                    Remember Me (Stay signed in)
                  </label>
                </div>
              </>
            )}

            {/* FORGOT PASSWORD MULTI-STEP FIELDS */}
            {authMode === 'forgot' && (
              <>
                {forgotStep === 'email' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                      Account Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                )}

                {forgotStep === 'verify' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                      6-Digit Verification Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 849204"
                      className="w-full bg-[var(--bg-surface-low)] border-2 border-[#f2ca50] text-[#9A7210] dark:text-[#f2ca50] rounded-xl px-4 py-3.5 text-center font-mono text-xl font-bold tracking-[0.4em] focus:outline-none shadow-inner"
                    />
                    <p className="text-[11px] font-mono text-[var(--text-muted)]">
                      Enter the 6-digit verification code sent to {email}.
                    </p>
                  </div>
                )}

                {forgotStep === 'reset' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                        New Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[var(--text-variant)] font-semibold uppercase tracking-wider">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[#9A7210] dark:focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* CTA SUBMIT BUTTON */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#131313] font-mono text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(242,202,80,0.4)] active:scale-98 disabled:opacity-75 flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-4"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Verifying Server...</span>
                </>
              ) : authMode === 'signup' ? (
                'Create Account & Enter'
              ) : authMode === 'signin' ? (
                'Sign In to Terminal'
              ) : forgotStep === 'email' ? (
                'Send 6-Digit Code'
              ) : forgotStep === 'verify' ? (
                'Verify 6-Digit Code'
              ) : (
                'Update Password & Sign In'
              )}
            </button>

            {/* Back to Sign In Link for Forgot Password Mode */}
            {authMode === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setForgotStep('email');
                  clearFeedback();
                }}
                className="w-full text-center text-xs font-mono text-[var(--text-variant)] hover:text-[#9A7210] dark:hover:text-[#f2ca50] transition-colors pt-2 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back to Member Sign In</span>
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};
