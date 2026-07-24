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
    <div className="space-y-12 pb-20">
      {/* Hero Section - Borderless, Natural, Apple-style */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        {/* Subtle background depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-white" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Eyebrow badge - subtle */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/60 text-slate-700 text-xs font-medium shadow-sm shadow-slate-900/5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Layanan Inklusif Kapanewon Temon</span>
          </div>

          {/* Headline - High contrast, Apple-style typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.05] mb-6">
            Ketersediaan Alat Bantu<br className="hidden sm:block" />
            <span className="text-emerald-600 font-extrabold">Disabilitas Kapanewon Temon</span>
          </h1>

          {/* Body text - Better contrast, readable */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10 font-normal">
            Masyarakat Kapanewon Temon dapat mengecek ketersediaan stok alat bantu disabilitas 
            <span className="text-slate-800 font-medium">(kursi roda, kruk, hearing aid, matras dekubitus, dll.)</span> 
            secara transparan dan mengajukan permohonan pinjam tanpa biaya secara online.
          </p>

          {/* CTA Row - Apple-style buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a 
              href="#katalog" 
              className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-950 text-white font-semibold text-sm sm:text-base shadow-[0_4px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Cari & Pinjam Alat Bantu</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 text-slate-700 text-sm font-medium shadow-sm shadow-slate-900/5 hover:bg-white hover:border-slate-300/60 transition-all duration-300">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Siap diantar/diambil di Kantor Kapanewon Temon</span>
            </div>
          </div>

          {/* Stat Cards - Glassmorphism, inline with hero flow */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="relative p-6 rounded-2xl bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-sm shadow-slate-900/5 hover:border-slate-300/60 hover:shadow-md hover:shadow-slate-900/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Stok Siap Dipinjam</span>
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-slate-950 leading-none">
                {totalAvailable}
                <span className="text-lg font-normal text-slate-400 ml-1">Unit</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Dari total {totalItems} unit alat inventaris tercatat</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-sm shadow-slate-900/5 hover:border-slate-300/60 hover:shadow-md hover:shadow-slate-900/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Proses Transparan</span>
                <HeartHandshake className="w-4.5 h-4.5 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Permintaan diproses cepat oleh Superadmin via sistem Kanban dengan konfirmasi WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="katalog" className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
            Katalog Alat Bantu
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            {filteredEquipment.length} dari {equipmentList.length} alat tersedia
          </p>
        </div>

        {/* Filter & Search Bar - Glassmorphism */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-sm shadow-slate-900/5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px] flex-1 sm:flex-none">
            <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama alat, pemilik, deskripsi..."
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-20 px-8 bg-white/50 backdrop-blur-xl border border-slate-200/60 rounded-3xl">
            <Info className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Tidak Ada Alat Bantu Ditemukan</h3>
            <p className="text-sm text-slate-500">Coba ubah kata kunci pencarian atau kategori filter Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => {
              const isAvailable = item.stokTersedia > 0;
              return (
                <article 
                  key={item.id} 
                  className="group relative bg-white/70 backdrop-blur-2xl rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 hover:border-slate-300/60 hover:-translate-y-1 transition-all duration-400 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-52 sm:h-56 bg-slate-100 overflow-hidden">
                    <img 
                      src={item.foto} 
                      alt={item.namaAlat}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600';
                      }}
                      loading="lazy"
                    />
                    {/* Subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Status Badges - Top */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-lg backdrop-blur-sm ${
                        isAvailable 
                          ? 'bg-emerald-500/90 text-white border border-emerald-400/30' 
                          : 'bg-rose-500/90 text-white border border-rose-400/30'
                      }`}>
                        {isAvailable ? `${item.stokTersedia} Tersedia` : 'Stok Sedang Kosong'}
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/60 shadow-lg">
                        {item.jenisAlat}
                      </span>
                    </div>

                    {/* Owner Badge - Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                      <span className="font-medium truncate max-w-[180px] text-slate-100 bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                        Sumber: {item.pemilik}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-lg">
                        {item.statusUtama || 'Tersedia'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1">
                        {item.namaAlat}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {item.deskripsi}
                      </p>
                    </div>

                    {/* Stock Detail */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-sm text-slate-500">
                      <span>Kondisi: <strong className="text-slate-800">{item.kondisi || 'Baik'}</strong></span>
                      <span>Total Aset: <strong className="text-slate-800">{item.stokTotal} Unit</strong></span>
                    </div>

                    {/* Action Buttons - Apple style */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => onDetailClick(item)}
                        className="w-full py-3 px-4 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300/80 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      >
                        <Eye className="w-4.5 h-4.5 text-slate-400" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => isAvailable && onRequestClick(item)}
                        disabled={!isAvailable}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                          isAvailable
                            ? 'bg-slate-950 hover:bg-slate-900 text-white shadow-md shadow-slate-950/20 hover:shadow-lg hover:shadow-slate-950/30'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        <span>{isAvailable ? 'Ajukan Pinjam' : 'Stok Kosong'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}