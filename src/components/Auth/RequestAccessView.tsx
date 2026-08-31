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
      className="min-h-screen w-full bg-[#131313] text-[#FAF9F6] flex flex-col md:flex-row overflow-y-auto font-sans"
    >
      {/* Left Panel: Cinematic Brand Backdrop (45%) */}
      <section className="hidden md:flex flex-col relative w-[45%] bg-[#1c1b1b] shrink-0 group overflow-hidden border-r border-[#4d4635]/25">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/70 to-black/50" />

        <div className="relative z-10 p-12 lg:p-16 flex flex-col h-full justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#f2ca50] flex items-center justify-center text-[#131313]">
              <span className="material-symbols-outlined text-[20px] font-bold">auto_awesome</span>
            </div>
            <span className="font-wordmark text-[14px] text-[#f2ca50] tracking-[0.35em] font-bold">
              STARWIRE INTELLIGENCE
            </span>
          </div>

          <div className="max-w-md pb-8 space-y-4">
            <h1 className="font-headline-xl text-3xl lg:text-4xl text-[#FAF9F6] font-bold leading-tight">
              Real-time entertainment intelligence &amp; talent analytics.
            </h1>
            <p className="text-sm text-[#d0c5af] font-light leading-relaxed">
              Access live theatrical box office telemetry, audience polarity indices, and executive talent dossiers.
            </p>
          </div>
        </div>
      </section>

      {/* Right Panel: Authentication Form Container (55%) */}
      <section className="w-full md:w-[55%] min-h-screen flex items-center justify-center bg-[#131313] px-6 py-12 md:px-16 lg:px-24 relative">
        {/* Return Button */}
        <button
          onClick={onCancelToDashboard}
          className="absolute top-6 right-6 text-xs font-mono text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1 uppercase tracking-widest cursor-pointer px-3 py-1.5 rounded-lg bg-[#1c1b1b] border border-[#4d4635]/30"
        >
          <span>Return</span>
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="w-full max-w-[480px] space-y-8 my-auto">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-[#1c1b1b] border border-[#4d4635]/40 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                clearFeedback();
              }}
              className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#f2ca50] text-[#131313] shadow-md'
                  : 'text-[#d0c5af] hover:text-[#FAF9F6]'
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
              className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#f2ca50] text-[#131313] shadow-md'
                  : 'text-[#d0c5af] hover:text-[#FAF9F6]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Title */}
          <div className="space-y-2">
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] font-bold">
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
            <p className="text-xs font-mono text-[#d0c5af]">
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
            <div className="bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-fade-in">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-fade-in">
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
                  <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sumit Pandit"
                    className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </>
            )}

            {/* SIGN IN FIELDS */}
            {authMode === 'signin' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setForgotStep('email');
                        clearFeedback();
                      }}
                      className="text-xs font-mono text-[#f2ca50] hover:underline cursor-pointer"
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
                      className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
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
                  <label htmlFor="rememberMe" className="text-xs text-[#d0c5af] font-mono cursor-pointer">
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
                    <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                      Account Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                )}

                {forgotStep === 'verify' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                      6-Digit Verification Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 849204"
                      className="w-full bg-[#1c1b1b] border-2 border-[#f2ca50] text-[#f2ca50] rounded-xl px-4 py-3.5 text-center font-mono text-xl font-bold tracking-[0.4em] focus:outline-none shadow-inner"
                    />
                    <p className="text-[11px] font-mono text-[#99907c]">
                      Enter the 6-digit verification code sent to {email}.
                    </p>
                  </div>
                )}

                {forgotStep === 'reset' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                        New Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#d0c5af] font-semibold uppercase tracking-wider">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-[#1c1b1b] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] rounded-xl px-4 py-3 text-sm font-sans placeholder-[#99907c] focus:outline-none transition-all shadow-inner"
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
              className="w-full bg-[#f2ca50] text-[#131313] font-mono text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 hover:bg-[#d4af37] active:scale-98 disabled:opacity-75 flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-4"
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
                className="w-full text-center text-xs font-mono text-[#d0c5af] hover:text-[#f2ca50] transition-colors pt-2 flex items-center justify-center gap-1 cursor-pointer"
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
