import React, { useState } from 'react';
import { Database, Search, Printer, Download, CheckCircle2, Archive, Calendar, User, MapPin } from 'lucide-react';

export default function ArchiveView({ requests }) {
  const [searchQuery, setSearchQuery] = useState('');

  const archivedRequests = requests.filter(r => r.isArchived || r.stage === 'permintaan_selesai');

  const filteredArchives = archivedRequests.filter(req => 
    req.kodeBooking.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.namaPenggunaAlat.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.alamatPemohon.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.namaAlat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Kode Booking", "Tanggal Pengajuan", "Alat Bantu", "Nama Pemohon", "No WA Pemohon", "Nama Pengguna Disabilitas", "Alamat", "Tanggal Pinjam", "Tanggal Selesai", "Status"];
    const rows = filteredArchives.map(r => [
      r.kodeBooking, r.tanggalPengajuan, `"${r.namaAlat}"`, `"${r.namaPemohon}"`, r.nomorWaPemohon,
      `"${r.namaPenggunaAlat}"`, `"${r.alamatPemohon}"`, r.tanggalMulaiPinjam || '-',
      r.tanggalSelesai || r.tanggalJatuhTempo || '-', r.isArchived ? 'Diarsipkan' : 'Selesai'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Rekap_Database_Disabilitas_Temon_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Database Arsip & Riwayat Peminjaman</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-950">Rekap Data Histori Kapanewon Temon</h2>
          <p className="text-xs text-slate-500 mt-0.5">Daftar seluruh riwayat transaksi permohonan pinjam alat disabilitas yang telah diarsipkan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleExportCSV} className="px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-xl hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-2 transition-all duration-200">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button onClick={handlePrint} className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-slate-950/20 transition-all duration-200">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md no-print">
        <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama pemohon, pengguna, kode, atau kelurahan..."
          className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-400"
        />
      </div>

      {/* Archive Table */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-900/5 overflow-hidden">
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Archive className="w-4 h-4 text-emerald-400" />
            <span>REKAPITULASI PEMINJAMAN ALAT BANTU DISABILITAS KAPANEWON TEMON</span>
          </div>
          <span className="text-xs text-slate-400">Total Record: {filteredArchives.length} Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/60 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4">Kode & Tanggal</th>
                <th className="py-4 px-4">Alat Bantu</th>
                <th className="py-4 px-4">Nama Pemohon & No WA</th>
                <th className="py-4 px-4">Nama Pengguna Disabilitas</th>
                <th className="py-4 px-4">Alamat Pemohon</th>
                <th className="py-4 px-4">Tanggal Pinjam - Selesai</th>
                <th className="py-4 px-4 text-center">Status Arsip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredArchives.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">Belum ada riwayat permohonan yang diarsipkan.</td></tr>
              ) : filteredArchives.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-all duration-150">
                  <td className="py-4 px-4 font-mono font-bold text-slate-950">
                    <div>{req.kodeBooking}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{req.tanggalPengajuan}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-950 text-emerald-800">{req.namaAlat}</td>
                  <td className="py-4 px-4">
                    <strong className="text-slate-950">{req.namaPemohon}</strong>
                    <span className="block text-[11px] text-emerald-700 font-medium">{req.nomorWaPemohon}</span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">{req.namaPenggunaAlat}</td>
                  <td className="py-4 px-4 text-slate-600 text-[11px] max-w-xs">{req.alamatPemohon}</td>
                  <td className="py-4 px-4 text-slate-600 text-[11px]">
                    <div>Pinjam: {req.tanggalMulaiPinjam || '-'}</div>
                    <div>Kembali: {req.tanggalSelesai || req.tanggalJatuhTempo || '-'}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center space-x-1 ${req.isArchived ? 'bg-slate-950 text-white border border-slate-950/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{req.isArchived ? 'Diarsipkan' : 'Selesai'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}