import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

/**
 * Bilah navigasi mengambang untuk superadmin — menggantikan navbar atas.
 * Muncul hanya saat superadmin login; berisi pintasan antar-panel + tombol keluar.
 */
const ITEMS = [
  { key: "kanban", label: "Papan", icon: "kanban" },
  { key: "inventory", label: "Inventaris", icon: "package" },
  { key: "archive", label: "Arsip", icon: "archive" },
  { key: "catalog", label: "Katalog", icon: "search" },
];

export default function AdminBar({ view, setView, incoming = 0 }) {
  const { logout } = useAuth();

  return (
    <nav
      className="no-print fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
      aria-label="Navigasi superadmin"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-slate-200/70 bg-white/95 p-1.5 shadow-modal backdrop-blur-xl">
        {ITEMS.map((it) => {
          const active = view === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={`relative flex items-center gap-2 rounded-full px-3 py-2.5 text-xs font-bold transition sm:px-4 sm:text-[13px] ${
                active
                  ? "bg-perisai-700 text-white shadow-card"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={it.icon} className="h-4 w-4" />
              <span className="hidden sm:inline">{it.label}</span>
              {it.key === "kanban" && incoming > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  {incoming}
                </span>
              )}
            </button>
          );
        })}

        <div className="mx-1 h-6 w-px bg-slate-200" />

        <button
          onClick={logout}
          className="flex items-center rounded-full px-3 py-2.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
          title="Keluar"
          aria-label="Keluar"
        >
          <Icon name="log-out" className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
