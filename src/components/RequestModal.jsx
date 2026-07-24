import React, { useState } from 'react';
import { X, CheckCircle, Send, AlertCircle, Phone, User, MapPin, HeartHandshake, ShieldCheck } from 'lucide-react';
import { KALURAHAN_TEMON } from '../data/initialData';

export default function RequestModal({ equipment, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    namaPemohon: '', kalurahan: 'Glagah', detailAlamat: '', nomorWaPemohon: '',
    namaPenggunaAlat: '', catatanKebutuhan: ''
  });
  const [error, setError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState(null);

  if (!equipment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPemohon.trim()) { setError('Nama Pemohon wajib diisi.'); return; }
    if (!formData.detailAlamat.trim()) { setError('Detail Alamat (RT/RW/Padukuhan) wajib diisi.'); return; }
    if (!formData.nomorWaPemohon.trim()) { setError('Nomor WA Pemohon wajib diisi.'); return; }
    if (!formData.namaPenggunaAlat.trim()) { setError('Nama Pengguna Alat wajib diisi.'); return; }

    const kodeBooking = `PRSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullAlamat = `${formData.detailAlamat}, Kalurahan ${formData.kalurahan}, Kapanewon Temon`;

    const newRequest = {
      id: `REQ-${Date.now()}`, kodeBooking, equipmentId: equipment.id, namaAlat: equipment.namaAlat,
      namaPemohon: formData.namaPemohon.trim(), alamatPemohon: fullAlamat, nomorWaPemohon: formData.nomorWaPemohon.trim(),
      namaPenggunaAlat: formData.namaPenggunaAlat.trim(), catatanKebutuhan: formData.catatanKebutuhan.trim() || 'Peminjaman alat bantu disabilitas.',
      stage: 'permintaan_masuk', tanggalPengajuan: new Date().toISOString().split('T')[0],
      durasiHariPinjam: null, tanggalMulaiPinjam: null, tanggalJatuhTempo: null, statusWaReminderSent: false, isArchived: false
    };

    setSubmittedRequest(newRequest);
    onSubmitSuccess(newRequest);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/60 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold"><span className="text-lg">♿</span></div>
            <div>
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Form Permohonan Pinjam</span>
              <h2 className="text-lg font-extrabold text-white truncate max-w-xs sm:max-w-sm">{equipment.namaAlat}</h2>
            </div>
          </div>
        </div>

        {submittedRequest ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"><CheckCircle className="w-10 h-10 stroke-[2.5]" /></div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-950">Permohonan Berhasil Dikirim!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Permohonan pinjam alat bantu disabilitas telah diteruskan ke Superadmin Kapanewon Temon.</p>
            </div>
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Kode Referensi:</span>
                <span className="font-mono font-bold text-emerald-700">{submittedRequest.kodeBooking}</span>
              </div>
              <div className="flex justify-between"><span className="text-slate-500">Pemohon:</span><span className="font-bold text-slate-800">{submittedRequest.namaPemohon}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Pengguna:</span><span className="font-bold text-slate-800">{submittedRequest.namaPenggunaAlat}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">WA:</span><span className="font-bold text-slate-800">{submittedRequest.nomorWaPemohon}</span></div>
            </div>
            <p className="text-[11px] text-slate-400">Kapanewon akan konfirmasi via WhatsApp untuk jadwal penyerahan.</p>
            <button onClick={onClose} className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-slate-950/20">Tutup & Kembali ke Katalog</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-rose-50/80 border border-rose-200/60 rounded-xl text-xs text-rose-700 flex items-center space-x-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Pemohon <span className="text-rose-500">*</span></label>
              <div className="relative"><User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={formData.namaPemohon} onChange={(e) => setFormData({...formData, namaPemohon: e.target.value})} placeholder="Budi Santoso" className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition" /></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pengguna Alat Bantu <span className="text-rose-500">*</span></label>
              <div className="relative"><HeartHandshake className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={formData.namaPenggunaAlat} onChange={(e) => setFormData({...formData, namaPenggunaAlat: e.target.value})} placeholder="Mbah Suparni (Penerima Manfaat)" className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition" /></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WA Aktif <span className="text-rose-500">*</span></label>
              <div className="relative"><Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="tel" value={formData.nomorWaPemohon} onChange={(e) => setFormData({...formData, nomorWaPemohon: e.target.value})} placeholder="081234567890" className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition" /></div>
              <p className="text-[10px] text-slate-400 mt-1">Untuk konfirmasi jadwal & pengingat masa pinjam.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kalurahan <span className="text-rose-500">*</span></label>
                <select value={formData.kalurahan} onChange={(e) => setFormData({...formData, kalurahan: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition">
                  {KALURAHAN_TEMON.map((kal) => (<option key={kal} value={kal}>{kal}</option>))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Padukuhan / RT / RW <span className="text-rose-500">*</span></label>
                <input type="text" value={formData.detailAlamat} onChange={(e) => setFormData({...formData, detailAlamat: e.target.value})} placeholder="Padukuhan II, RT 03/RW 01" className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan / Kebutuhan (Opsional)</label>
              <textarea rows={2} value={formData.catatanKebutuhan} onChange={(e) => setFormData({...formData, catatanKebutuhan: e.target.value})} placeholder="Contoh: Untuk kontrol rutin berobat ke rumah sakit..." className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition resize-none" />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button type="button" onClick={onClose} className="w-1/3 py-2.5 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl transition-all duration-200 border border-slate-200/60">Batal</button>
              <button type="submit" className="w-2/3 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md shadow-slate-950/20 flex items-center justify-center space-x-1.5 transition-all duration-200"><Send className="w-3.5 h-3.5" /><span>Kirim Permohonan</span></button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}