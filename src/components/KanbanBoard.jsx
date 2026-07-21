import React, { useState } from 'react';
import { 
  Inbox, CheckCircle2, CheckSquare, Clock, MessageSquare, Archive, 
  User, MapPin, Phone, HeartHandshake, Calendar, AlertTriangle, Send, 
  ArrowRight, ShieldAlert, Sparkles, Filter, Info
} from 'lucide-react';
import SetDurasiModal from './SetDurasiModal';

export default function KanbanBoard({ requests, onRequestStageChange, onArchiveRequest, onDeleteRequest }) {
  const [selectedRequestForDuration, setSelectedRequestForDuration] = useState(null);
  const [filterKalurahan, setFilterKalurahan] = useState('Semua');

  // Helper calculation for remaining days
  const calculateDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper formatting WhatsApp URL
  const handleSendWhatsAppReminder = (req) => {
    const rawPhone = req.nomorWaPemohon.replace(/[^0-9]/g, '');
    let formattedPhone = rawPhone;
    if (rawPhone.startsWith('0')) {
      formattedPhone = '62' + rawPhone.slice(1);
    }

    const daysLeft = calculateDaysRemaining(req.tanggalJatuhTempo);
    const message = `Halo Bpk/Ibu *${req.namaPemohon}*,\n\nKami dari *PERISAI Temon Kapanewon Temon* menginformasikan mengenai peminjaman alat bantu disabilitas *${req.namaAlat}* untuk saudara/i *${req.namaPenggunaAlat}*.\n\nMasa peminjaman alat akan berakhir dalam *${daysLeft} hari lagi* pada tanggal *${req.tanggalJatuhTempo}*.\n\nMohon konfirmasinya apabila alat akan dikembalikan atau jika mengajukan perpanjangan peminjaman. Terima kasih atas kerja samanya.\n\nSalam Inklusif,\n_Pemerintah Kapanewon Temon_`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  };

  const activeRequests = requests.filter(r => !r.isArchived);

  const incomingRequests = activeRequests.filter(r => r.stage === 'permintaan_masuk');
  const acceptedRequests = activeRequests.filter(r => r.stage === 'permintaan_diterima');
  const completedRequests = activeRequests.filter(r => r.stage === 'permintaan_selesai');

  const handleConfirmDuration = (requestId, durasiHari, startDate, dueDate) => {
    onRequestStageChange(requestId, 'permintaan_diterima', {
      durasiHariPinjam: durasiHari,
      tanggalMulaiPinjam: startDate,
      tanggalJatuhTempo: dueDate
    });
    setSelectedRequestForDuration(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header info & status summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-temon-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Logic Management Kanban</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Papan Pengelolaan Permintaan Pinjam Alat
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pindahkan alur permintaan peminjaman alat bantu secara real-time. Perubahan status akan meng-update stok di dashboard umum.
          </p>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center space-x-2">
            <Inbox className="w-4 h-4 text-amber-600" />
            <span>Masuk: <strong>{incomingRequests.length}</strong></span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 font-semibold flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Dipinjam: <strong>{acceptedRequests.length}</strong></span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Selesai: <strong>{completedRequests.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Kanban Board 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* KOLOM 1: PERMINTAAN MASUK */}
        {/* ============================================================ */}
        <div className="bg-slate-100/80 rounded-3xl p-4 border border-slate-200/80 space-y-4 min-h-[550px] flex flex-col">
          {/* Column Header */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200/80 px-4 py-3 rounded-2xl text-amber-900">
            <div className="flex items-center space-x-2">
              <Inbox className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-sm">Permintaan Masuk</h3>
            </div>
            <span className="w-6 h-6 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold flex items-center justify-center">
              {incomingRequests.length}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 px-1">
            Permintaan yang baru dikirim oleh masyarakat. Tinjau info pemohon & tentukan durasi pinjam.
          </p>

          {/* Cards List */}
          <div className="space-y-4 flex-1">
            {incomingRequests.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white/60 rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">Belum ada permintaan masuk baru.</p>
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {req.kodeBooking}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {req.tanggalPengajuan}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm text-temon-800">
                      {req.namaAlat}
                    </h4>
                  </div>

                  {/* Form Pemohon Info */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs border border-slate-100">
                    <div className="flex items-start space-x-2 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">Nama Pemohon:</span>
                        <strong className="text-slate-800">{req.namaPemohon}</strong>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-slate-700">
                      <HeartHandshake className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">Pengguna Alat Disabilitas:</span>
                        <strong className="text-slate-800">{req.namaPenggunaAlat}</strong>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">No WA Aktif:</span>
                        <strong className="text-emerald-700">{req.nomorWaPemohon}</strong>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">Alamat Pemohon:</span>
                        <span className="text-slate-700 leading-snug">{req.alamatPemohon}</span>
                      </div>
                    </div>

                    {req.catatanKebutuhan && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                        "{req.catatanKebutuhan}"
                      </p>
                    )}
                  </div>

                  {/* Card Action */}
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => onDeleteRequest(req.id)}
                      className="px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-semibold rounded-xl transition"
                      title="Tolak Permintaan"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => setSelectedRequestForDuration(req)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <span>Terima & Set Durasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>


        {/* ============================================================ */}
        {/* KOLOM 2: PERMINTAAN DITERIMA (SEDANG DIPINJAM) */}
        {/* ============================================================ */}
        <div className="bg-slate-100/80 rounded-3xl p-4 border border-slate-200/80 space-y-4 min-h-[550px] flex flex-col">
          {/* Column Header */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200/80 px-4 py-3 rounded-2xl text-blue-900">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-sm">Permintaan Diterima</h3>
            </div>
            <span className="w-6 h-6 rounded-full bg-blue-200/80 text-blue-900 text-xs font-bold flex items-center justify-center">
              {acceptedRequests.length}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 px-1">
            Alat bantu sedang dipinjam (stok publik telah berkurang). Pengingat WA aktif H-3 sebelum masa habis.
          </p>

          {/* Cards List */}
          <div className="space-y-4 flex-1">
            {acceptedRequests.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white/60 rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">Tidak ada alat yang sedang dipinjam saat ini.</p>
              </div>
            ) : (
              acceptedRequests.map((req) => {
                const daysLeft = calculateDaysRemaining(req.tanggalJatuhTempo);
                const isWarningWA = daysLeft <= 3;

                return (
                  <div 
                    key={req.id} 
                    className={`bg-white rounded-2xl p-4 shadow-sm border space-y-3 transition hover:shadow-md relative overflow-hidden ${
                      isWarningWA ? 'border-amber-300 ring-2 ring-amber-400/30' : 'border-slate-200'
                    }`}
                  >
                    {isWarningWA && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Masa Pinjam H-{daysLeft > 0 ? daysLeft : 'Habis'}</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between pr-12">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {req.kodeBooking}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm text-temon-800">
                        {req.namaAlat}
                      </h4>
                    </div>

                    {/* Requencer & Loan Detail */}
                    <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs border border-slate-100">
                      <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-slate-200">
                        <div>
                          <span className="text-slate-400 block">Tgl Pinjam:</span>
                          <strong className="text-slate-700">{req.tanggalMulaiPinjam}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Kembali Pada:</span>
                          <strong className="text-blue-700">{req.tanggalJatuhTempo}</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700">
                        Pemohon: <strong>{req.namaPemohon}</strong> ({req.nomorWaPemohon})
                      </p>
                      <p className="text-[11px] text-slate-700">
                        Pengguna: <strong>{req.namaPenggunaAlat}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Alamat: {req.alamatPemohon}
                      </p>
                    </div>

                    {/* Action WhatsApp Reminder & Complete */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => handleSendWhatsAppReminder(req)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm ${
                          isWarningWA 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/20' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim WA Pengingat (H-3)</span>
                      </button>

                      <button
                        onClick={() => onRequestStageChange(req.id, 'permintaan_selesai')}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Selesaikan Peminjaman (Kembalikan Stok)</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>


        {/* ============================================================ */}
        {/* KOLOM 3: PERMINTAAN SELESAI */}
        {/* ============================================================ */}
        <div className="bg-slate-100/80 rounded-3xl p-4 border border-slate-200/80 space-y-4 min-h-[550px] flex flex-col">
          {/* Column Header */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 px-4 py-3 rounded-2xl text-emerald-900">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm">Permintaan Selesai</h3>
            </div>
            <span className="w-6 h-6 rounded-full bg-emerald-200/80 text-emerald-900 text-xs font-bold flex items-center justify-center">
              {completedRequests.length}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 px-1">
            Alat telah dikembalikan (stok publik sudah otomatis bertambah lagi). Siap diarsipkan ke database.
          </p>

          {/* Cards List */}
          <div className="space-y-4 flex-1">
            {completedRequests.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white/60 rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">Belum ada riwayat peminjaman selesai di papan.</p>
              </div>
            ) : (
              completedRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {req.kodeBooking}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Selesai</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm text-temon-800">
                      {req.namaAlat}
                    </h4>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs border border-slate-100">
                    <p className="text-slate-700">Pemohon: <strong>{req.namaPemohon}</strong></p>
                    <p className="text-slate-700">Pengguna: <strong>{req.namaPenggunaAlat}</strong></p>
                    <p className="text-slate-500 text-[11px]">Alamat: {req.alamatPemohon}</p>
                    {req.tanggalSelesai && (
                      <p className="text-[10px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                        Dikembalikan pada: {req.tanggalSelesai}
                      </p>
                    )}
                  </div>

                  {/* Option Arsipkan Sebagai Database */}
                  <button
                    onClick={() => onArchiveRequest(req.id)}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                  >
                    <Archive className="w-4 h-4 text-emerald-400" />
                    <span>Arsipkan sebagai Database</span>
                  </button>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Set Duration Modal */}
      {selectedRequestForDuration && (
        <SetDurasiModal
          request={selectedRequestForDuration}
          onClose={() => setSelectedRequestForDuration(null)}
          onConfirm={handleConfirmDuration}
        />
      )}

    </div>
  );
}
