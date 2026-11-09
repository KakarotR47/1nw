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
  MonitorDown,
} from 'lucide-react';
import saBrothersLogo from '../../assets/images/sa_brothers_logo.jpg';

export const LoginScreen: React.FC = () => {
  const { login, settings } = useShop();

  const [username, setUsername] = useState<string>('staff');
  const [password, setPassword] = useState<string>('staff');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRoleHint, setSelectedRoleHint] = useState<'staff' | 'owner'>('staff');

  const handleSelectRole = (role: 'staff' | 'owner') => {
    setSelectedRoleHint(role);
    if (role === 'staff') {
      setUsername('staff');
      setPassword('staff');
    } else {
      setUsername('owner');
      setPassword('owner');
    }
    setErrorMessage(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setErrorMessage(null);

    const trimmedUser = username.trim() || selectedRoleHint;
    const trimmedPass = password.trim();

    const result = login(trimmedUser, trimmedPass);
    if (!result.success) {
      setErrorMessage(result.message || 'Invalid username or password/PIN');
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
        <div className="text-center space-y-3 mb-5">
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
              {settings.tagline || 'Court Stamp Vendors, Legal Paper & Stationery'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Point of Sale &amp; Retail Inventory Management
            </p>
          </div>
        </div>

        {/* Quick Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => handleSelectRole('staff')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoleHint === 'staff'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Staff Cashier</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectRole('owner')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoleHint === 'owner'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Shop Owner</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => {
                const val = e.target.value;
                setUsername(val);
                const lower = val.trim().toLowerCase();
                if (lower === 'owner' || lower === 'admin' || lower === 'shop owner') {
                  setSelectedRoleHint('owner');
                } else if (lower === 'staff' || lower === 'cashier') {
                  setSelectedRoleHint('staff');
                }
                setErrorMessage(null);
              }}
              placeholder="e.g. staff or owner"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Password / PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Password / PIN</span>
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="e.g. staff or owner (or PIN)"
                className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick Touch Keypad (0-9) for touchscreen counter */}
          <div className="pt-1">
            <div className="text-[10px] text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Quick Counter Keypad:</span>
              <button
                type="button"
                onClick={() => setPassword('')}
                className="text-amber-400 hover:underline"
              >
                Clear PIN
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
                onClick={() => {
                  if (selectedRoleHint === 'staff') {
                    setPassword('staff');
                  } else {
                    setPassword('owner');
                  }
                }}
                className="py-1.5 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 text-[10px] font-bold rounded-lg border border-emerald-800"
                title="Fill default password"
              >
                Auto
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
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Register</span>
          </button>
        </form>

        {/* Direct Windows .EXE Download Link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center">
          <a
            href="/api/download-exe"
            download="SA_Brothers_POS.exe"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-all"
          >
            <MonitorDown className="w-3.5 h-3.5" />
            <span>Download Windows Desktop App (.exe)</span>
          </a>
        </div>
      </div>

      {/* Footer Offline Notice */}
      <div className="text-center text-[11px] text-slate-500 mt-6 space-y-1">
        <p>🔒 100% Offline Ready · Real-time Hard Drive &amp; Local Persistence</p>
        <p>All data is automatically synchronized and protected against power cuts</p>
      </div>
    </div>
  );
};
