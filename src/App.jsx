import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { subscribeEquipment, subscribeRequests } from "./services/firestoreService";
import HeroSection from "./components/HeroSection";
import AdminBar from "./components/AdminBar";
import Footer from "./components/Footer";
import PublicCatalog from "./components/PublicCatalog";
import KanbanBoard from "./components/KanbanBoard";
import EquipmentManager from "./components/EquipmentManager";
import ArchiveView from "./components/ArchiveView";
import Icon from "./components/Icon";
import { STAGE } from "./utils/constants";

function Shell() {
  const { user, isSuperAdmin } = useAuth();
  const toast = useToast();

  const [view, setView] = useState("catalog");
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingEq, setLoadingEq] = useState(true);
  const [loadingReq, setLoadingReq] = useState(true);

  /* Realtime sync — equipment */
  useEffect(() => {
    return subscribeEquipment(
      (list) => {
        setEquipment(list);
        setLoadingEq(false);
      },
      (err) => {
        console.error("equipment:", err);
        setLoadingEq(false);
      }
    );
  }, []);

  /* Realtime sync — requests */
  useEffect(() => {
    return subscribeRequests(
      (list) => {
        setRequests(list);
        setLoadingReq(false);
      },
      (err) => {
        console.error("requests:", err);
        setLoadingReq(false);
      }
    );
  }, []);

  /* Jika superadmin login, arahkan ke papan kerja */
  useEffect(() => {
    if (isSuperAdmin) setView((v) => (v === "catalog" ? "kanban" : v));
  }, [isSuperAdmin]);

  const stats = useMemo(() => {
    const active = requests.filter((r) => !r.isArchived);
    return {
      available: equipment.reduce((a, e) => a + (e.stokTersedia || 0), 0),
      incoming: active.filter((r) => r.stage === STAGE.MASUK).length,
      borrowed: active.filter((r) => r.stage === STAGE.DITERIMA).length,
      done: active.filter((r) => r.stage === STAGE.SELESAI).length,
    };
  }, [equipment, requests]);

  /* View valid sesuai hak akses */
  const allowed = isSuperAdmin
    ? ["kanban", "inventory", "archive", "catalog"]
    : ["catalog"];
  const current = allowed.includes(view) ? view : "catalog";

  /* Gulir halus ke katalog dari hero */
  const goExplore = useCallback(() => {
    document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {current === "catalog" && (
          <>
            {/* Hero full-screen — bar atas (logo + login) menyatu di dalamnya */}
            <HeroSection
              stats={stats}
              equipmentCount={equipment.length}
              onExplore={goExplore}
              onOpenAdmin={() => setView("kanban")}
            />

            <div className={`mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 ${isSuperAdmin ? "pb-32" : "pb-16"}`}>
              {user && !isSuperAdmin && (
                <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                  <div className="flex items-start gap-3">
                    <Icon name="shield-alert" className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-bold">Akun Anda tidak memiliki akses superadmin.</p>
                      <p className="mt-0.5 text-xs">
                        Masuk dengan akun <strong>temonkec@gmail.com</strong> untuk mengelola data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <PublicCatalog equipment={equipment} />
            </div>
          </>
        )}

        {current !== "catalog" && (
          <>
            {/* Bar ringkas panel admin — pengganti navbar, hanya di area kerja */}
            <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
              <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <button
                  onClick={() => setView("catalog")}
                  className="flex items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perisai-700"
                  aria-label="Kembali ke situs publik"
                >
                  <img src="/logo.png" alt="Logo PERISAI Temon" className="h-10 w-10 rounded-2xl object-contain" />
                  <span>
                    <span className="block text-sm font-extrabold tracking-tight text-slate-900">
                      Panel Superadmin
                    </span>
                    <span className="block text-[11px] font-medium text-slate-500">
                      PERISAI Temon • Kapanewon Temon
                    </span>
                  </span>
                </button>

                <button onClick={() => setView("catalog")} className="btn-secondary !py-2.5">
                  <Icon name="globe" className="h-4 w-4" />
                  <span className="hidden sm:inline">Lihat Situs Publik</span>
                  <span className="sm:hidden">Situs</span>
                </button>
              </div>
            </header>

            <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8">
              <AdminHeader stats={stats} />
              {current === "kanban" && <KanbanBoard requests={requests} loading={loadingReq} />}
              {current === "inventory" && <EquipmentManager equipment={equipment} loading={loadingEq} />}
              {current === "archive" && <ArchiveView requests={requests} loading={loadingReq} />}
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Navigasi mengambang superadmin — menggantikan navbar atas */}
      {isSuperAdmin && <AdminBar view={current} setView={setView} incoming={stats.incoming} />}
    </div>
  );
}

function AdminHeader({ stats }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 rounded-3xl bg-gradient-to-br from-perisai-900 via-perisai-800 to-perisai-700 p-6 text-white shadow-modal sm:grid-cols-4">
      {[
        ["Tersedia", stats.available, "circle-check"],
        ["Masuk", stats.incoming, "inbox"],
        ["Dipinjam", stats.borrowed, "clock"],
        ["Selesai", stats.done, "award"],
      ].map(([label, val, icon]) => (
        <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-3.5 text-center backdrop-blur">
          <Icon name={icon} className="mx-auto h-4 w-4 text-perisai-200" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-perisai-100">{label}</p>
          <p className="text-xl font-extrabold">{val}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </AuthProvider>
  );
}
