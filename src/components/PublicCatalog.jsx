import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, ShieldCheck, Accessibility, ArrowRight, Info, Eye, Sparkles, HeartHandshake, MapPin } from 'lucide-react';

export default function PublicCatalog({ equipmentList, onRequestClick, onDetailClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Mobilisasi', 'Pendengaran', 'Penglihatan', 'Perawatan'];

  const filteredEquipment = equipmentList.filter(item => {
    const matchesSearch = item.namaAlat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.pemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.jenisAlat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalAvailable = equipmentList.reduce((acc, curr) => acc + (curr.stokTersedia || 0), 0);
  const totalItems = equipmentList.reduce((acc, curr) => acc + (curr.stokTotal || 0), 0);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-temon-900 to-slate-950 text-white p-8 sm:p-12 shadow-2xl">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-temon-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-temon-500/20 border border-temon-400/30 text-temon-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Layanan Inklusif Kapanewon Temon</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Ketersediaan Alat Bantu Disabilitas <br className="hidden sm:block"/>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Kapanewon Temon
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Masyarakat Kapanewon Temon dapat mengecek ketersediaan stok alat bantu disabilitas (kursi roda, kruk, hearing aid, matras dekubitus, dll.) secara transparan dan mengajukan permohonan pinjam tanpa biaya secara online.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#katalog" 
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-white text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transform transition hover:-translate-y-0.5"
              >
                <span>Cari & Pinjam Alat Bantu</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center space-x-2 text-xs text-slate-300 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Siap diantar/diambil di Kantor Kapanewon Temon</span>
              </div>
            </div>
          </div>

          {/* Stat Cards Overlay */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 text-white space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span>Stok Siap Dipinjam</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">{totalAvailable} <span className="text-sm font-medium text-slate-300">Unit</span></div>
              <p className="text-xs text-slate-400">Dari total {totalItems} unit alat inventaris yang tercatat.</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 text-white space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span>Alur Pengajuan Transparan</span>
                <HeartHandshake className="w-4 h-4 text-teal-300" />
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Permintaan masyarakat diproses cepat oleh Superadmin Kapanewon via sistem Kanban dengan konfirmasi WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Filter & Search Section */}
      <div id="katalog" className="space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-temon-600 text-white shadow-md shadow-temon-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama alat, pemilik, dll..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-temon-500 focus:bg-white transition"
            />
          </div>

        </div>

        {/* Equipment Grid */}
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Info className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">Tidak Ada Alat Bantu Ditemukan</h3>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori filter Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => {
              const isAvailable = item.stokTersedia > 0;
              return (
                <div 
                  key={item.id} 
                  className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                    <img 
                      src={item.foto} 
                      alt={item.namaAlat}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md ${
                        isAvailable 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-rose-500 text-white'
                      }`}>
                        {isAvailable ? `${item.stokTersedia} Tersedia` : 'Stok Sedang Kosong'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 text-slate-200 backdrop-blur-md border border-white/20">
                        {item.jenisAlat}
                      </span>
                    </div>

                    {/* Owner Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-semibold truncate max-w-[200px] text-slate-200 bg-slate-900/60 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10">
                        Sumber: {item.pemilik}
                      </span>
                      <span className="text-[11px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                        {item.statusUtama || 'Tersedia'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-temon-700 transition-colors">
                        {item.namaAlat}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.deskripsi}
                      </p>
                    </div>

                    {/* Stock Detail & Info */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Kondisi: <strong className="text-slate-700">{item.kondisi || 'Baik'}</strong></span>
                      <span>Total Aset: <strong className="text-slate-700">{item.stokTotal} Unit</strong></span>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onDetailClick(item)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => isAvailable && onRequestClick(item)}
                        disabled={!isAvailable}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm ${
                          isAvailable
                            ? 'bg-temon-600 hover:bg-temon-700 text-white shadow-temon-600/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>{isAvailable ? 'Ajukan Pinjam' : 'Stok Kosong'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
