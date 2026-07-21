import React, { useState } from 'react';
import { X, CheckCircle, Send, AlertCircle, Phone, User, MapPin, HeartHandshake, ShieldCheck } from 'lucide-react';
import { KALURAHAN_TEMON } from '../data/initialData';

export default function RequestModal({ equipment, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    namaPemohon: '',
    kalurahan: 'Glagah',
    detailAlamat: '',
    nomorWaPemohon: '',
    namaPenggunaAlat: '',
    catatanKebutuhan: ''
  });

  const [error, setError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState(null);

  if (!equipment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPemohon.trim()) {
      setError('Nama Pemohon wajib diisi.');
      return;
    }
    if (!formData.detailAlamat.trim()) {
      setError('Detail Alamat (RT/RW/Padukuhan) wajib diisi.');
      return;
    }
    if (!formData.nomorWaPemohon.trim()) {
      setError('Nomor WA Pemohon aktif wajib diisi.');
      return;
    }
    if (!formData.namaPenggunaAlat.trim()) {
      setError('Nama Pengguna Alat Bantu Disabilitas wajib diisi.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const kodeBooking = `PRSI-2026-${randomSuffix}`;
    const fullAlamat = `${formData.detailAlamat}, Kalurahan ${formData.kalurahan}, Kapanewon Temon`;

    const newRequest = {
      id: `REQ-${Date.now()}`,
      kodeBooking,
      equipmentId: equipment.id,
      namaAlat: equipment.namaAlat,
      namaPemohon: formData.namaPemohon.trim(),
      alamatPemohon: fullAlamat,
      nomorWaPemohon: formData.nomorWaPemohon.trim(),
      namaPenggunaAlat: formData.namaPenggunaAlat.trim(),
      catatanKebutuhan: formData.catatanKebutuhan.trim() || 'Peminjaman alat bantu disabilitas.',
      stage: 'permintaan_masuk',
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      durasiHariPinjam: null,
      tanggalMulaiPinjam: null,
      tanggalJatuhTempo: null,
      statusWaReminderSent: false,
      isArchived: false
    };

    setSubmittedRequest(newRequest);
    onSubmitSuccess(newRequest);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-temon-900 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-temon-500 flex items-center justify-center text-white font-bold">
              ♿
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-temon-300">Form Permohonan Pinjam</span>
              <h2 className="text-lg font-extrabold text-white truncate max-w-xs sm:max-w-sm">
                {equipment.namaAlat}
              </h2>
            </div>
          </div>
        </div>

        {submittedRequest ? (
          /* Receipt / Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Permohonan Berhasil Dikirim!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permohonan pinjam alat bantu disabilitas Anda telah diteruskan ke pihak Superadmin Kapanewon Temon.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Kode Referensi:</span>
                <span className="font-mono font-bold text-temon-700">{submittedRequest.kodeBooking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pemohon:</span>
                <span className="font-bold text-slate-800">{submittedRequest.namaPemohon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pengguna Alat:</span>
                <span className="font-bold text-slate-800">{submittedRequest.namaPenggunaAlat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor WA Pemohon:</span>
                <span className="font-bold text-slate-800">{submittedRequest.nomorWaPemohon}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Pihak Kapanewon Temon akan melakukan konfirmasi via WhatsApp aktif Anda untuk jadwal penyerahan alat.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-temon-600 hover:bg-temon-700 text-white font-bold text-sm rounded-xl transition shadow-md"
            >
              Tutup & Kembali ke Katalog
            </button>
          </div>
        ) : (
          /* Form Input Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Nama Pemohon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Pemohon <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.namaPemohon}
                  onChange={(e) => setFormData({ ...formData, namaPemohon: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-temon-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Nama Pengguna Alat Bantu */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pengguna Alat Bantu Disabilitas <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <HeartHandshake className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.namaPenggunaAlat}
                  onChange={(e) => setFormData({ ...formData, namaPenggunaAlat: e.target.value })}
                  placeholder="Contoh: Mbah Suparni (Penerima Manfaat)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-temon-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Nomor WA Pemohon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WA Pemohon Aktif <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={formData.nomorWaPemohon}
                  onChange={(e) => setFormData({ ...formData, nomorWaPemohon: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-temon-500 focus:bg-white outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Digunakan untuk konfirmasi jadwal & pengingat masa pinjam.</p>
            </div>

            {/* Alamat: Kelurahan & Detail Padukuhan/RT/RW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kalurahan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.kalurahan}
                  onChange={(e) => setFormData({ ...formData, kalurahan: e.target.value })}
                  className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-temon-500 outline-none"
                >
                  {KALURAHAN_TEMON.map((kal) => (
                    <option key={kal} value={kal}>{kal}</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Padukuhan / RT / RW <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.detailAlamat}
                  onChange={(e) => setFormData({ ...formData, detailAlamat: e.target.value })}
                  placeholder="Contoh: Padukuhan II, RT 03/RW 01"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-temon-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Catatan Kebutuhan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan / Kebutuhan Khusus (Opsional)
              </label>
              <textarea
                rows={2}
                value={formData.catatanKebutuhan}
                onChange={(e) => setFormData({ ...formData, catatanKebutuhan: e.target.value })}
                placeholder="Contoh: Dibutuhkan untuk kontrol rutin berobat ke rumah sakit..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-temon-500 focus:bg-white outline-none"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-gradient-to-r from-temon-600 to-teal-600 hover:from-temon-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-temon-600/20 flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Permohonan</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
