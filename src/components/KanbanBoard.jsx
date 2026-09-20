import { useMemo, useState } from "react";
import Icon from "./Icon";
import { Modal } from "./PublicCatalog";
import { useToast } from "../context/ToastContext";
import {
  approveRequest, completeRequest, deleteRequest, markWaReminderSent, archiveRequest,
} from "../services/firestoreService";
import { STAGE, formatTanggal, selisihHari, todayISO, waReminderUrl } from "../utils/constants";

export default function KanbanBoard({ requests, loading }) {
  const toast = useToast();
  const [approveReq, setApproveReq] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const active = useMemo(() => requests.filter((r) => !r.isArchived), [requests]);

  const columns = [
    { key: STAGE.MASUK, label: "Permintaan Masuk", icon: "inbox", tone: "amber" },
    { key: STAGE.DITERIMA, label: "Sedang Dipinjam", icon: "clock", tone: "blue" },
    { key: STAGE.SELESAI, label: "Selesai", icon: "circle-check", tone: "emerald" },
  ];

  const tones = {
    amber: { head: "border-amber-200 bg-amber-50 text-amber-900", icon: "text-amber-600", count: "bg-amber-200 text-amber-900" },
    blue: { head: "border-blue-200 bg-blue-50 text-blue-900", icon: "text-blue-600", count: "bg-blue-200 text-blue-900" },
    emerald: { head: "border-emerald-200 bg-emerald-50 text-emerald-900", icon: "text-emerald-600", count: "bg-emerald-200 text-emerald-900" },
  };

  const run = async (id, fn, successMsg) => {
    setBusyId(id);
    try {
      await fn();
      if (successMsg) toast(successMsg);
    } catch (err) {
      console.error(err);
      toast(err?.message || "Terjadi kesalahan. Coba lagi.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = (durasi) => {
    const req = approveReq;
    setApproveReq(null);
    run(req.id, () => approveRequest(req, durasi),
      `Permintaan ${req.kodeBooking} diterima — stok ${req.namaAlat} berkurang 1 unit.`);
  };

  const handleComplete = (req) =>
    run(req.id, () => completeRequest(req),
      `Peminjaman ${req.namaAlat} selesai — stok bertambah 1 unit kembali.`);

  const handleDelete = (req) => {
    if (!window.confirm(`Tolak & hapus permohonan ${req.kodeBooking}?`)) return;
    run(req.id, () => deleteRequest(req.id), "Permohonan dihapus.");
  };

  const handleArchive = (req) =>
    run(req.id, () => archiveRequest(req.id), "Dipindahkan ke arsip.");

  const handleSendWa = (req) => {
    window.open(waReminderUrl(req), "_blank", "noopener");
    markWaReminderSent(req.id).catch(() => {});
    toast("Membuka WhatsApp untuk pengingat H-3.");
  };

  if (loading) {
    return (
      <div className="card p-12 text-center text-sm text-slate-500">
        Memuat data permintaan…
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {columns.map((col) => {
          const list = active.filter((r) => r.stage === col.key);
          const t = tones[col.tone];
          return (
            <section key={col.key} className="min-h-[480px] space-y-4 rounded-3xl border border-slate-200 bg-slate-100/70 p-4">
              <div className={`flex items-center justify-between rounded-2xl border p-3 ${t.head}`}>
                <h3 className="flex items-center gap-2 text-sm font-extrabold">
                  <Icon name={col.icon} className={`h-4 w-4 ${t.icon}`} />
                  {col.label}
                </h3>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${t.count}`}>
                  {list.length}
                </span>
              </div>

              <div className="space-y-3">
                {list.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-12 text-center text-xs text-slate-400">
                    {col.key === STAGE.MASUK && "Belum ada permintaan masuk."}
                    {col.key === STAGE.DITERIMA && "Tidak ada alat yang sedang dipinjam."}
                    {col.key === STAGE.SELESAI && "Belum ada riwayat selesai di papan."}
                  </p>
                )}

                {list.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    busy={busyId === req.id}
                    onApprove={() => setApproveReq(req)}
                    onComplete={() => handleComplete(req)}
                    onDelete={() => handleDelete(req)}
                    onSendWa={() => handleSendWa(req)}
                    onArchive={() => handleArchive(req)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {approveReq && (
        <SetDurasiModal
          req={approveReq}
          onConfirm={handleApprove}
          onClose={() => setApproveReq(null)}
        />
      )}
    </>
  );
}

/* ---------- Kartu permintaan ---------- */

function RequestCard({ req, busy, onApprove, onComplete, onDelete, onSendWa, onArchive }) {
  const stage = req.stage;
  const overdue =
    stage === STAGE.DITERIMA && req.tanggalJatuhTempo && selisihHari(todayISO(), req.tanggalJatuhTempo) > 0;
  const dueSoon =
    stage === STAGE.DITERIMA && req.tanggalJatuhTempo &&
    !overdue && selisihHari(req.tanggalJatuhTempo, todayISO()) <= 3;

  return (
    <article
      className={`space-y-3 rounded-2xl border bg-white p-4 shadow-card ${
        overdue ? "border-rose-300 ring-1 ring-rose-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
          {req.kodeBooking}
        </span>
        <span className="text-[10px] text-slate-400">{formatTanggal(req.tanggalPengajuan)}</span>
      </div>

      <h4 className="text-sm font-bold leading-snug text-slate-900">{req.namaAlat}</h4>

      <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
        <p className="text-slate-700">
          Pemohon: <strong className="text-slate-900">{req.namaPemohon}</strong>
        </p>
        <p className="text-slate-700">
          Pengguna: <strong className="text-slate-900">{req.namaPenggunaAlat}</strong>
        </p>
        <p className="flex items-center gap-1.5 text-emerald-700">
          <Icon name="phone" className="h-3 w-3" />
          <strong>{req.nomorWaPemohon}</strong>
        </p>
        {req.alamatPemohon && (
          <p className="pt-0.5 text-[11px] leading-relaxed text-slate-500">{req.alamatPemohon}</p>
        )}
        {req.catatanKebutuhan && (
          <p className="border-t border-slate-200 pt-1.5 text-[11px] italic leading-relaxed text-slate-500">
            “{req.catatanKebutuhan}”
          </p>
        )}
      </div>

      {stage === STAGE.DITERIMA && (
        <div
          className={`grid grid-cols-2 gap-2 rounded-xl border p-2.5 text-[11px] ${
            overdue
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : dueSoon
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-blue-100 bg-blue-50 text-blue-800"
          }`}
        >
          <div>
            Mulai: <strong>{formatTanggal(req.tanggalMulaiPinjam)}</strong>
          </div>
          <div>
            Kembali: <strong>{formatTanggal(req.tanggalJatuhTempo)}</strong>
          </div>
          {(overdue || dueSoon) && (
            <div className="col-span-2 flex items-center gap-1.5 border-t border-current/20 pt-1.5 font-bold">
              <Icon name="circle-alert" className="h-3.5 w-3.5" />
              {overdue
                ? `Terlambat ${selisihHari(todayISO(), req.tanggalJatuhTempo)} hari`
                : "Jatuh tempo ≤ 3 hari lagi"}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 pt-0.5">
        {stage === STAGE.MASUK && (
          <div className="flex gap-2">
            <button onClick={onDelete} disabled={busy} className="btn-secondary !py-2.5 !text-xs">
              Tolak
            </button>
            <button onClick={onApprove} disabled={busy} className="btn-primary flex-1 !py-2.5 !text-xs">
              <Icon name="check" className="h-3.5 w-3.5" /> Terima & Set Durasi
            </button>
          </div>
        )}

        {stage === STAGE.DITERIMA && (
          <>
            <button onClick={onSendWa} disabled={busy} className="btn-wa w-full !py-2.5 !text-xs">
              <Icon name="send" className="h-3.5 w-3.5" />
              {req.statusWaReminderSent ? "Kirim Ulang WA Pengingat" : "Kirim WA Pengingat (H-3)"}
            </button>
            <button onClick={onComplete} disabled={busy} className="btn-primary w-full !py-2.5 !text-xs">
              <Icon name="circle-check" className="h-3.5 w-3.5" /> Selesaikan (Kembalikan Stok)
            </button>
          </>
        )}

        {stage === STAGE.SELESAI && (
          <button onClick={onArchive} disabled={busy} className="btn-secondary w-full !py-2.5 !text-xs">
            <Icon name="archive" className="h-3.5 w-3.5" /> Arsipkan sebagai Database
          </button>
        )}
      </div>
    </article>
  );
}

/* ---------- Modal set durasi ---------- */

function SetDurasiModal({ req, onConfirm, onClose }) {
  const [durasi, setDurasi] = useState(30);
  const presets = [7, 14, 30, 60, 90];

  return (
    <Modal onClose={onClose} title="Terima Permintaan & Set Durasi">
      <div className="mb-4 rounded-2xl bg-perisai-50 p-3.5 text-xs">
        <p className="font-bold text-slate-900">{req.namaAlat}</p>
        <p className="mt-0.5 text-slate-600">
          Pemohon: {req.namaPemohon} • Pengguna: {req.namaPenggunaAlat}
        </p>
      </div>

      <label className="label" htmlFor="durasi">Durasi Peminjaman (hari)</label>
      <input
        id="durasi"
        type="number"
        min={1}
        max={365}
        className="input"
        value={durasi}
        onChange={(e) => setDurasi(e.target.value)}
      />

      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setDurasi(p)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              Number(durasi) === p ? "bg-perisai-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p} hari
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
        <Icon name="circle-alert" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Stok alat akan <strong>berkurang 1 unit</strong> di katalog publik setelah
          permintaan ini diterima.
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={onClose} className="btn-secondary flex-1">Batal</button>
        <button
          onClick={() => Number(durasi) > 0 && onConfirm(Number(durasi))}
          disabled={!(Number(durasi) > 0)}
          className="btn-primary flex-1"
        >
          <Icon name="check" className="h-4 w-4" /> Konfirmasi Terima
        </button>
      </div>
    </Modal>
  );
}
