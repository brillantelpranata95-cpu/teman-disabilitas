import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { subscribeEquipment, subscribeRequests, seedEquipment } from "./services/firestoreService";
import { INITIAL_EQUIPMENT } from "./data/seed";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PublicCatalog from "./components/PublicCatalog";
import KanbanBoard from "./components/KanbanBoard";
import EquipmentManager from "./components/EquipmentManager";
import ArchiveView from "./components/ArchiveView";
import Icon from "./components/Icon";
import { STAGE } from "./utils/constants";

function Shell() {
  const { user, isSuperAdmin, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [view, setView] = useState("catalog");
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingEq, setLoadingEq] = useState(true);
  const [loadingReq, setLoadingReq] = useState(true);
  const [seeded, setSeeded] = useState(false);

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

  /* Seed sekali saat koleksi kosong & superadmin login */
  useEffect(() => {
    if (!isSuperAdmin || seeded || loadingEq || equipment.length > 0) return;
    setSeeded(true);
    seedEquipment(INITIAL_EQUIPMENT)
      .then(() => toast("Data contoh inventaris berhasil dimuat."))
      .catch((err) => {
        console.error(err);
        toast("Gagal memuat data contoh.", "error");
      });
  }, [isSuperAdmin, seeded, loadingEq, equipment.length, toast]);

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar view={current} setView={setView} stats={stats} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {current === "catalog" && (
          <>
            {isSuperAdmin && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-perisai-200 bg-perisai-50 p-4">
                <div className="flex items-center gap-3">
                  <Icon name="shield-check" className="h-5 w-5 text-perisai-700" />
                  <p className="text-sm font-semibold text-perisai-900">
                    Anda masuk sebagai superadmin.
                  </p>
                </div>
                <button onClick={() => setView("kanban")} className="btn-primary !py-2.5 !text-xs">
                  <Icon name="kanban" className="h-3.5 w-3.5" /> Buka Papan Kerja
                </button>
              </div>
            )}
            <PublicCatalog equipment={equipment} stats={stats} />
          </>
        )}

        {current === "kanban" && (
          <>
            <AdminHeader stats={stats} />
            <KanbanBoard requests={requests} loading={loadingReq} />
          </>
        )}

        {current === "inventory" && (
          <>
            <AdminHeader stats={stats} />
            <EquipmentManager equipment={equipment} loading={loadingEq} />
          </>
        )}

        {current === "archive" && (
          <>
            <AdminHeader stats={stats} />
            <ArchiveView requests={requests} loading={loadingReq} />
          </>
        )}

        {/* Gerbang login — muncul bila pengunjung mencoba akses area admin */}
        {!isSuperAdmin && user && (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
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

        {!user && view !== "catalog" && (
          <div className="card mt-8 p-8 text-center">
            <Icon name="log-in" className="mx-auto h-8 w-8 text-perisai-700" />
            <p className="mt-3 font-bold text-slate-800">Area khusus superadmin</p>
            <p className="mt-1 text-xs text-slate-500">
              Masuk dengan akun Google yang terdaftar untuk mengelola inventaris & permintaan.
            </p>
            <button onClick={loginWithGoogle} className="btn-primary mx-auto mt-4">
              <Icon name="log-in" className="h-4 w-4" /> Masuk dengan Google
            </button>
          </div>
        )}
      </main>

      <Footer />
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
