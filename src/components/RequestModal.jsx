import { useState } from "react";
import Icon from "./Icon";
import { Modal } from "./PublicCatalog";
import { useToast } from "../context/ToastContext";
import { saveRequest } from "../services/firestoreService";
import {
  KALURAHAN_TEMON, generateKodeBooking, generateId, todayISO,
} from "../utils/constants";

export default function RequestModal({ equipment, onClose }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    namaPemohon: "",
    nomorWaPemohon: "",
    kalurahan: "",
    detailAlamat: "",
    namaPenggunaAlat: "",
    catatanKebutuhan: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid =
    form.namaPemohon.trim() &&
    form.nomorWaPemohon.trim() &&
    form.kalurahan &&
    form.detailAlamat.trim() &&
    form.namaPenggunaAlat.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    try {
      const kode = generateKodeBooking();
      await saveRequest({
        id: generateId("REQ"),
        kodeBooking: kode,
        equipmentId: equipment.id,
        namaAlat: equipment.namaAlat,
        namaPemohon: form.namaPemohon.trim(),
        alamatPemohon: `${form.detailAlamat.trim()}, Kalurahan ${form.kalurahan}, Kapanewon Temon`,
        nomorWaPemohon: form.nomorWaPemohon.trim(),
        namaPenggunaAlat: form.namaPenggunaAlat.trim(),
        catatanKebutuhan: form.catatanKebutuhan.trim() || "Peminjaman alat disabilitas",
        stage: "permintaan_masuk",
        tanggalPengajuan: todayISO(),
        durasiHariPinjam: null,
        tanggalMulaiPinjam: null,
        tanggalJatuhTempo: null,
        statusWaReminderSent: false,
        isArchived: false,
      });
      toast(`Permohonan ${kode} berhasil dikirim. Superadmin akan menghubungi Anda via WhatsApp.`);
      onClose();
    } catch (err) {
      console.error(err);
      toast("Gagal mengirim permohonan. Periksa koneksi lalu coba lagi.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Formulir Permohonan Pinjam">
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-perisai-50 p-3.5">
        <Icon name="package" className="h-5 w-5 shrink-0 text-perisai-700" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{equipment.namaAlat}</p>
          <p className="text-[11px] text-slate-500">
            {equipment.stokTersedia} unit tersedia • {equipment.pemilik}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="rm-nama">Nama Pemohon *</label>
          <input id="rm-nama" className="input" value={form.namaPemohon}
            onChange={set("namaPemohon")} placeholder="Nama lengkap pemohon" required />
        </div>

        <div>
          <label className="label" htmlFor="rm-wa">Nomor WhatsApp Aktif *</label>
          <input id="rm-wa" className="input" value={form.nomorWaPemohon} inputMode="tel"
            onChange={set("nomorWaPemohon")} placeholder="08xx-xxxx-xxxx" required />
          <p className="mt-1 text-[11px] text-slate-400">
            Dipakai superadmin untuk konfirmasi pengambilan & pengingat pengembalian.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="rm-kal">Kalurahan *</label>
            <select id="rm-kal" className="input" value={form.kalurahan} onChange={set("kalurahan")} required>
              <option value="">Pilih kalurahan…</option>
              {KALURAHAN_TEMON.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="rm-alamat">Detail Alamat *</label>
            <input id="rm-alamat" className="input" value={form.detailAlamat}
              onChange={set("detailAlamat")} placeholder="Padukuhan, RT/RW" required />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="rm-pengguna">Nama Pengguna Alat *</label>
          <input id="rm-pengguna" className="input" value={form.namaPenggunaAlat}
            onChange={set("namaPenggunaAlat")} placeholder="Nama penyandang disabilitas penerima manfaat" required />
        </div>

        <div>
          <label className="label" htmlFor="rm-catatan">Catatan Kebutuhan</label>
          <textarea id="rm-catatan" rows={3} className="input resize-none"
            value={form.catatanKebutuhan} onChange={set("catatanKebutuhan")}
            placeholder="Contoh: untuk mobilitas kontrol rutin ke Puskesmas…" />
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
          <button type="submit" disabled={!valid || busy} className="btn-primary flex-1">
            {busy ? "Mengirim…" : (<><Icon name="send" className="h-4 w-4" /> Kirim Permohonan</>)}
          </button>
        </div>
      </form>
    </Modal>
  );
}
