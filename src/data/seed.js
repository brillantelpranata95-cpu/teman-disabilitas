/**
 * Data contoh inventaris — dipakai sekali saat koleksi Firestore masih kosong.
 * Foto memakai Unsplash agar katalog tidak kosong saat pertama dibuka;
 * superadmin dapat menggantinya kapan saja lewat menu Inventaris.
 */
export const INITIAL_EQUIPMENT = [
  {
    id: "EQ-001",
    namaAlat: "Kursi Roda Standard Ergonomis",
    jenisAlat: "Mobilisasi",
    foto: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
    pemilik: "Dinas Sosial Kulon Progo",
    statusUtama: "Tersedia",
    stokTotal: 5,
    stokTersedia: 5,
    kondisi: "Baik",
    deskripsi:
      "Kursi roda lipat berbahan stainless steel dengan sandaran empuk dan rem ganda. Nyaman untuk penggunaan harian lansia & penyandang disabilitas fisik.",
  },
  {
    id: "EQ-002",
    namaAlat: "Kruk Auxiliary (Ketiak) Aluminium",
    jenisAlat: "Mobilisasi",
    foto: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600",
    pemilik: "Pemerintah Kapanewon Temon",
    statusUtama: "Tersedia",
    stokTotal: 8,
    stokTersedia: 8,
    kondisi: "Baik",
    deskripsi:
      "Tongkat ketiak aluminium pasang dengan ketinggian yang dapat disesuaikan. Dilengkapi karet anti-selip di bagian bawah.",
  },
  {
    id: "EQ-003",
    namaAlat: "Walker Lipat Roda Depan",
    jenisAlat: "Mobilisasi",
    foto: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600",
    pemilik: "CSR Bank BDB Temon",
    statusUtama: "Tersedia",
    stokTotal: 4,
    stokTersedia: 4,
    kondisi: "Baik",
    deskripsi:
      "Alat bantu jalan empat kaki dengan dua roda di bagian depan. Sangat stabil untuk pemulihan stroke atau latihan jalan.",
  },
  {
    id: "EQ-004",
    namaAlat: "Alat Bantu Dengar Digital (BTE)",
    jenisAlat: "Pendengaran",
    foto: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600",
    pemilik: "Puskesmas Temon I",
    statusUtama: "Tersedia",
    stokTotal: 6,
    stokTersedia: 6,
    kondisi: "Baik",
    deskripsi:
      "Hearing aid Behind-The-Ear dengan pemrosesan sinyal digital penekan kebisingan latar belakang.",
  },
  {
    id: "EQ-005",
    namaAlat: "Tongkat Adaptif Lipat Tuna Netra",
    jenisAlat: "Penglihatan",
    foto: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    pemilik: "Pemerintah Kapanewon Temon",
    statusUtama: "Tersedia",
    stokTotal: 5,
    stokTersedia: 5,
    kondisi: "Baik",
    deskripsi:
      "Tongkat navigasi putih reflektif dapat dilipat 4 bagian, ujung roda pemutar halus untuk deteksi permukaan jalan.",
  },
  {
    id: "EQ-006",
    namaAlat: "Kasur Medis Anti-Dekubitus",
    jenisAlat: "Perawatan",
    foto: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
    pemilik: "Dinas Kesehatan Kulon Progo",
    statusUtama: "Tersedia",
    stokTotal: 3,
    stokTersedia: 3,
    kondisi: "Baik",
    deskripsi:
      "Matras angin dengan mesin kompresor otomatis bergantian gelembung, mencegah lecet akibat tirah baring lama.",
  },
];
