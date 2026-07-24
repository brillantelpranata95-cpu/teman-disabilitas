import React from 'react';
import { Heart, MapPin, Phone, Mail, ShieldAlert, Accessibility } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Accessibility className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                PERISAI TEMON
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Sistem Informasi Pengelolaan Inventaris dan Peminjaman Alat Bantu Disabilitas Kapanewon Temon. Mewujudkan aksesibilitas dan pelayanan sosial yang inklusif untuk seluruh masyarakat Kulon Progo.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium bg-emerald-950/30 border border-emerald-900/50 px-3 py-1.5 rounded-lg w-fit">
              <Heart className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Layanan Bebas Biaya untuk Masyarakat Temon</span>
            </div>
          </div>

          {/* Cakupan Wilayah */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-5">Cakupan Wilayah</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>Kalurahan Glagah & Palihan</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>Kalurahan Temon Kulon & Temon Wetan</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>Kalurahan Jantisari & Sindutan</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>Kalurahan Kebonrejo & Kaligintung</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>Dan seluruh 14 Kalurahan di Temon</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-5">Kontak Kapanewon</h4>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Jl. Raya Wates - Purworejo Km. 11, Temon, Kulon Progo, DIY 55654</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Layanan WA: (0274) 773-XXX / 0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>kapanewontemon@kulonprogokab.go.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Kapanewon Temon, Kabupaten Kulon Progo. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-500/60" />
            <span>Dikembangkan untuk Pelayanan Disabilitas Inklusif</span>
          </p>
        </div>
      </div>
    </footer>
  );
}