import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  User,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  HardDrive,
  Database,
} from 'lucide-react';
import saBrothersLogo from '../../assets/images/sa_brothers_logo.jpg';

export const LoginScreen: React.FC = () => {
  const { login, settings, profiles } = useShop();

  const [selectedRole, setSelectedRole] = useState<'owner' | 'staff'>('owner');
  const [username, setUsername] = useState<string>('owner');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ownerProfile = profiles.find((p) => p.role === 'owner');

  const handleSelectRole = (role: 'owner' | 'staff') => {
    setSelectedRole(role);
    setUsername(role);
    setPassword('');
    setErrorMessage(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setErrorMessage(null);

    const trimmedPass = password.trim();
    if (!trimmedPass) {
      setErrorMessage(
        selectedRole === 'owner'
          ? 'Please enter your Owner password.'
          : 'Please enter your Staff password.'
      );
      return;
    }

    const trimmedUser = username.trim() || selectedRole;
    const result = login(trimmedUser, trimmedPass);
    if (!result.success) {
      setErrorMessage(result.message || 'Invalid password.');
    }
  };

  const handleKeypadPress = (val: string) => {
    setPassword((prev) => prev + val);
    setErrorMessage(null);
  };

  const handleBackspace = () => {
    setPassword((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Background subtle glow aesthetics */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Branding Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-500 to-amber-200 shadow-lg flex items-center justify-center overflow-hidden">
            <img
              src={saBrothersLogo}
              alt="SA Brothers Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <span>{settings.shopName || 'SA Brothers Vendors'}</span>
            </h1>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              Court Stamp Vendors, Legal Paper &amp; Stationery
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Point of Sale &amp; Offline Retail Inventory
            </p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 border border-slate-700/60 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => handleSelectRole('owner')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'owner'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span>👑</span>
            <span>Shop Owner</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('staff')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'staff'
                ? 'bg-blue-600 text-white shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span>👤</span>
            <span>Staff Cashier</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selected Role Badge / Description */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
            {selectedRole === 'owner' ? (
              <div className="space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Owner Administration Access</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Full control: stock inventory, supplier prices, daily profit reports, expenses, and settings.
                </p>
                <div className="text-[11px] text-amber-400/90 pt-1 font-medium border-t border-slate-700/60">
                  <span>🔒 Only the password configured in Store Settings is accepted (Initial: 1080).</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>Staff Cashier Counter Access</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Counter mode: register sales, print receipts &amp; record expenses. Stock and profit reports are hidden.
                </p>
              </div>
            )}
          </div>

          {/* Username Input (Hidden or Compact) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Username / Role</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage(null);
              }}
              placeholder={selectedRole === 'owner' ? 'owner' : 'staff'}
              className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>

          {/* Password / PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {selectedRole === 'owner' ? 'Owner Password / PIN' : 'Staff Password / PIN'}
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder={
                  selectedRole === 'owner'
                    ? 'Enter Owner password'
                    : 'Enter Staff password'
                }
                className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick Touch Keypad for touchscreen counter use */}
          <div className="pt-1">
            <div className="text-[10px] text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Quick Touch Keypad:</span>
              <button
                type="button"
                onClick={() => setPassword('')}
                className="text-amber-400 hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-mono font-bold text-sm rounded-lg border border-slate-700/60 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700/60"
              >
                ⌫ Del
              </button>
              <button
                type="button"
                onClick={() => setPassword('')}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700/60"
                title="Clear input"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            onClick={() => handleSubmit()}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In as {selectedRole === 'owner' ? 'Owner' : 'Staff'}</span>
          </button>
        </form>
      </div>

      {/* Footer Offline Database Notice */}
      <div className="text-center text-[11px] text-slate-500 mt-6 space-y-1">
        <p className="flex items-center justify-center gap-1.5 font-medium text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Proper Offline Database Engine (IndexedDB + Hard Disk Storage)</span>
        </p>
        <p>All stock, sales, expenses, and passwords survive power cuts, restarts, and offline mode</p>
      </div>
    </div>
  );
};
