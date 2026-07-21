import React from 'react';
import { Heart, MapPin, Phone, Mail, ShieldAlert, Accessibility } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-temon-600 flex items-center justify-center text-white">
                <Accessibility className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PERISAI TEMON - Teman Disabilitas
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Sistem Informasi Pengelolaan Inventaris dan Peminjaman Alat Bantu Disabilitas Kapanewon Temon. Mewujudkan aksesibilitas dan pelayanan sosial yang inklusif untuk seluruh masyarakat Kulon Progo.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
              <Heart className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Layanan Bebas Biaya untuk Masyarakat Temon</span>
            </div>
          </div>

          {/* Quick Links / Wilayah */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Cakupan Wilayah</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Kalurahan Glagah & Palihan</li>
              <li>• Kalurahan Temon Kulon & Temon Wetan</li>
              <li>• Kalurahan Jantisari & Sindutan</li>
              <li>• Kalurahan Kebonrejo & Kaligintung</li>
              <li>• Dan seluruh 14 Kalurahan di Temon</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kontak Kapanewon</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-temon-400 shrink-0 mt-0.5" />
                <span>Jl. Raya Wates - Purworejo Km. 11, Temon, Kulon Progo, DIY 55654</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-temon-400 shrink-0" />
                <span>Layanan WA: (0274) 773-XXX / 0812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-temon-400 shrink-0" />
                <span>kapanewontemon@kulonprogokab.go.id</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Kapanewon Temon, Kabupaten Kulon Progo. Hak Cipta Dilindungi.</p>
          <p className="flex items-center space-x-1">
            <span>Dikembangkan untuk Pelayanan Disabilitas Inklusif</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
