import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Search, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import EquipmentFormModal from './EquipmentFormModal';

export default function EquipmentManager({ equipmentList, onSaveEquipment, onDeleteEquipment, onResetDefaults }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredList = equipmentList.filter(item => 
    item.namaAlat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jenisAlat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSave = (itemData) => {
    onSaveEquipment(itemData);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Kelola Data Inventaris Alat Bantu Disabilitas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Superadmin dapat menambah jenis alat baru, foto, pemilik/sumber, status, serta jumlah stok yang tersedia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onResetDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Reset ke Seed Data Awal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 shadow-md transition"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>+ Tambah Alat Baru</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari alat berdasarkan nama, jenis, atau pemilik..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-temon-500 outline-none"
        />
      </div>

      {/* Table Equipment Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Informasi Alat</th>
                <th className="py-4 px-4">Jenis</th>
                <th className="py-4 px-4">Pemilik / Sumber</th>
                <th className="py-4 px-4">Status Utama</th>
                <th className="py-4 px-4 text-center">Stok Total</th>
                <th className="py-4 px-4 text-center">Stok Tersedia</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada data alat bantu disabilitas ditemukan.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Item Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.foto} 
                          alt={item.namaAlat}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600';
                          }}
                        />
                        <div>
                          <span className="font-mono text-[10px] text-slate-400 font-bold block">{item.id}</span>
                          <strong className="text-slate-900 font-bold text-sm">{item.namaAlat}</strong>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{item.deskripsi}</p>
                        </div>
                      </div>
                    </td>

                    {/* Jenis */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.jenisAlat}
                      </span>
                    </td>

                    {/* Pemilik */}
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{item.pemilik}</span>
                    </td>

                    {/* Status Utama */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.statusUtama === 'Tersedia' ? 'bg-emerald-100 text-emerald-800' :
                        item.statusUtama === 'Hibah' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {item.statusUtama || 'Tersedia'}
                      </span>
                    </td>

                    {/* Stok Total */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-slate-900">{item.stokTotal} Unit</span>
                    </td>

                    {/* Stok Tersedia */}
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-extrabold text-xs ${
                        item.stokTersedia > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.stokTersedia} Unit
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Edit Data Alat"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEquipment(item.id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                          title="Hapus Data Alat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Form Modal */}
      {isFormOpen && (
        <EquipmentFormModal
          equipmentToEdit={editingItem}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}

    </div>
  );
}
