import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';

export default function LoginModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try { await authService.loginAdmin(username, password); onSuccess(); }
    catch (err) { setError(err.message || 'Gagal login, periksa username dan password.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200/60 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
            <div><h2 className="text-lg font-bold text-white">Login Superadmin</h2><p className="text-xs text-slate-400">Kapanewon Temon</p></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && <div className="p-3 bg-rose-50/80 border border-rose-200/60 rounded-xl text-xs text-rose-700">{error}</div>}
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative"><User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Temon" className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition" /></div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative"><Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition" /></div>
          </div>
          
          <div className="pt-2">
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-slate-950/20 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed">{isLoading ? 'Memproses...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}