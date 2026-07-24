import React from 'react';
import { X, CheckCircle2, ShieldCheck, Tag, Building, Info, HeartHandshake } from 'lucide-react';

export default function DetailModal({ equipment, onClose, onRequestClick }) {
  if (!equipment) return null;
  const isAvailable = equipment.stokTersedia > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/60 overflow-hidden my-8">
        
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

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
            <span className="px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white inline-block">
              {equipment.jenisAlat}
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              {equipment.namaAlat}
            </h2>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-7 space-y-6">
          
          {/* Status & Stock Badges */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Sisa Stok Tersedia:</span>
              <strong className={`text-base font-extrabold block mt-0.5 ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                {equipment.stokTersedia} Unit
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5"> (Total Aset: {equipment.stokTotal} Unit)</span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Sumber / Pemilik:</span>
              <strong className="text-slate-800 font-bold block truncate mt-0.5">{equipment.pemilik}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Status: {equipment.statusUtama || 'Tersedia'}</span>
            </div>
          </div>

          {/* Specification / Description */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Deskripsi & Spesifikasi Alat</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
              {equipment.deskripsi}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            <span>Kondisi alat: <strong className="text-slate-800">{equipment.kondisi || 'Baik & Siap Pakai'}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={onClose}
              className="w-1/3 py-3 px-4 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/60 transition-all duration-200"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                if (isAvailable) onRequestClick(equipment);
              }}
              disabled={!isAvailable}
              className={`w-2/3 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-200 shadow-md flex items-center justify-center space-x-2 ${
                isAvailable 
                  ? 'bg-slate-950 hover:bg-slate-900 text-white shadow-slate-950/20' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{isAvailable ? 'Ajukan Peminjaman' : 'Stok Sedang Kosong'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}