/* Konstanta & util — skema data mengikuti dokumen Firestore lama (kompatibel penuh). */

export const KALURAHAN_TEMON = [
  "Glagah", "Temon Kulon", "Temon Wetan", "Palihan", "Jantisari",
  "Sindutan", "Kebonrejo", "Kaligintung", "Kedundang", "Plumbon",
  "Demen", "Kulur", "Karangwuni", "Janten",
];

export const JENIS_ALAT = ["Mobilisasi", "Pendengaran", "Penglihatan", "Lainnya"];

export const JENIS_ALAT_ICON = {
  Mobilisasi: "wheelchair",
  Pendengaran: "hearing-aid",
  Penglihatan: "glasses",
  Lainnya: "package",
};

export const STAGE = {
  MASUK: "permintaan_masuk",
  DITERIMA: "permintaan_diterima",
  SELESAI: "permintaan_selesai",
};

export const STAGE_LABEL = {
  permintaan_masuk: "Permintaan Masuk",
  permintaan_diterima: "Sedang Dipinjam",
  permintaan_selesai: "Selesai",
};

/* ---------- Format ---------- */

export function formatTanggal(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function tambahHari(iso, hari) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + Number(hari || 0));
  return d.toISOString().split("T")[0];
}

export function selisihHari(isoA, isoB) {
  const a = new Date(isoA + "T00:00:00");
  const b = new Date(isoB + "T00:00:00");
  return Math.round((a - b) / 86400000);
}

export function generateKodeBooking() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `PRSI-${new Date().getFullYear()}-${n}`;
}

export function generateId(prefix) {
  return `${prefix}-${Date.now()}`;
}

/* ---------- WhatsApp ---------- */

export function waNumber(raw) {
  const digits = String(raw || "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

export function waReminderUrl(req) {
  const phone = waNumber(req.nomorWaPemohon);
  const msg =
    `Halo Bpk/Ibu *${req.namaPemohon}*,\n\n` +
    `Kami dari *PERISAI Temon — Kapanewon Temon* menginformasikan mengenai peminjaman ` +
    `alat *${req.namaAlat}* untuk *${req.namaPenggunaAlat}*.\n\n` +
    `Masa peminjaman akan berakhir dalam *3 hari lagi*, pada tanggal *${formatTanggal(req.tanggalJatuhTempo)}*.\n\n` +
    `Mohon konfirmasi jadwal pengembalian atau perpanjangan. Terima kasih.\n\n` +
    `_Pemerintah Kapanewon Temon_`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/* ---------- Ekspor CSV ---------- */

export function downloadCsv(filename, rows, headers) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.map((h) => escape(h.label)).join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h.key])).join(",")),
  ];
  // BOM agar Excel membaca UTF-8 dengan benar
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
