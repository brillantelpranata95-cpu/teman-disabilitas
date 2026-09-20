import { useMemo, useState } from "react";
import Icon from "./Icon";
import { useToast } from "../context/ToastContext";
import { archiveRequest, deleteRequest } from "../services/firestoreService";
import { formatTanggal, downloadCsv, STAGE } from "../utils/constants";

export default function ArchiveView({ requests, loading }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Arsip = semua yang pernah selesai (diarsipkan atau sudah stage selesai)
  const archived = useMemo(
    () => requests.filter((r) => r.isArchived || r.stage === STAGE.SELESAI),
    [requests]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return archived;
    return archived.filter(
      (r) =>
        (r.kodeBooking || "").toLowerCase().includes(s) ||
        (r.namaAlat || "").toLowerCase().includes(s) ||
        (r.namaPemohon || "").toLowerCase().includes(s) ||
        (r.namaPenggunaAlat || "").toLowerCase().includes(s)
    );
  }, [archived, q]);

  const handleArchive = async (req) => {
    setBusyId(req.id);
    try {
      await archiveRequest(req.id);
      toast(`Permohonan ${req.kodeBooking} diarsipkan.`, "info");
    } catch (err) {
      console.error(err);
      toast("Gagal mengarsipkan.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (req) => {
    if (!window.confirm(`Hapus permanen riwayat ${req.kodeBooking}?`)) return;
    setBusyId(req.id);
    try {
      await deleteRequest(req.id);
      toast("Riwayat dihapus.", "info");
    } catch (err) {
      console.error(err);
      toast("Gagal menghapus riwayat.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    downloadCsv(
      `arsip-peminjaman-perisai-temon-${new Date().toISOString().split("T")[0]}.csv`,
      filtered,
      [
        { key: "kodeBooking", label: "Kode Booking" },
        { key: "tanggalPengajuan", label: "Tanggal Pengajuan" },
        { key: "namaAlat", label: "Alat" },
        { key: "namaPemohon", label: "Pemohon" },
        { key: "nomorWaPemohon", label: "WhatsApp" },
        { key: "namaPenggunaAlat", label: "Pengguna" },
        { key: "alamatPemohon", label: "Alamat" },
        { key: "tanggalMulaiPinjam", label: "Mulai Pinjam" },
        { key: "tanggalSelesai", label: "Selesai" },
        { key: "isArchived", label: "Diarsipkan" },
      ]
    );
    toast("Arsip diekspor ke CSV.");
  };

  if (loading) {
    return <div className="card p-12 text-center text-sm text-slate-500">Memuat arsip…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Arsip & Rekapitulasi</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Riwayat seluruh transaksi peminjaman alat bantu disabilitas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCsv} className="btn-secondary !py-2.5 !text-xs">
            <Icon name="download" className="h-3.5 w-3.5" /> Ekspor CSV
          </button>
          <button onClick={() => window.print()} className="btn-primary !py-2.5 !text-xs">
            <Icon name="document" className="h-3.5 w-3.5" /> Cetak Laporan
          </button>
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="input !py-2.5 pl-10"
          placeholder="Cari kode, alat, atau nama…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Icon name="archive" className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">Belum ada data arsip.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-4">Kode & Tanggal</th>
                  <th className="p-4">Alat</th>
                  <th className="p-4">Pemohon</th>
                  <th className="p-4">Pengguna</th>
                  <th className="p-4">Periode</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-900">{r.kodeBooking}</p>
                      <p className="text-[10px] text-slate-400">{formatTanggal(r.tanggalPengajuan)}</p>
                    </td>
                    <td className="p-4 font-bold text-perisai-800">{r.namaAlat}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{r.namaPemohon}</p>
                      <p className="text-emerald-700">{r.nomorWaPemohon}</p>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{r.namaPenggunaAlat}</td>
                    <td className="p-4 text-[11px] text-slate-600">
                      {formatTanggal(r.tanggalMulaiPinjam)} → {formatTanggal(r.tanggalSelesai || r.tanggalJatuhTempo)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`chip ${
                          r.isArchived ? "bg-slate-900 text-white" : "bg-perisai-100 text-perisai-800"
                        }`}
                      >
                        {r.isArchived ? "Diarsipkan" : "Selesai"}
                      </span>
                    </td>
                    <td className="p-4 no-print">
                      <div className="flex justify-end gap-1.5">
                        {!r.isArchived && (
                          <button
                            onClick={() => handleArchive(r)}
                            disabled={busyId === r.id}
                            className="btn-secondary !p-2"
                            title="Arsipkan"
                          >
                            <Icon name="archive" className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r)}
                          disabled={busyId === r.id}
                          className="btn !bg-rose-50 !p-2 text-rose-600 hover:!bg-rose-100"
                          title="Hapus"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
