import React, { useState } from 'react';
import { X, Calendar, Clock, Check, AlertCircle } from 'lucide-react';

export default function SetDurasiModal({ request, onClose, onConfirm }) {
  const [durasiHari, setDurasiHari] = useState(14); // Default 14 hari
  const [customDate, setCustomDate] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);

  if (!request) return null;

  const handleSave = () => {
    let returnDate = '';
    let duration = durasiHari;

    const startDate = new Date();
    
    if (useCustomDate && customDate) {
      returnDate = customDate;
      const diffTime = Math.abs(new Date(customDate) - startDate);
      duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + parseInt(durasiHari));
      returnDate = targetDate.toISOString().split('T')[0];
    }

    onConfirm(request.id, duration, startDate.toISOString().split('T')[0], returnDate);
  };

  const presets = [7, 14, 30, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Set Durasi Peminjaman</span>
              <h3 className="text-base font-bold text-white truncate max-w-xs">{request.namaAlat}</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1">
            <p className="text-slate-500">Pemohon: <strong className="text-slate-800">{request.namaPemohon}</strong></p>
            <p className="text-slate-500">Pengguna: <strong className="text-slate-800">{request.namaPenggunaAlat}</strong></p>
            <p className="text-slate-500">Alamat: <strong className="text-slate-800">{request.alamatPemohon}</strong></p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Berapa hari alat bantu disabilitas ini dipinjamkan?
            </label>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1.5">
              {presets.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setDurasiHari(days);
                    setUseCustomDate(false);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition border ${
                    !useCustomDate && durasiHari === days
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {days} Hari
                </button>
              ))}
            </div>

            {/* Custom Date Option */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomDate}
                  onChange={(e) => setUseCustomDate(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Pilih Tanggal Pengembalian Spesifik</span>
              </label>

              {useCustomDate && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Menyetujui permintaan ini akan <strong>mengurangi stok publik</strong> alat <em>{request.namaAlat}</em> sebanyak 1 unit.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={onClose}
              className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Terima & Kurangi Stok</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
