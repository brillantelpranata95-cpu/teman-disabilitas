import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Accessibility, Package, Image as ImageIcon, Building, Tag } from 'lucide-react';

export default function EquipmentFormModal({ equipmentToEdit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    namaAlat: '',
    jenisAlat: 'Mobilisasi',
    foto: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    pemilik: 'Dinas Sosial Kulon Progo',
    statusUtama: 'Tersedia',
    stokTotal: 1,
    stokTersedia: 1,
    kondisi: 'Baik',
    deskripsi: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (equipmentToEdit) {
      setFormData({ ...equipmentToEdit });
    }
  }, [equipmentToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaAlat.trim()) {
      setError('Nama Alat Bantu wajib diisi.');
      return;
    }
    if (!formData.pemilik.trim()) {
      setError('Pemilik/Sumber Alat wajib diisi.');
      return;
    }
    if (formData.stokTotal < 1) {
      setError('Stok total minimal 1 unit.');
      return;
    }

    onSave({
      ...formData,
      id: equipmentToEdit ? equipmentToEdit.id : `EQ-${Date.now()}`,
      stokTotal: parseInt(formData.stokTotal),
      stokTersedia: parseInt(formData.stokTersedia)
    });
  };

  const presetPhotos = [
    { label: 'Kursi Roda', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600' },
    { label: 'Kruk / Tongkat', url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600' },
    { label: 'Walker Jalan', url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600' },
    { label: 'Alat Dengar', url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600' },
    { label: 'Matras Dekubitus', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-temon-600 flex items-center justify-center text-white font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-temon-400 uppercase tracking-wider">
                {equipmentToEdit ? 'Edit Data Alat' : 'Input Alat Bantu Baru'}
              </span>
              <h3 className="text-lg font-bold text-white">Inventaris Kapanewon Temon</h3>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Nama Alat & Jenis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Alat Bantu Disabilitas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaAlat}
                onChange={(e) => setFormData({ ...formData, namaAlat: e.target.value })}
                placeholder="Contoh: Kursi Roda Standard Ergonomis"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-temon-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Alat
              </label>
              <select
                value={formData.jenisAlat}
                onChange={(e) => setFormData({ ...formData, jenisAlat: e.target.value })}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-temon-500 outline-none"
              >
                <option value="Mobilisasi">Mobilisasi</option>
                <option value="Pendengaran">Pendengaran</option>
                <option value="Penglihatan">Penglihatan</option>
                <option value="Perawatan">Perawatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Pemilik & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pemilik / Sumber Alat <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pemilik}
                onChange={(e) => setFormData({ ...formData, pemilik: e.target.value })}
                placeholder="Contoh: Dinsos Kulon Progo / Hibah Donatur"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-temon-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Utama
              </label>
              <select
                value={formData.statusUtama}
                onChange={(e) => setFormData({ ...formData, statusUtama: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-temon-500 outline-none"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjamkan">Dipinjamkan</option>
                <option value="Hibah">Hibah</option>
                <option value="Perbaikan">Perbaikan</option>
              </select>
            </div>
          </div>

          {/* Stok Total & Tersedia & Kondisi */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Total</label>
              <input
                type="number"
                min="1"
                value={formData.stokTotal}
                onChange={(e) => setFormData({ ...formData, stokTotal: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-temon-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Tersedia</label>
              <input
                type="number"
                min="0"
                max={formData.stokTotal}
                value={formData.stokTersedia}
                onChange={(e) => setFormData({ ...formData, stokTersedia: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-temon-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kondisi</label>
              <select
                value={formData.kondisi}
                onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-temon-500 outline-none"
              >
                <option value="Baik">Baik</option>
                <option value="Perlu Perbaikan Sedikit">Perlu Perbaikan</option>
              </select>
            </div>
          </div>

          {/* Foto URL & Preset */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Foto Alat Bantu (URL Image)</label>
            <input
              type="text"
              value={formData.foto}
              onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-temon-500 outline-none"
            />
            
            {/* Quick Presets */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Pilih Gambar:</span>
              {presetPhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, foto: preset.url })}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 whitespace-nowrap"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Spesifikasi & Penggunaan</label>
            <textarea
              rows={3}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Jelaskan fitur alat, kesesuaian pengguna, dll..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-temon-500 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Simpan Data Inventaris</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
