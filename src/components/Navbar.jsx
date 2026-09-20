import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

export default function Navbar({ view, setView, stats }) {
  const { user, isSuperAdmin, loginWithGoogle, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const adminNav = [
    { key: "kanban", label: "Papan Permintaan", icon: "kanban" },
    { key: "inventory", label: "Inventaris", icon: "package" },
    { key: "archive", label: "Arsip & Rekap", icon: "archive" },
  ];
  const publicNav = [{ key: "catalog", label: "Katalog Alat", icon: "search" }];

  const nav = isSuperAdmin && view !== "catalog" ? adminNav : publicNav;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Brand */}
          <button
            onClick={() => setView("catalog")}
            className="flex items-center gap-3 text-left"
            aria-label="Kembali ke katalog"
          >
            <img src="/logo.png" alt="Logo PERISAI Temon" className="h-11 w-11 rounded-2xl object-contain" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">PERISAI TEMON</span>
                <span className="chip bg-perisai-100 text-perisai-800">Teman Disabilitas</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">Kapanewon Temon • Kulon Progo</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  view === n.key
                    ? "bg-perisai-700 text-white shadow-card"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon name={n.icon} className="h-4 w-4" />
                {n.label}
                {n.key === "kanban" && stats?.incoming > 0 && (
                  <span className="ml-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {stats.incoming}
                  </span>
                )}
              </button>
            ))}

            <div className="mx-2 h-6 w-px bg-slate-200" />

            {user ? (
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full border border-slate-200" />
                )}
                <div className="max-w-[140px]">
                  <p className="truncate text-xs font-bold text-slate-800">{user.displayName || user.email}</p>
                  <p className="text-[10px] font-medium text-slate-500">
                    {isSuperAdmin ? "Superadmin" : "Tidak berwenang"}
                  </p>
                </div>
                <button onClick={logout} className="btn-ghost !px-3 !py-2" title="Keluar">
                  <Icon name="log-out" className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={loginWithGoogle} className="btn-primary !px-4 !py-2.5">
                <Icon name="log-in" className="h-4 w-4" />
                Masuk Superadmin
              </button>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="btn-ghost !p-2.5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Buka menu"
          >
            <Icon name={menuOpen ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="space-y-1 border-t border-slate-100 py-3 md:hidden">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => { setView(n.key); setMenuOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                  view === n.key ? "bg-perisai-700 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon name={n.icon} className="h-4 w-4" />
                {n.label}
              </button>
            ))}
            <div className="pt-2">
              {user ? (
                <button onClick={logout} className="btn-secondary w-full">
                  <Icon name="log-out" className="h-4 w-4" /> Keluar ({user.email})
                </button>
              ) : (
                <button onClick={loginWithGoogle} className="btn-primary w-full">
                  <Icon name="log-in" className="h-4 w-4" /> Masuk Superadmin
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
