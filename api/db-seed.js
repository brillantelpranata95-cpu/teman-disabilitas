import { sql } from '@vercel/postgres';

const INITIAL_EQUIPMENT = [
  {
    id: 'EQ-001',
    namaAlat: 'Kursi Roda Standard Ergonomis',
    jenisAlat: 'Mobilisasi',
    foto: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    pemilik: 'Dinas Sosial Kulon Progo',
    statusUtama: 'Tersedia',
    stokTotal: 5,
    stokTersedia: 4,
    kondisi: 'Baik',
    deskripsi: 'Kursi roda lipat berbahan stainless steel dengan sandaran empuk dan rem ganda. Nyaman untuk penggunaan harian lansia dan penyandang disabilitas fisik.'
  },
  {
    id: 'EQ-002',
    namaAlat: 'Kruk Auxillary (Ketiak) Pasang Aluminium',
    jenisAlat: 'Mobilisasi',
    foto: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600',
    pemilik: 'Pemerintah Kapanewon Temon',
    statusUtama: 'Tersedia',
    stokTotal: 8,
    stokTersedia: 7,
    kondisi: 'Baik',
    deskripsi: 'Tongkat ketiak aluminium pasang (sepasang) dengan ketinggian yang dapat disesuaikan. Dilengkapi karet anti-selip di bagian bawah.'
  },
  {
    id: 'EQ-003',
    namaAlat: 'Walker Lipat Roda Depan',
    jenisAlat: 'Mobilisasi',
    foto: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600',
    pemilik: 'CSR Bank BDB Temon',
    statusUtama: 'Tersedia',
    stokTotal: 4,
    stokTersedia: 3,
    kondisi: 'Baik',
    deskripsi: 'Alat bantu jalan empat kaki dengan dua roda di bagian depan. Sangat stabil untuk pemulihan stroke atau latihan jalan.'
  },
  {
    id: 'EQ-004',
    namaAlat: 'Alat Bantu Dengar Digital (BTE)',
    jenisAlat: 'Pendengaran',
    foto: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
    pemilik: 'Puskesmas Temon I',
    statusUtama: 'Tersedia',
    stokTotal: 6,
    stokTersedia: 5,
    kondisi: 'Baik',
    deskripsi: 'Hearing aid Behind-The-Ear dengan pemrosesan sinyal digital penekan kebisingan latar belakang. Baterai isi ulang.'
  },
  {
    id: 'EQ-005',
    namaAlat: 'Tongkat Adaptif Lipat Tuna Netra',
    jenisAlat: 'Penglihatan',
    foto: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    pemilik: 'Pemerintah Kapanewon Temon',
    statusUtama: 'Tersedia',
    stokTotal: 5,
    stokTersedia: 5,
    kondisi: 'Baik',
    deskripsi: 'Tongkat navigasi putih reflektif dapat dilipat 4 bagian, ujung roda pemutar halus untuk deteksi permukaan jalan.'
  },
  {
    id: 'EQ-006',
    namaAlat: 'Kasur Medis Anti-Dekubitus',
    jenisAlat: 'Perawatan',
    foto: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    pemilik: 'Dinas Kesehatan Kulon Progo',
    statusUtama: 'Tersedia',
    stokTotal: 3,
    stokTersedia: 2,
    kondisi: 'Baik',
    deskripsi: 'Matras angin dengan mesin kompresor otomatis bergantian gelembung, mencegah iritasi kulit/luka lecet akibat tirah baring lama.'
  },
  {
    id: 'EQ-007',
    namaAlat: 'Kursi Toilet / Commode Chair Lipat',
    jenisAlat: 'Perawatan',
    foto: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    pemilik: 'Donatur Hibah Warga Temon',
    statusUtama: 'Hibah',
    stokTotal: 3,
    stokTersedia: 3,
    kondisi: 'Baik',
    deskripsi: 'Kursi buang air khusus dengan wadah empuk dan ember penampung medis yang mudah dibersihkan. Dudukan dapat disesuaikan.'
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'REQ-101',
    kodeBooking: 'PRSI-2026-001',
    equipmentId: 'EQ-001',
    namaAlat: 'Kursi Roda Standard Ergonomis',
    namaPemohon: 'Budi Santoso',
    alamatPemohon: 'Padukuhan 2, Kalurahan Glagah, RT 04/RW 02, Kapanewon Temon',
    nomorWaPemohon: '081234567890',
    namaPenggunaAlat: 'Mbah Suparni (82 Thn)',
    catatanKebutuhan: 'Dibutuhkan untuk mobilitas kontrol rutin berobat ke Puskesmas Temon I.',
    stage: 'permintaan_masuk',
    tanggalPengajuan: '2026-07-20',
    durasiHariPinjam: null,
    tanggalMulaiPinjam: null,
    tanggalJatuhTempo: null,
    statusWaReminderSent: false,
    isArchived: false
  },
  {
    id: 'REQ-102',
    kodeBooking: 'PRSI-2026-002',
    equipmentId: 'EQ-003',
    namaAlat: 'Walker Lipat Roda Depan',
    namaPemohon: 'Tri Wahyuni',
    alamatPemohon: 'Padukuhan Palihan I, Kalurahan Palihan, Kapanewon Temon',
    nomorWaPemohon: '085712345678',
    namaPenggunaAlat: 'Dimas Nurcahyo (24 Thn)',
    catatanKebutuhan: 'Latihan jalan pemulihan pasca operasi ligamen lutut.',
    stage: 'permintaan_diterima',
    tanggalPengajuan: '2026-07-01',
    durasiHariPinjam: 24,
    tanggalMulaiPinjam: '2026-07-01',
    tanggalJatuhTempo: '2026-07-25',
    statusWaReminderSent: false,
    isArchived: false
  },
  {
    id: 'REQ-103',
    kodeBooking: 'PRSI-2026-003',
    equipmentId: 'EQ-006',
    namaAlat: 'Kasur Medis Anti-Dekubitus',
    namaPemohon: 'Siti Rahmawati',
    alamatPemohon: 'Padukuhan Temon Kulon RT 02/RW 01, Kalurahan Temon Kulon',
    nomorWaPemohon: '089611223344',
    namaPenggunaAlat: 'Bpk. Ahmad Sunardi (68 Thn)',
    catatanKebutuhan: 'Pasien stroke tirah baring lama.',
    stage: 'permintaan_selesai',
    tanggalPengajuan: '2026-06-10',
    durasiHariPinjam: 30,
    tanggalMulaiPinjam: '2026-06-10',
    tanggalJatuhTempo: '2026-07-10',
    tanggalSelesai: '2026-07-10',
    statusWaReminderSent: true,
    isArchived: false
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (secret !== process.env.SETUP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Seed equipment
    for (const item of INITIAL_EQUIPMENT) {
      await sql`
        INSERT INTO equipment (id, data) VALUES (${item.id}, ${JSON.stringify(item)})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // Seed requests
    for (const req_item of INITIAL_REQUESTS) {
      await sql`
        INSERT INTO requests (id, data) VALUES (${req_item.id}, ${JSON.stringify(req_item)})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    return res.status(200).json({ message: 'Seed data inserted successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: error.message });
  }
}
