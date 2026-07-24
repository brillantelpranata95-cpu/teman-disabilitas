import React, { useState } from 'react';
import { 
  LayoutDashboard, Kanban, Package, Database, Sparkles, Inbox, 
  Clock, CheckCircle2, AlertTriangle, ShieldCheck, HeartHandshake 
} from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import EquipmentManager from './EquipmentManager';
import ArchiveView from './ArchiveView';

export default function SuperAdminDashboard({ 
  equipmentList, 
  requests, 
  onRequestStageChange, 
  onArchiveRequest, 
  onDeleteRequest,
  onSaveEquipment,
  onDeleteEquipment,
  onResetDefaults
}) {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'inventory' | 'archive'

  const incomingCount = requests.filter(r => !r.isArchived && r.stage === 'permintaan_masuk').length;
  const activeLoansCount = requests.filter(r => !r.isArchived && r.stage === 'permintaan_diterima').length;
  const completedCount = requests.filter(r => r.isArchived || r.stage === 'permintaan_selesai').length;

  const totalStock = equipmentList.reduce((acc, item) => acc + (item.stokTotal || 0), 0);
  const totalAvailable = equipmentList.reduce((acc, item) => acc + (item.stokTersedia || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Superadmin Header - Apple Glassmorphism */}
      <div className="relative rounded-3xl bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-sm shadow-slate-900/5 overflow-hidden p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel Superadmin Kapanewon Temon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Sistem Informasi PERISAI Temon
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Kelola input inventaris alat disabilitas, proses alur permohonan pinjam dengan Kanban Board 3-stage, serta lakukan notifikasi pengingat WA H-3 dan arsip database.
            </p>
          </div>

          {/* Quick Metrics - Glassmorphism */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-2xl border border-slate-200/60 text-center shadow-sm shadow-slate-900/5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block tracking-wide">Total Stok Unit</span>
              <strong className="text-2xl font-extrabold text-slate-950 mt-1 block">{totalStock}</strong>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block tracking-wide">Tersedia Publik</span>
              <strong className="text-2xl font-extrabold text-emerald-700 mt-1 block">{totalAvailable}</strong>
            </div>
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <span className="text-[10px] text-amber-700 uppercase font-bold block tracking-wide">Permintaan Masuk</span>
              <strong className="text-2xl font-extrabold text-amber-700 mt-1 block">{incomingCount}</strong>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 text-center">
              <span className="text-[10px] text-blue-700 uppercase font-bold block tracking-wide">Sedang Dipinjam</span>
              <strong className="text-2xl font-extrabold text-blue-700 mt-1 block">{activeLoansCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs - Apple Style */}
      <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2.5 transition-all duration-200 whitespace-nowrap ${
            activeTab === 'kanban'
              ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20'
              : 'bg-white/80 backdrop-blur-xl text-slate-600 hover:bg-slate-100/80 border border-slate-200/60'
          }`}
        >
          <Kanban className={`w-4 h-4 ${activeTab === 'kanban' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>Papan Kanban Permintaan</span>
          {incomingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
              {incomingCount} Baru
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2.5 transition-all duration-200 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20'
              : 'bg-white/80 backdrop-blur-xl text-slate-600 hover:bg-slate-100/80 border border-slate-200/60'
          }`}
        >
          <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>Kelola Inventaris Alat ({equipmentList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2.5 transition-all duration-200 whitespace-nowrap ${
            activeTab === 'archive'
              ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20'
              : 'bg-white/80 backdrop-blur-xl text-slate-600 hover:bg-slate-100/80 border border-slate-200/60'
          }`}
        >
          <Database className={`w-4 h-4 ${activeTab === 'archive' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>Database & Rekap Arsip ({completedCount})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'kanban' && (
          <KanbanBoard
            requests={requests}
            onRequestStageChange={onRequestStageChange}
            onArchiveRequest={onArchiveRequest}
            onDeleteRequest={onDeleteRequest}
          />
        )}

        {activeTab === 'inventory' && (
          <EquipmentManager
            equipmentList={equipmentList}
            onSaveEquipment={onSaveEquipment}
            onDeleteEquipment={onDeleteEquipment}
            onResetDefaults={onResetDefaults}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveView requests={requests} />
        )}
      </div>
    </div>
  );
}