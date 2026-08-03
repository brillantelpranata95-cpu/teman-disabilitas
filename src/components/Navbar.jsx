import React from 'react';
import { Accessibility, ShieldCheck, UserCheck, LayoutDashboard, HeartHandshake } from 'lucide-react';

export default function Navbar({ isAdminMode, setIsAdminMode, availableCount, activeLoansCount, incomingCount }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAdminMode(false)}>
            <div className="w-10 h-10 rounded-surface bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-apple-sm shadow-emerald-500/20 transition-transform hover:scale-[1.02]">
              <Accessibility className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-800 bg-clip-text text-transparent">
                  PERISAI TEMON
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Teman Disabilitas
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Kapanewon Temon • Kabupaten Kulon Progo</p>
            </div>
          </div>

          {/* Quick Badges / Stats */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="px-3 py-1.5 rounded-control bg-white/90 backdrop-blur-xl border border-slate-200/60 flex items-center space-x-2 text-xs font-medium text-slate-700 shadow-sm shadow-slate-900/5 min-h-[40px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tersedia: <strong className="text-emerald-700">{availableCount} Unit</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-control bg-white/90 backdrop-blur-xl border border-slate-200/60 flex items-center space-x-2 text-xs font-medium text-slate-700 shadow-sm shadow-slate-900/5 min-h-[40px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Dipinjam: <strong className="text-amber-700">{activeLoansCount} Unit</strong></span>
            </div>
            {incomingCount > 0 && (
              <div className="px-3 py-1.5 rounded-control bg-rose-50/90 backdrop-blur-xl border border-rose-200/60 flex items-center space-x-2 text-xs font-semibold text-rose-700 shadow-sm shadow-slate-900/5 min-h-[40px]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Permintaan Baru: {incomingCount}</span>
              </div>
            )}
          </div>

          {/* Mode Switcher Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-surface text-sm font-semibold transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 min-h-[44px] ${
                isAdminMode
                  ? 'bg-slate-950 text-white hover:bg-slate-900 ring-1 ring-slate-950/20'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20'
              }`}
            >
              {isAdminMode ? (
                <>
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Mode Superadmin</span>
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] uppercase font-bold bg-emerald-500/20 text-emerald-300 rounded-full">Aktif</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kelola Superadmin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}