import React from 'react';
import { X, CheckCircle2, ShieldCheck, Tag, Building, Info, HeartHandshake } from 'lucide-react';

export default function DetailModal({ equipment, onClose, onRequestClick }) {
  if (!equipment) return null;

  const isAvailable = equipment.stokTersedia > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header Image */}
        <div className="relative h-64 bg-slate-100 overflow-hidden">
          <img 
            src={equipment.foto} 
            alt={equipment.namaAlat}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 flex items-center justify-center text-white backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white inline-block">
              {equipment.jenisAlat}
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              {equipment.namaAlat}
            </h2>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5">
          
          {/* Status & Stock Badges */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Sisa Stok Tersedia:</span>
              <strong className={`text-base font-extrabold ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                {equipment.stokTersedia} Unit
              </strong>
              <span className="text-[10px] text-slate-400 block"> (Total Aset: {equipment.stokTotal} Unit)</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Sumber / Pemilik:</span>
              <strong className="text-slate-800 font-bold block truncate">{equipment.pemilik}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold">Status: {equipment.statusUtama || 'Tersedia'}</span>
            </div>
          </div>

          {/* Specification / Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Deskripsi & Spesifikasi Alat</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {equipment.deskripsi}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Kondisi alat: <strong className="text-slate-800">{equipment.kondisi || 'Baik & Siap Pakai'}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={onClose}
              className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                if (isAvailable) onRequestClick(equipment);
              }}
              disabled={!isAvailable}
              className={`w-2/3 py-3 rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center space-x-2 ${
                isAvailable 
                  ? 'bg-temon-600 hover:bg-temon-700 text-white shadow-temon-600/20' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{isAvailable ? 'Ajukan Peminjaman Now' : 'Stok Sedang Kosong'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
