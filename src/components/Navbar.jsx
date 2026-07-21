import React from 'react';
import { Accessibility, ShieldCheck, UserCheck, LayoutDashboard, HeartHandshake } from 'lucide-react';

export default function Navbar({ isAdminMode, setIsAdminMode, availableCount, activeLoansCount, incomingCount }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAdminMode(false)}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-temon-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-temon-500/20 transform transition-transform hover:scale-105">
              <Accessibility className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-temon-800 to-temon-600 bg-clip-text text-transparent">
                  PERISAI TEMON
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Teman Disabilitas
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Kapanewon Temon • Kabupaten Kulon Progo
              </p>
            </div>
          </div>

          {/* Quick Badges / Stats (Visible on desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center space-x-2 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tersedia: <strong className="text-emerald-700">{availableCount} Unit</strong></span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center space-x-2 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Sedang Dipinjam: <strong className="text-amber-700">{activeLoansCount} Unit</strong></span>
            </div>
            {incomingCount > 0 && (
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs font-semibold text-rose-700 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Permintaan Baru: {incomingCount}</span>
              </div>
            )}
          </div>

          {/* Mode Switcher Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                isAdminMode
                  ? 'bg-slate-900 text-white hover:bg-slate-800 ring-2 ring-slate-900/20'
                  : 'bg-gradient-to-r from-temon-600 to-teal-600 text-white hover:from-temon-700 hover:to-teal-700 shadow-temon-600/20'
              }`}
            >
              {isAdminMode ? (
                <>
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Mode Superadmin</span>
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 rounded">Aktif</span>
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
