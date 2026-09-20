/**
 * Firestore service — satu-satunya lapisan data (stack Firebase-only).
 *
 * Skema dokumen (kompatibel dengan data lama):
 *   equipment: id, namaAlat, jenisAlat, foto, pemilik, statusUtama,
 *              stokTotal, stokTersedia, kondisi, deskripsi
 *   requests:  id, kodeBooking, equipmentId, namaAlat, namaPemohon, alamatPemohon,
 *              nomorWaPemohon, namaPenggunaAlat, catatanKebutuhan, stage,
 *              tanggalPengajuan, durasiHariPinjam, tanggalMulaiPinjam,
 *              tanggalJatuhTempo, tanggalSelesai, statusWaReminderSent, isArchived
 *
 * Stok memakai runTransaction agar tidak bisa minus / desync saat dua admin
 * mengubah permintaan bersamaan.
 */
import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc,
  onSnapshot, runTransaction, serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { STAGE, todayISO, tambahHari } from "../utils/constants";

const EQ = "equipment";
const REQ = "requests";

/* Buang nilai undefined — Firestore menolaknya. */
function clean(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

/* ---------- Realtime ---------- */

export function subscribeEquipment(cb, onError) {
  return onSnapshot(
    collection(db, EQ),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function subscribeRequests(cb, onError) {
  return onSnapshot(
    collection(db, REQ),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

/* ---------- Equipment ---------- */

export async function saveEquipment(item) {
  const ref = doc(db, EQ, item.id);
  await setDoc(ref, clean({ ...item, updatedAt: serverTimestamp() }), { merge: true });
}

export async function deleteEquipment(id) {
  await deleteDoc(doc(db, EQ, id));
}

/* ---------- Requests ---------- */

export async function saveRequest(req) {
  const ref = doc(db, REQ, req.id);
  await setDoc(ref, clean({ ...req, updatedAt: serverTimestamp() }), { merge: true });
}

export async function deleteRequest(id) {
  const ref = doc(db, REQ, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const req = snap.data();

  await runTransaction(db, async (tx) => {
    // Kembalikan stok hanya jika alat sedang dipinjam (stage diterima).
    if (req.stage === STAGE.DITERIMA && req.equipmentId) {
      const eqRef = doc(db, EQ, req.equipmentId);
      const eqSnap = await tx.get(eqRef);
      if (eqSnap.exists()) {
        const eq = eqSnap.data();
        const next = Math.min(eq.stokTotal ?? 0, (eq.stokTersedia ?? 0) + 1);
        tx.update(eqRef, { stokTersedia: next });
      }
    }
    tx.delete(ref);
  });
}

/* ---------- Transisi stage (inti logic Kanban) ---------- */

/**
 * Terima permintaan: set durasi → stok −1 (transaksional).
 */
export async function approveRequest(req, durasiHari) {
  const mulai = todayISO();
  const jatuhTempo = tambahHari(mulai, durasiHari);

  await runTransaction(db, async (tx) => {
    const reqRef = doc(db, REQ, req.id);
    const eqRef = doc(db, EQ, req.equipmentId);
    const eqSnap = await tx.get(eqRef);

    if (!eqSnap.exists()) throw new Error("Data alat tidak ditemukan.");
    const eq = eqSnap.data();
    if ((eq.stokTersedia ?? 0) <= 0) {
      throw new Error(`Stok ${eq.namaAlat} sudah habis.`);
    }

    tx.update(eqRef, { stokTersedia: eq.stokTersedia - 1 });
    tx.update(reqRef, {
      stage: STAGE.DITERIMA,
      durasiHariPinjam: Number(durasiHari),
      tanggalMulaiPinjam: mulai,
      tanggalJatuhTempo: jatuhTempo,
      statusWaReminderSent: false,
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Selesaikan peminjaman: stok +1 (transaksional).
 */
export async function completeRequest(req) {
  await runTransaction(db, async (tx) => {
    const reqRef = doc(db, REQ, req.id);
    const eqRef = doc(db, EQ, req.equipmentId);
    const eqSnap = await tx.get(eqRef);

    if (eqSnap.exists()) {
      const eq = eqSnap.data();
      const next = Math.min(eq.stokTotal ?? 0, (eq.stokTersedia ?? 0) + 1);
      tx.update(eqRef, { stokTersedia: next });
    }
    tx.update(reqRef, {
      stage: STAGE.SELESAI,
      tanggalSelesai: todayISO(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function markWaReminderSent(id) {
  await setDoc(doc(db, REQ, id), { statusWaReminderSent: true }, { merge: true });
}

export async function archiveRequest(id) {
  await setDoc(doc(db, REQ, id), { isArchived: true }, { merge: true });
}
