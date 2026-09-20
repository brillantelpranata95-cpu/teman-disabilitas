# PERISAI Temon — Teman Disabilitas

Sistem pelayanan **peminjaman alat bantu disabilitas** untuk Kapanewon Temon, Kabupaten Kulon Progo.

**Live:** https://teman-disabilitas.web.app

---

## Stack — Firebase Free Tier (Spark) saja

| Lapisan | Teknologi |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Database | Cloud Firestore (realtime `onSnapshot` + transaksi stok) |
| Auth | Firebase Authentication (Google Sign-In) |
| Hosting | Firebase Hosting (`teman-disabilitas.web.app`) |
| Analytics | Firebase Analytics |

Tanpa Supabase, tanpa Vercel, tanpa serverless function — seluruh backend ditangani Firebase.

## Struktur

```
src/
├── config/firebase.js          Init Firebase + persistence offline
├── context/AuthContext.jsx     Google Sign-In + cek superadmin
├── context/ToastContext.jsx    Notifikasi global
├── services/firestoreService.js  CRUD + transaksi stok
├── utils/constants.js          Kalurahan, format, WhatsApp, CSV
├── data/seed.js                Data contoh inventaris
├── components/                 Navbar, Footer, PublicCatalog, RequestModal,
│                               KanbanBoard, EquipmentManager, ArchiveView, Icon
└── assets/koboyo/              Ikon SVG (koboyo.com/icons — bebas komersial)
```

## Skema Firestore

**`equipment`** — `id, namaAlat, jenisAlat, foto, pemilik, statusUtama, stokTotal, stokTersedia, kondisi, deskripsi`

**`requests`** — `id, kodeBooking, equipmentId, namaAlat, namaPemohon, alamatPemohon, nomorWaPemohon, namaPenggunaAlat, catatanKebutuhan, stage, tanggalPengajuan, durasiHariPinjam, tanggalMulaiPinjam, tanggalJatuhTempo, tanggalSelesai, statusWaReminderSent, isArchived`

Alur `stage`: `permintaan_masuk` → `permintaan_diterima` (stok −1) → `permintaan_selesai` (stok +1). Stok memakai `runTransaction` — tidak bisa minus / desync.

## Menjalankan lokal

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # output ke dist/
```

## Deploy

**Otomatis (GitHub Actions):** push ke `main` → deploy ke Firebase Hosting + Firestore Rules.
Secret yang dibutuhkan: `FIREBASE_SERVICE_ACCOUNT_TEMAN_DISABILITAS` (isi file service account JSON).

**Manual:**

```bash
npm run build
npx firebase-tools deploy --only hosting,firestore:rules --project teman-disabilitas
```

## Superadmin

Email terdaftar (harus sama di `src/context/AuthContext.jsx` **dan** `firestore.rules`):

- `temonkec@gmail.com`
- `brillantelpranata95@gmail.com`

## Lisensi aset

Ikon dari [koboyo.com/icons](https://koboyo.com/icons) — bebas untuk personal & komersial.
