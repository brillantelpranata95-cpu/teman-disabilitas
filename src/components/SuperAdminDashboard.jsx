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
      
      {/* Superadmin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-temon-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Panel Superadmin Kapanewon Temon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sistem Informasi PERISAI Temon
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Kelola input inventaris alat disabilitas, proses alur permohonan pinjam dengan Kanban Board 3-stage, serta lakukan notifikasi pengingat WA H-3 dan arsip database.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">Total Stok Unit</span>
              <strong className="text-xl font-extrabold text-white">{totalStock}</strong>
            </div>

            <div className="bg-emerald-500/20 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-400/30 text-center">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Tersedia Publik</span>
              <strong className="text-xl font-extrabold text-emerald-400">{totalAvailable}</strong>
            </div>

            <div className="bg-amber-500/20 backdrop-blur-md p-3.5 rounded-2xl border border-amber-400/30 text-center">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">Permintaan Masuk</span>
              <strong className="text-xl font-extrabold text-amber-300">{incomingCount}</strong>
            </div>

            <div className="bg-blue-500/20 backdrop-blur-md p-3.5 rounded-2xl border border-blue-400/30 text-center">
              <span className="text-[10px] text-blue-300 uppercase font-bold block">Sedang Dipinjam</span>
              <strong className="text-xl font-extrabold text-blue-300">{activeLoansCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 overflow-x-auto">
        <div className="flex items-center space-x-2">
          
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2.5 transition duration-200 ${
              activeTab === 'kanban'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/10'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Kanban className={`w-4 h-4 ${activeTab === 'kanban' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Papan Kanban Permintaan</span>
            {incomingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                {incomingCount} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2.5 transition duration-200 ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/10'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Kelola Inventaris Alat ({equipmentList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2.5 transition duration-200 ${
              activeTab === 'archive'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/10'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Database className={`w-4 h-4 ${activeTab === 'archive' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Database & Rekap Arsip ({completedCount})</span>
          </button>

        </div>
      </div>

      {/* Tab Content Rendering */}
      <div>
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
