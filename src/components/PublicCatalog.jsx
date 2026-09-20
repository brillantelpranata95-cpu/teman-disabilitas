import { useMemo, useState } from "react";
import Icon from "./Icon";
import RequestModal from "./RequestModal";
import { JENIS_ALAT, JENIS_ALAT_ICON, formatTanggal } from "../utils/constants";

export default function PublicCatalog({ equipment, stats }) {
  const [kategori, setKategori] = useState("Semua");
  const [q, setQ] = useState("");
  const [reqItem, setReqItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return equipment.filter((it) => {
      const matchCat = kategori === "Semua" || it.jenisAlat === kategori;
      const matchQ =
        !s ||
        (it.namaAlat || "").toLowerCase().includes(s) ||
        (it.pemilik || "").toLowerCase().includes(s);
      return matchCat && matchQ;
    });
  }, [equipment, kategori, q]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-perisai-900 via-perisai-800 to-perisai-700 p-8 text-white shadow-modal sm:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #CBDCA5 0%, transparent 70%)" }}
        />
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <span className="chip border border-white/20 bg-white/10 text-perisai-100">
              Layanan Inklusif Kapanewon Temon
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Ketersediaan Alat Bantu Disabilitas
              <br />
              <span className="bg-gradient-to-r from-perisai-300 to-perisai-400 bg-clip-text text-transparent">
                Kapanewon Temon
              </span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-perisai-100/90">
              Cek stok alat bantu disabilitas secara real-time dan ajukan permohonan
              pinjam tanpa biaya — cukup dari ponsel Anda.
            </p>
            <a href="#katalog" className="btn bg-white text-perisai-900 hover:bg-perisai-50">
              <Icon name="search" className="h-4 w-4" />
              Cari & Pinjam Alat
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-4 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold text-perisai-100">Stok Siap Dipinjam</p>
              <p className="mt-1 text-3xl font-extrabold">
                {stats?.available ?? 0}
                <span className="ml-1 text-sm font-normal text-perisai-100/80">Unit</span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold text-perisai-100">Jenis Alat</p>
              <p className="mt-1 text-3xl font-extrabold">
                {equipment.length}
                <span className="ml-1 text-sm font-normal text-perisai-100/80">Item</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <div id="katalog" className="space-y-6 scroll-mt-24">
        <div className="card flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["Semua", ...JENIS_ALAT].map((cat) => (
              <button
                key={cat}
                onClick={() => setKategori(cat)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  kategori === cat
                    ? "bg-perisai-700 text-white shadow-card"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat !== "Semua" && <Icon name={JENIS_ALAT_ICON[cat] || "package"} className="h-3.5 w-3.5" />}
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama alat atau pemilik…"
              className="input !py-2.5 pl-10"
              aria-label="Cari alat bantu"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Icon name="search" className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">Tidak ada alat yang cocok.</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci atau kategori.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const avail = (item.stokTersedia ?? 0) > 0;
              return (
                <article
                  key={item.id}
                  className="card group flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-card-hover"
                >
                  <div className="relative h-48 overflow-hidden bg-perisai-100">
                    <img
                      src={item.foto}
                      alt={item.namaAlat}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <span
                      className={`absolute left-3 top-3 chip ${
                        avail ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                      }`}
                    >
                      <Icon name={avail ? "circle-check" : "circle-alert"} className="h-3 w-3" />
                      {avail ? `${item.stokTersedia} Tersedia` : "Stok Kosong"}
                    </span>
                    {item.pemilik && (
                      <span className="absolute bottom-3 left-3 rounded-lg bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                        Sumber: {item.pemilik}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name={JENIS_ALAT_ICON[item.jenisAlat] || "package"}
                          className="h-4 w-4 text-perisai-700"
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wide text-perisai-700">
                          {item.jenisAlat}
                        </span>
                      </div>
                      <h3 className="mt-1.5 font-bold leading-snug text-slate-900">{item.namaAlat}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                        {item.deskripsi}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                      <button onClick={() => setDetailItem(item)} className="btn-secondary !py-2.5">
                        <Icon name="eye" className="h-3.5 w-3.5" /> Detail
                      </button>
                      <button
                        onClick={() => avail && setReqItem(item)}
                        disabled={!avail}
                        className={avail ? "btn-primary !py-2.5" : "btn-secondary !py-2.5"}
                      >
                        {avail ? "Ajukan Pinjam" : "Stok Kosong"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal detail */}
      {detailItem && (
        <Modal onClose={() => setDetailItem(null)} title={detailItem.namaAlat}>
          <img
            src={detailItem.foto}
            alt={detailItem.namaAlat}
            className="mb-4 h-56 w-full rounded-2xl object-cover"
          />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Jenis", detailItem.jenisAlat],
              ["Kondisi", detailItem.kondisi],
              ["Pemilik", detailItem.pemilik],
              ["Stok tersedia", `${detailItem.stokTersedia} dari ${detailItem.stokTotal} unit`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-slate-50 p-3">
                <dt className="text-[11px] font-bold uppercase text-slate-500">{k}</dt>
                <dd className="mt-0.5 font-semibold text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-2xl bg-perisai-50 p-4 text-xs leading-relaxed text-slate-700">
            {detailItem.deskripsi}
          </p>
          <div className="mt-5 flex gap-2">
            <button onClick={() => setDetailItem(null)} className="btn-secondary flex-1">
              Tutup
            </button>
            {(detailItem.stokTersedia ?? 0) > 0 && (
              <button
                onClick={() => { setReqItem(detailItem); setDetailItem(null); }}
                className="btn-primary flex-1"
              >
                <Icon name="send" className="h-4 w-4" /> Ajukan Pinjam
              </button>
            )}
          </div>
        </Modal>
      )}

      {reqItem && <RequestModal equipment={reqItem} onClose={() => setReqItem(null)} />}
    </div>
  );
}

/* Modal generik — dipakai katalog & detail */
export function Modal({ children, onClose, title, wide }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-modal sm:rounded-3xl ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
          <button onClick={onClose} className="btn-ghost !p-2" aria-label="Tutup">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
