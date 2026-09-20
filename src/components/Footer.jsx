export default function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-slate-200/80 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-800">PERISAI TEMON — Teman Disabilitas</p>
        <p>Pemerintah Kapanewon Temon • Kabupaten Kulon Progo, DIY</p>
        <p className="text-slate-400">
          © {new Date().getFullYear()} Pelayanan Sosial Disabilitas Inklusif
        </p>
      </div>
    </footer>
  );
}
