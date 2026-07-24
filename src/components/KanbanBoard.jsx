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

  const calculateDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const handleSendWhatsAppReminder = (req) => {
    const rawPhone = req.nomorWaPemohon.replace(/[^0-9]/g, '');
    let formattedPhone = rawPhone;
    if (rawPhone.startsWith('0')) {
      formattedPhone = '62' + rawPhone.slice(1);
    }
    const daysLeft = calculateDaysRemaining(req.tanggalJatuhTempo);
    const message = `Halo Bpk/Ibu *${req.namaPemohon}*,\n\nKami dari *PERISAI Temon Kapanewon Temon* menginformasikan mengenai peminjaman alat bantu disabilitas *${req.namaAlat}* untuk saudara/i *${req.namaPenggunaAlat}*.\n\nMasa peminjaman alat akan berakhir dalam *${daysLeft} hari lagi* pada tanggal *${req.tanggalJatuhTempo}*.\n\nMohon konfirmasinya apabila alat akan dikembalikan atau jika mengajukan perpanjangan peminjaman. Terima kasih atas kerja samanya.\n\nSalam Inklusif,\n_Pemerintah Kapanewon Temon_`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
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

  const renderColumnHeader = (icon, iconColor, bgColor, borderColor, textColor, countColor, title, count) => (
    <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${bgColor} ${borderColor}`}>
      <div className="flex items-center space-x-2.5">
        {icon}
        <h3 className={`font-extrabold text-sm ${textColor}`}>{title}</h3>
      </div>
      <span className={`w-7 h-7 rounded-full ${countColor} text-xs font-bold flex items-center justify-center`}>{count}</span>
    </div>
  );

  const renderEmptyState = (text) => (
    <div className="text-center py-14 px-4 bg-white/50 backdrop-blur-xl rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
      <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
      <p className="text-xs font-medium">{text}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Logic Management Kanban</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-950">Papan Pengelolaan Permintaan Pinjam Alat</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pindahkan alur permintaan peminjaman alat bantu secara real-time.</p>
        </div>
        <div className="flex items-center space-x-2.5 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 font-semibold flex items-center space-x-2">
            <Inbox className="w-3.5 h-3.5 text-amber-600" />
            <span>Masuk: <strong>{incomingRequests.length}</strong></span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 font-semibold flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Dipinjam: <strong>{acceptedRequests.length}</strong></span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Selesai: <strong>{completedRequests.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Kanban 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* Column 1: Permintaan Masuk */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 space-y-3 min-h-[550px] flex flex-col shadow-sm shadow-slate-900/5">
          {renderColumnHeader(
            <Inbox className="w-4.5 h-4.5 text-amber-500" />,
            '', 'bg-amber-50', 'border border-amber-100', 'text-amber-800',
            'bg-amber-100 text-amber-800',
            'Permintaan Masuk', incomingRequests.length
          )}
          <p className="text-[11px] text-slate-500 px-1">Permintaan baru dari masyarakat. Tinjau & tentukan durasi pinjam.</p>

          <div className="space-y-3.5 flex-1">
            {incomingRequests.length === 0 ? renderEmptyState('Belum ada permintaan masuk baru.') :
              incomingRequests.map((req) => (
                <div key={req.id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-slate-200/60 space-y-3 transition-all duration-200 hover:shadow-md hover:border-slate-300/60">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-100">{req.kodeBooking}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{req.tanggalPengajuan}</span>
                  </div>
                  <h4 className="font-bold text-slate-950 text-sm">{req.namaAlat}</h4>
                  
                  <div className="bg-slate-50/80 rounded-xl p-3 space-y-2.5 text-xs border border-slate-200/60">
                    <div className="flex items-start space-x-2 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div><span className="text-slate-400 text-[10px] block">Pemohon:</span><strong className="text-slate-800">{req.namaPemohon}</strong></div>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <HeartHandshake className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div><span className="text-slate-400 text-[10px] block">Pengguna Alat:</span><strong className="text-slate-800">{req.namaPenggunaAlat}</strong></div>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div><span className="text-slate-400 text-[10px] block">WA:</span><strong className="text-emerald-700">{req.nomorWaPemohon}</strong></div>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div><span className="text-slate-400 text-[10px] block">Alamat:</span><span className="text-slate-700 leading-snug">{req.alamatPemohon}</span></div>
                    </div>
                    {req.catatanKebutuhan && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">"{req.catatanKebutuhan}"</p>
                    )}
                  </div>

                  <div className="pt-1.5 flex items-center space-x-2">
                    <button onClick={() => onDeleteRequest(req.id)} className="px-3 py-2 bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-semibold rounded-xl transition-all duration-200">Tolak</button>
                    <button onClick={() => setSelectedRequestForDuration(req)} className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-slate-950/20 flex items-center justify-center space-x-1.5">
                      <span>Terima & Set Durasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Column 2: Diterima */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 space-y-3 min-h-[550px] flex flex-col shadow-sm shadow-slate-900/5">
          {renderColumnHeader(
            <Clock className="w-4.5 h-4.5 text-blue-500" />,
            '', 'bg-blue-50', 'border border-blue-100', 'text-blue-800',
            'bg-blue-100 text-blue-800',
            'Diterima (Dipinjam)', acceptedRequests.length
          )}
          <p className="text-[11px] text-slate-500 px-1">Alat sedang dipinjam. Pengingat WA aktif H-3 sebelum masa habis.</p>

          <div className="space-y-3.5 flex-1">
            {acceptedRequests.length === 0 ? renderEmptyState('Tidak ada alat yang sedang dipinjam.') :
              acceptedRequests.map((req) => {
                const daysLeft = calculateDaysRemaining(req.tanggalJatuhTempo);
                const isWarningWA = daysLeft <= 3;
                return (
                  <div key={req.id} className={`bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-sm space-y-3 transition-all duration-200 hover:shadow-md relative overflow-hidden ${isWarningWA ? 'border border-amber-300 shadow-amber-100/50' : 'border border-slate-200/60 hover:border-slate-300/60'}`}>
                    {isWarningWA && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>H-{daysLeft > 0 ? daysLeft : 'Habis'}</span>
                      </div>
                    )}
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100">{req.kodeBooking}</span>
                    <h4 className="font-bold text-slate-950 text-sm">{req.namaAlat}</h4>
                    <div className="bg-slate-50/80 rounded-xl p-3 space-y-2 text-xs border border-slate-200/60">
                      <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-slate-200/60">
                        <div><span className="text-slate-400 block">Pinjam:</span><strong className="text-slate-700">{req.tanggalMulaiPinjam}</strong></div>
                        <div><span className="text-slate-400 block">Kembali:</span><strong className="text-blue-700">{req.tanggalJatuhTempo}</strong></div>
                      </div>
                      <p className="text-[11px] text-slate-700">Pemohon: <strong>{req.namaPemohon}</strong> ({req.nomorWaPemohon})</p>
                      <p className="text-[11px] text-slate-700">Pengguna: <strong>{req.namaPenggunaAlat}</strong></p>
                      <p className="text-[11px] text-slate-500 truncate">Alamat: {req.alamatPemohon}</p>
                    </div>
                    <div className="space-y-2 pt-1">
                      <button onClick={() => handleSendWhatsAppReminder(req)} className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${isWarningWA ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim WA Pengingat (H-3)</span>
                      </button>
                      <button onClick={() => onRequestStageChange(req.id, 'permintaan_selesai')} className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-slate-950/20 flex items-center justify-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Selesaikan Peminjaman</span>
                      </button>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

        {/* Column 3: Selesai */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 space-y-3 min-h-[550px] flex flex-col shadow-sm shadow-slate-900/5">
          {renderColumnHeader(
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />,
            '', 'bg-emerald-50', 'border border-emerald-100', 'text-emerald-800',
            'bg-emerald-100 text-emerald-800',
            'Permintaan Selesai', completedRequests.length
          )}
          <p className="text-[11px] text-slate-500 px-1">Alat dikembalikan. Stok publik sudah otomatis bertambah.</p>

          <div className="space-y-3.5 flex-1">
            {completedRequests.length === 0 ? renderEmptyState('Belum ada riwayat peminjaman selesai.') :
              completedRequests.map((req) => (
                <div key={req.id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-slate-200/60 space-y-3 transition-all duration-200 hover:shadow-md hover:border-slate-300/60">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{req.kodeBooking}</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Selesai</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-950 text-sm">{req.namaAlat}</h4>
                  <div className="bg-slate-50/80 rounded-xl p-3 space-y-1.5 text-xs border border-slate-200/60">
                    <p className="text-slate-700">Pemohon: <strong>{req.namaPemohon}</strong></p>
                    <p className="text-slate-700">Pengguna: <strong>{req.namaPenggunaAlat}</strong></p>
                    <p className="text-slate-500 text-[11px]">Alamat: {req.alamatPemohon}</p>
                    {req.tanggalSelesai && (
                      <p className="text-[10px] text-emerald-700 font-semibold pt-1 border-t border-slate-200/60">Dikembalikan: {req.tanggalSelesai}</p>
                    )}
                  </div>
                  <button onClick={() => onArchiveRequest(req.id)} className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-slate-950/20 flex items-center justify-center space-x-2">
                    <Archive className="w-4 h-4 text-emerald-400" />
                    <span>Arsipkan sebagai Database</span>
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {selectedRequestForDuration && (
        <SetDurasiModal request={selectedRequestForDuration} onClose={() => setSelectedRequestForDuration(null)} onConfirm={handleConfirmDuration} />
      )}
    </div>
  );
}