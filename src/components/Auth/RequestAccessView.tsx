import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiForgotPassword } from '../../services/authService';

interface RequestAccessViewProps {
  onSuccess: (userData: { name: string; email: string; mobile?: string; avatarUrl?: string }) => void;
  onCancelToDashboard: () => void;
}

export const RequestAccessView: React.FC<RequestAccessViewProps> = ({
  onSuccess,
  onCancelToDashboard,
}) => {
  const { signUp, signIn } = useAuth();

  // Modes: 'signup' | 'signin' | 'forgot'
  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'forgot'>('signup');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states - Empty by default
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        // Validation
        if (!name.trim() || !email.trim() || !mobile.trim() || !password || !confirmPassword) {
          setErrorMessage('Please fill in all required fields.');
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

        // Send Sign Up request to backend MongoDB server
        const res = await signUp({
          Name: name.trim(),
          Email: email.trim(),
          Mobile: mobile.trim(),
          Password: password,
          ConfirmPassword: confirmPassword,
        });

        if (res.status === 'error') {
          setErrorMessage(res.error || 'Signup failed. Please try again.');
        } else {
          setSuccessMessage('Account registered in MongoDB! Please sign in with your credentials to enter terminal.');
          // Transition to Sign In mode with registered email prefilled
          setAuthMode('signin');
          setPassword('');
          setConfirmPassword('');
        }
      } else if (authMode === 'signin') {
        if (!email.trim() || !password) {
          setErrorMessage('Please enter both your Email and Password.');
          setIsSubmitting(false);
          return;
        }

        // Send Sign In request to backend MongoDB server
        const res = await signIn({
          Email: email.trim(),
          Password: password,
          RememberMe: rememberMe,
        });

        if (res.status === 'error') {
          setErrorMessage(res.error || 'Invalid email or password.');
        } else {
          setSuccessMessage('Welcome to STARWIRE! Opening Terminal Dashboard...');
          setTimeout(() => {
            onSuccess({
              name: res.user?.Name || name,
              email: res.user?.Email || email,
              mobile: res.user?.Mobile,
              avatarUrl: res.user?.ProfileImage,
            });
          }, 800);
        }
      } else if (authMode === 'forgot') {
        if (!email.trim()) {
          setErrorMessage('Please enter your account email address.');
          setIsSubmitting(false);
          return;
        }

        const res = await apiForgotPassword(email.trim());
        if (res.status === 'error') {
          setErrorMessage(res.error || 'Could not process request.');
        } else {
          setSuccessMessage(res.message || 'Password reset instructions sent to your email address.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="auth-main-container" className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#131313] text-[#e5e2e1] -mt-8 -mx-4 md:-mx-12">
      {/* Left Panel: Cinematic Backdrop (45%) */}
      <section className="hidden md:flex flex-col relative w-[45%] h-full bg-[#353534] shrink-0 group overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTAh3kuD59JOVx2j_oqzQJUe3zZioEmEAFUuAeq6y6uSXB-kK29tUUBWWPLMlsEjAbX4WcglNdmaPVNLd9upaFThaaJLdtUxFTToiyF-Ueu7Fz9mSpXCA5aZ9h6Nd6QVkMwo6v943e9paHxW6egxHMzJMmiKuVbub8jBkEoo6JynP9CBNr82vGbMm3j_pjume7YW8UBnt8J09NYyRVYgrJrEjhcQLlRANaBwHegnWeTtIku_Ubwg0IAg')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent" />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />

        {/* Content */}
        <div className="relative z-10 p-12 lg:p-16 flex flex-col h-full justify-between">
          {/* Brand Anchor */}
          <div className="flex items-center space-x-3">
            <span className="font-wordmark text-[14px] text-[#f2ca50] tracking-[0.4em] font-semibold">
              STARWIRE INTELLIGENCE
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="font-data-label text-[11px] text-[#10B981] tracking-[0.2em] uppercase font-bold">
              MONGODB CONNECTED
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-md pb-8">
            <h1 className="font-headline-xl text-[44px] lg:text-headline-xl text-[#FAF9F6] mb-6 leading-tight">
              Your front-row seat to entertainment intelligence.
            </h1>
            <p className="font-body-lg text-[16px] lg:text-[18px] text-[#d0c5af] max-w-sm font-light">
              Access real-time box office telemetry, talent equity benchmarks, and insider dossiers.
            </p>
          </div>
        </div>
      </section>

      {/* Right Panel: Authentication Form (55%) */}
      <section className="w-full md:w-[55%] h-full overflow-y-auto flex items-center justify-center bg-[#131313] px-6 py-12 md:px-16 lg:px-24 relative">
        {/* Return Button */}
        <button
          onClick={onCancelToDashboard}
          className="absolute top-6 right-6 text-xs font-mono text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1 uppercase tracking-widest cursor-pointer"
        >
          <span>Return</span>
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Mobile Brand Header */}
        <div className="md:hidden absolute top-8 left-6 right-6 flex items-center justify-center space-x-2">
          <span className="font-wordmark text-[14px] text-[#f2ca50] tracking-[0.4em] font-semibold">
            STARWIRE
          </span>
        </div>

        <div className="w-full max-w-[480px] space-y-8 animate-fade-in-up">
          {/* Form Header */}
          <div className="space-y-3">
            <h2
              id="auth-form-heading"
              className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#FAF9F6]"
            >
              {authMode === 'signup'
                ? 'Create Member Account'
                : authMode === 'signin'
                ? 'Member Sign In'
                : 'Forgot Password'}
            </h2>
            <p className="font-body-md text-body-md text-[#d0c5af] font-light">
              {authMode === 'signup'
                ? 'Register your account to access live terminal telemetry & MongoDB persistence.'
                : authMode === 'signin'
                ? 'Sign in to access your monitored talent dossiers & saved briefs.'
                : 'Enter your account email address to receive password recovery instructions.'}
            </p>
          </div>

          {/* Error & Success Banners */}
          {errorMessage && (
            <div className="bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] px-4 py-3 rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] px-4 py-3 rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {authMode === 'signup' && (
                /* Full Name */
                <div className="relative group">
                  <label
                    htmlFor="fullName"
                    className="block font-data-label text-[11px] text-[#d0c5af] group-focus-within:text-[#f2ca50] mb-1 uppercase tracking-widest transition-colors"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input-underline w-full"
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email Address */}
              <div className="relative group">
                <label
                  htmlFor="email"
                  className="block font-data-label text-[11px] text-[#d0c5af] group-focus-within:text-[#f2ca50] mb-1 uppercase tracking-widest transition-colors"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-underline w-full"
                  autoComplete="email"
                />
              </div>

              {authMode === 'signup' && (
                /* Mobile Number */
                <div className="relative group">
                  <label
                    htmlFor="mobile"
                    className="block font-data-label text-[11px] text-[#d0c5af] group-focus-within:text-[#f2ca50] mb-1 uppercase tracking-widest transition-colors"
                  >
                    Mobile Number *
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="input-underline w-full"
                    autoComplete="tel"
                  />
                </div>
              )}

              {authMode !== 'forgot' && (
                /* Password */
                <div className="relative group">
                  <label
                    htmlFor="password"
                    className="block font-data-label text-[11px] text-[#d0c5af] group-focus-within:text-[#f2ca50] mb-1 uppercase tracking-widest transition-colors flex justify-between items-center"
                  >
                    <span>Password *</span>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[#f2ca50] hover:underline normal-case font-sans text-xs tracking-normal cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="input-underline w-full pr-10"
                      autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors pb-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {authMode === 'signup' && (
                /* Confirm Password */
                <div className="relative group">
                  <label
                    htmlFor="confirmPassword"
                    className="block font-data-label text-[11px] text-[#d0c5af] group-focus-within:text-[#f2ca50] mb-1 uppercase tracking-widest transition-colors"
                  >
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="input-underline w-full"
                    autoComplete="new-password"
                  />
                </div>
              )}

              {authMode === 'signin' && (
                /* Remember Me Option */
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#f2ca50] cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-[#d0c5af] cursor-pointer">
                    Remember Me (Stay signed in for 30 days)
                  </label>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-2 space-y-4">
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f2ca50] text-[#1A1A1A] font-data-value text-[14px] font-bold uppercase tracking-widest py-4 rounded-lg transition-all duration-300 btn-glow hover:bg-[#ffe088] active:scale-98 disabled:opacity-75 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      progress_activity
                    </span>
                    <span>Connecting to Server...</span>
                  </>
                ) : authMode === 'signup' ? (
                  'Complete Registration'
                ) : authMode === 'signin' ? (
                  'Sign In to Terminal'
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {/* Navigation Mode Switcher */}
              <div className="text-center space-y-2">
                {authMode === 'signup' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-body-md text-[14px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors border-b border-transparent hover:border-[#f2ca50] pb-0.5 inline-flex items-center group cursor-pointer"
                  >
                    <span>Already registered? Sign In</span>
                    <span className="material-symbols-outlined ml-1.5 text-[16px] transform group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                )}

                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-body-md text-[14px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors border-b border-transparent hover:border-[#f2ca50] pb-0.5 inline-flex items-center group cursor-pointer"
                  >
                    <span>Need an account? Create Account</span>
                    <span className="material-symbols-outlined ml-1.5 text-[16px] transform group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                )}

                {authMode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-body-md text-[14px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors inline-flex items-center group cursor-pointer"
                  >
                    <span className="material-symbols-outlined mr-1.5 text-[16px]">arrow_back</span>
                    <span>Back to Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Legal */}
          <p className="font-data-label text-[11px] text-[#d0c5af]/50 text-center max-w-xs mx-auto leading-relaxed">
            Protected by STARWIRE MongoDB Security protocols.{' '}
            <a href="#" className="hover:text-[#f2ca50] transition-colors underline decoration-[#d0c5af]/30">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="hover:text-[#f2ca50] transition-colors underline decoration-[#d0c5af]/30">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
};
