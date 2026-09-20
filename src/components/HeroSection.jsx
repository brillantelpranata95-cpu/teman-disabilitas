import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

/**
 * Hero full-screen dengan latar video.
 *
 * Optimasi performa:
 * - Poster JPG (75 KB) tampil instan sebagai lapisan pertama; video (606 KB,
 *   faststart, tanpa audio) menyusul di atasnya saat siap.
 * - prefers-reduced-motion dihormati: video tidak dirender sama sekali.
 * - Jika video gagal dimuat, poster tetap tampil (fallback otomatis).
 * - `muted` di-set lewat property + play() eksplisit agar autoplay lolos
 *   kebijakan browser di semua perangkat.
 *
 * Bar atas (logo + tombol login) menyatu di atas hero — menggantikan navbar.
 */
export default function HeroSection({ stats, equipmentCount, onExplore, onOpenAdmin }) {
  const { user, isSuperAdmin, loginWithGoogle, logout } = useAuth();
  const videoRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  /* Hormati preferensi aksesibilitas pengguna */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const showVideo = !reduceMotion && !videoFailed;

  /* Pastikan autoplay berjalan walau atribut diabaikan browser */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, [showVideo]);

  const heroStats = [
    { label: "Stok Siap Dipinjam", value: stats?.available ?? 0, suffix: "Unit", icon: "circle-check" },
    { label: "Jenis Alat", value: equipmentCount ?? 0, suffix: "Item", icon: "package" },
    { label: "Sedang Dipinjam", value: stats?.borrowed ?? 0, suffix: "Unit", icon: "clock" },
    { label: "Selesai Dilayani", value: stats?.done ?? 0, suffix: "Permohonan", icon: "award" },
  ];

  return (
    <section className="hero-full relative flex flex-col overflow-hidden bg-perisai-900 text-white">
      {/* Latar: poster instan, lalu video di atasnya */}
      <img
        src="/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          disablePictureInPicture
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Overlay agar teks selalu terbaca; gradasi bawah menyatu dengan halaman */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/45 to-perisai-950/90" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-perisai-50/90 to-transparent" />

      {/* Konten */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 sm:px-8">
        {/* Bar atas: logo + login (menggantikan navbar) */}
        <header className="flex items-center justify-between gap-3 py-5 sm:py-6">
          <button
            onClick={onExplore}
            className="hero-rise flex items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="PERISAI Temon — lihat katalog"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md sm:h-12 sm:w-12">
              <img src="/logo.png" alt="Logo PERISAI Temon" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
            </span>
            <span>
              <span className="block text-base font-extrabold tracking-tight sm:text-lg">
                PERISAI TEMON
              </span>
              <span className="block text-[11px] font-medium text-white/70">
                Teman Disabilitas • Kapanewon Temon
              </span>
            </span>
          </button>

          {user ? (
            <div className="hero-rise flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-2 backdrop-blur-md">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-8 w-8 rounded-xl" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                  <Icon name="users" className="h-4 w-4" />
                </span>
              )}
              <span className="hidden max-w-[140px] sm:block">
                <span className="block truncate text-xs font-bold">
                  {user.displayName || user.email}
                </span>
                <span className="block text-[10px] text-white/70">
                  {isSuperAdmin ? "Superadmin" : "Tidak berwenang"}
                </span>
              </span>
              <button
                onClick={logout}
                className="rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                title="Keluar"
                aria-label="Keluar"
              >
                <Icon name="log-out" className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="hero-rise btn border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-[0.98]"
            >
              <Icon name="log-in" className="h-4 w-4" />
              <span className="hidden sm:inline">Masuk Superadmin</span>
              <span className="sm:hidden">Masuk</span>
            </button>
          )}
        </header>

        {/* Tengah: judul + ajakan */}
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center sm:py-16">
          <span className="hero-rise chip border border-white/20 bg-white/10 text-perisai-100 backdrop-blur-md">
            <Icon name="shield-check" className="h-3.5 w-3.5" />
            Layanan Inklusif Kapanewon Temon
          </span>

          <h1 className="hero-rise hero-rise-delay-1 mt-5 max-w-4xl text-[2rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Ketersediaan Alat Bantu Disabilitas
            <span className="mt-1 block bg-gradient-to-r from-perisai-200 via-perisai-300 to-perisai-400 bg-clip-text text-transparent">
              Kapanewon Temon
            </span>
          </h1>

          <p className="hero-rise hero-rise-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Cek stok alat bantu disabilitas secara real-time dan ajukan permohonan
            pinjam tanpa biaya — cukup dari ponsel Anda.
          </p>

          <div className="hero-rise hero-rise-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onExplore}
              className="btn bg-white text-perisai-900 shadow-modal hover:bg-perisai-50 active:scale-[0.98]"
            >
              <Icon name="search" className="h-4 w-4" />
              Cari &amp; Pinjam Alat
            </button>
            {isSuperAdmin && (
              <button
                onClick={onOpenAdmin}
                className="btn border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-[0.98]"
              >
                <Icon name="kanban" className="h-4 w-4" />
                Buka Papan Kerja
              </button>
            )}
          </div>
        </div>

        {/* Bawah: statistik + petunjuk gulir */}
        <div className="hero-rise hero-rise-delay-3 pb-10 sm:pb-12">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
              >
                <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-perisai-100">
                  <Icon name={s.icon} className="h-3.5 w-3.5" />
                  {s.label}
                </dt>
                <dd className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
                  {s.value}
                  <span className="ml-1.5 text-xs font-medium text-white/60">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>

          <button
            onClick={onExplore}
            className="mx-auto mt-7 flex flex-col items-center gap-1 text-white/70 transition hover:text-white"
            aria-label="Gulir ke katalog alat"
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest">Lihat Katalog</span>
            <Icon name="arrow-down" className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
