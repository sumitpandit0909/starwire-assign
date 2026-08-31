import React, { useState, useEffect } from 'react';
import { UserStats } from '../../types';

interface ProfileViewProps {
  user: UserStats;
  followingCount: number;
  watchlistCount: number;
  onUpdateUser: (updatedUser: Partial<UserStats>) => void;
  onShowToast?: (msg: string) => void;
  onNavigateFollowing: () => void;
  onNavigateWatchlist: () => void;
}

// Full-Page Shimmer Skeleton Loader for Profile
const SkeletonProfileView: React.FC = () => (
  <div className="space-y-8 animate-pulse pb-16">
    <div className="h-64 bg-[#1c1b1b] rounded-2xl relative p-6 flex flex-col justify-end">
      <div className="flex items-end gap-6">
        <div className="w-24 h-24 rounded-2xl bg-[#2a2a2a] shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-[#2a2a2a] rounded w-48" />
          <div className="h-4 bg-[#2a2a2a] rounded w-1/3" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-32 bg-[#1c1b1b] rounded-2xl p-6" />
      <div className="h-32 bg-[#1c1b1b] rounded-2xl p-6" />
    </div>

    <div className="bg-[#1c1b1b] rounded-2xl p-8 space-y-6">
      <div className="h-6 bg-[#2a2a2a] rounded w-44" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-12 bg-[#201f1f] rounded-xl" />
        <div className="h-12 bg-[#201f1f] rounded-xl" />
        <div className="h-12 bg-[#201f1f] rounded-xl" />
        <div className="h-12 bg-[#201f1f] rounded-xl" />
      </div>
    </div>
  </div>
);

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  followingCount,
  watchlistCount,
  onUpdateUser,
  onShowToast,
  onNavigateFollowing,
  onNavigateWatchlist,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Profile fields state (Only Name & Age are editable)
  const [name, setName] = useState<string>(user.userName || 'Sumit Pandit');
  const [age, setAge] = useState<string>(user.age?.toString() || '');
  const email = user.email || 'sumit.pandit@starwire.ai';
  const phone = user.phone || '+91 98765 43210';
  const avatarUrl = user.avatarUrl;

  // Age prompt modal state (Show if age is missing)
  const [showAgeModal, setShowAgeModal] = useState<boolean>(!user.age);
  const [popupAge, setPopupAge] = useState<string>('');
  const [ageError, setAgeError] = useState<string>('');

  // Sync state if user prop changes
  useEffect(() => {
    setName(user.userName || 'Sumit Pandit');
    if (user.age) {
      setAge(user.age.toString());
      setShowAgeModal(false);
    } else {
      setShowAgeModal(true);
    }
  }, [user]);

  // Security password fields state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');

  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);

  // Handle Save Age from Popup
  const handleSaveAgeFromPopup = (e: React.FormEvent) => {
    e.preventDefault();
    setAgeError('');
    if (!popupAge || isNaN(Number(popupAge)) || Number(popupAge) <= 0 || Number(popupAge) > 120) {
      setAgeError('Please enter a valid age between 1 and 120.');
      return;
    }

    const parsedAge = parseInt(popupAge, 10);
    setAge(popupAge);
    onUpdateUser({ age: parsedAge });
    setShowAgeModal(false);
    if (onShowToast) {
      onShowToast('Age saved successfully!');
    }
  };

  // Handle Profile Details Submit (Name & Age)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    setTimeout(() => {
      onUpdateUser({
        userName: name,
        age: age ? parseInt(age, 10) : undefined,
      });
      setSavingProfile(false);
      if (onShowToast) {
        onShowToast('Profile information saved successfully!');
      }
    }, 400);
  };

  // Handle Update Password Submit
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Security credentials & password updated successfully!');
      if (onShowToast) {
        onShowToast('Password updated successfully!');
      }
    }, 500);
  };

  if (loading) {
    return <SkeletonProfileView />;
  }

  return (
    <div id="user-profile-view-container" className="space-y-10 animate-fade-in pb-16 relative">
      {/* Age Prompt Modal (Triggers when age is missing) */}
      {showAgeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border-2 border-[#f2ca50] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30 shrink-0">
                <span className="material-symbols-outlined text-[24px]">cake</span>
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] font-bold">
                  Complete Profile Details
                </h3>
                <p className="text-xs text-[#d0c5af] font-mono">Step 2 of Account Setup</p>
              </div>
            </div>

            <p className="text-xs text-[#FAF9F6]/90 font-light leading-relaxed">
              We noticed your age is missing from your account dossier. Please enter your age to personalize your experience.
            </p>

            {ageError && (
              <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono">
                ⚠️ {ageError}
              </div>
            )}

            <form onSubmit={handleSaveAgeFromPopup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider block font-bold">
                  Enter Your Age
                </label>
                <input
                  type="number"
                  value={popupAge}
                  onChange={(e) => setPopupAge(e.target.value)}
                  placeholder="e.g. 28"
                  min="1"
                  max="120"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#f2ca50]/50 text-[#FAF9F6] focus:border-[#f2ca50] focus:outline-none font-mono text-base"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAgeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#4d4635]/40 text-[#d0c5af] hover:text-[#FAF9F6] text-xs font-mono transition-colors cursor-pointer"
                >
                  Skip for Now
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  Save Age &amp; Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4d4635]/25 pb-6">
        <div>
          <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight">
            Account Dossier &amp; Profile Settings
          </h1>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Manage your personal credentials, security preferences, and view platform subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1c1b1b] px-4 py-2 rounded-xl border border-[#f2ca50]/30 text-xs font-mono">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified_user</span>
          <span className="text-[#FAF9F6] font-bold">{user.membershipLevel || 'Elite Terminal Access'}</span>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl overflow-hidden shadow-xl relative p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#f2ca50]/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative group cursor-pointer">
            <img
              src={avatarUrl}
              alt={name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-[#f2ca50] shadow-2xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
              }}
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-xs font-mono font-bold">
                ACTIVE MEMBER
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#201f1f] text-[#d0c5af] border border-[#4d4635]/40 text-xs font-mono">
                ID #SW-99824
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] font-bold">
              {name}
            </h2>
            <p className="text-xs font-mono text-[#d0c5af]">{user.userRole}</p>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards (Following & Bookmarks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Following Card */}
        <div
          onClick={onNavigateFollowing}
          className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl p-6 flex items-center justify-between transition-all group cursor-pointer shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f2ca50]/15 text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px]">group</span>
            </div>
            <div>
              <span className="text-xs font-mono text-[#99907c] uppercase tracking-wider block font-bold">
                Actively Followed Talent
              </span>
              <div className="text-2xl font-bold font-mono text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">
                {followingCount} Stars
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-[#f2ca50] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Following</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </div>
        </div>

        {/* Bookmarks Card */}
        <div
          onClick={onNavigateWatchlist}
          className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl p-6 flex items-center justify-between transition-all group cursor-pointer shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px]">bookmark</span>
            </div>
            <div>
              <span className="text-xs font-mono text-[#99907c] uppercase tracking-wider block font-bold">
                Saved Executive Briefs
              </span>
              <div className="text-2xl font-bold font-mono text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">
                {watchlistCount} Articles
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-[#f2ca50] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Watchlist</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Personal Details Form (Name & Age are editable; Email & Phone are read-only) */}
      <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="border-b border-[#4d4635]/30 pb-4 flex justify-between items-center">
          <h3 className="font-headline-md text-xl text-[#FAF9F6] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">person</span>
            <span>Personal Information</span>
          </h3>
          <span className="text-xs font-mono text-[#10B981]">Name &amp; Age Editable</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name (EDITABLE) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider block font-bold">
                  Full Name
                </label>
                <span className="text-[10px] font-mono text-[#f2ca50]">Editable</span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] focus:outline-none font-mono text-sm"
                placeholder="Enter full name"
              />
            </div>

            {/* Age (EDITABLE) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider block font-bold">
                  Age
                </label>
                <span className="text-[10px] font-mono text-[#f2ca50]">Editable</span>
              </div>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="120"
                className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] focus:outline-none font-mono text-sm"
              />
            </div>

            {/* Email Address (NON-EDITABLE) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#99907c] uppercase tracking-wider block font-bold">
                  Email Address
                </label>
                <span className="text-[10px] font-mono text-[#99907c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Fixed Account Email
                </span>
              </div>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full px-4 py-3 rounded-xl bg-[#131313]/60 border border-[#4d4635]/20 text-[#99907c] font-mono text-sm cursor-not-allowed opacity-80"
              />
            </div>

            {/* Phone Number (NON-EDITABLE) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#99907c] uppercase tracking-wider block font-bold">
                  Phone Number
                </label>
                <span className="text-[10px] font-mono text-[#99907c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Fixed Mobile No.
                </span>
              </div>
              <input
                type="tel"
                value={phone}
                readOnly
                disabled
                className="w-full px-4 py-3 rounded-xl bg-[#131313]/60 border border-[#4d4635]/20 text-[#99907c] font-mono text-sm cursor-not-allowed opacity-80"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 rounded-xl bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Update Form */}
      <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="border-b border-[#4d4635]/30 pb-4 flex justify-between items-center">
          <h3 className="font-headline-md text-xl text-[#FAF9F6] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">lock</span>
            <span>Security &amp; Password Update</span>
          </h3>
          <span className="text-xs font-mono text-[#d0c5af]">Encrypted Authentication</span>
        </div>

        {passwordError && (
          <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono">
            ⚠️ {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-mono">
            ✓ {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider block font-bold">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] focus:outline-none font-mono text-sm"
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider block font-bold">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] focus:outline-none font-mono text-sm"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider block font-bold">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#4d4635]/40 text-[#FAF9F6] focus:border-[#f2ca50] focus:outline-none font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="px-6 py-3 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-bold text-xs uppercase tracking-wider transition-all border border-[#4d4635]/40 flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>{updatingPassword ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
