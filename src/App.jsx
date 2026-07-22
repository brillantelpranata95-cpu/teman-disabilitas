import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicCatalog from './components/PublicCatalog';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import RequestModal from './components/RequestModal';
import DetailModal from './components/DetailModal';
import LoginModal from './components/LoginModal';
import { dbService } from './services/dbService';
import { authService } from './services/authService';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [selectedEquipmentForRequest, setSelectedEquipmentForRequest] = useState(null);
  const [selectedEquipmentForDetail, setSelectedEquipmentForDetail] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check if user is already logged in via API
    const verifyAuth = async () => {
      const isAuth = await authService.checkAuth();
      setIsAdminMode(isAuth);
    };
    verifyAuth();
    
    // Fetch Data
    const fetchData = async () => {
      setIsLoading(true);
      const eq = await dbService.getEquipment();
      const req = await dbService.getRequests();
      setEquipmentList(eq);
      setRequests(req);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleAdminMode = () => {
    if (isAdminMode) {
      // Logout
      authService.logoutAdmin();
      setIsAdminMode(false);
      showToast('Berhasil logout dari mode Superadmin.', 'info');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAdminMode(true);
    showToast('Berhasil login sebagai Superadmin!', 'success');
  };

  // -------------------------------------------------------------
  // LOGIC DISABILITAS & KANBAN STOCK MANAGEMENT (FIREBASE)
  // -------------------------------------------------------------

  const handlePublicSubmitRequest = async (newRequest) => {
    const success = await dbService.saveRequest(newRequest);
    if (success) {
      setRequests([newRequest, ...requests]);
      showToast(`Permohonan ${newRequest.kodeBooking} berhasil dikirim ke Superadmin!`, 'success');
    } else {
      showToast('Gagal mengirim permohonan. Coba lagi.', 'error');
    }
  };

  const handleRequestStageChange = async (requestId, newStage, extraDetails = {}) => {
    const targetRequest = requests.find(r => r.id === requestId);
    if (!targetRequest) return;

    const oldStage = targetRequest.stage;
    const targetEquipment = equipmentList.find(e => e.id === targetRequest.equipmentId);

    let stockChanged = false;
    let newStokTersedia = targetEquipment?.stokTersedia;

    // CASE A: Pindah dari 'permintaan_masuk' ke 'permintaan_diterima' -> KURANGI STOK DISABILITAS (-1)
    if (oldStage === 'permintaan_masuk' && newStage === 'permintaan_diterima') {
      if (targetEquipment) {
        if (targetEquipment.stokTersedia <= 0) {
          showToast(`Stok ${targetEquipment.namaAlat} sedang tidak mencukupi untuk dipinjamkan.`, 'error');
          return;
        }
        newStokTersedia = Math.max(0, targetEquipment.stokTersedia - 1);
        stockChanged = true;
      }
    }

    // CASE B: Pindah ke 'permintaan_selesai' -> TAMBAH KEMBALI STOK DISABILITAS (+1)
    if (oldStage !== 'permintaan_selesai' && newStage === 'permintaan_selesai') {
      if (targetEquipment) {
        newStokTersedia = Math.min(targetEquipment.stokTotal, targetEquipment.stokTersedia + 1);
        stockChanged = true;
      }
    }

    // Optimistic UI updates
    const updatedExtras = {
      stage: newStage,
      ...extraDetails,
      ...(newStage === 'permintaan_selesai' ? { tanggalSelesai: new Date().toISOString().split('T')[0] } : {})
    };

    // DB Updates
    const reqSuccess = await dbService.updateRequest(requestId, updatedExtras);
    let eqSuccess = true;
    
    if (stockChanged && targetEquipment) {
       eqSuccess = await dbService.saveEquipment({ ...targetEquipment, stokTersedia: newStokTersedia });
    }

    if (reqSuccess && eqSuccess) {
       // Update State
       if (stockChanged && targetEquipment) {
           setEquipmentList(equipmentList.map(item => 
              item.id === targetEquipment.id ? { ...item, stokTersedia: newStokTersedia } : item
           ));
           
           if (newStage === 'permintaan_diterima') {
              showToast(`Permintaan disetujui! Stok ${targetEquipment.namaAlat} berkurang 1 unit di dashboard umum.`, 'success');
           } else if (newStage === 'permintaan_selesai') {
              showToast(`Peminjaman selesai! Stok ${targetEquipment.namaAlat} telah bertambah (+1) kembali di dashboard umum.`, 'success');
           }
       }
       
       setRequests(requests.map(r => r.id === requestId ? { ...r, ...updatedExtras } : r));
    } else {
       showToast('Terjadi kesalahan saat mengupdate data.', 'error');
    }
  };

  const handleArchiveRequest = async (requestId) => {
    const updates = { isArchived: true, tanggalPengarsipan: new Date().toISOString().split('T')[0] };
    const success = await dbService.updateRequest(requestId, updates);
    if (success) {
      setRequests(requests.map(r => r.id === requestId ? { ...r, ...updates } : r));
      showToast('Data permohonan berhasil dipindahkan ke Database Arsip permanen.', 'info');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Apakah Anda yakin ingin menolak & menghapus permohonan ini?')) {
      const success = await dbService.deleteRequest(requestId);
      if (success) {
        setRequests(requests.filter(r => r.id !== requestId));
        showToast('Permohonan telah dihapus.', 'info');
      }
    }
  };

  const handleSaveEquipment = async (itemData) => {
    const exists = equipmentList.some(e => e.id === itemData.id);
    const success = await dbService.saveEquipment(itemData);
    
    if (success) {
      if (exists) {
        setEquipmentList(equipmentList.map(e => e.id === itemData.id ? itemData : e));
        showToast(`Data alat ${itemData.namaAlat} berhasil diperbarui.`, 'success');
      } else {
        setEquipmentList([itemData, ...equipmentList]);
        showToast(`Alat bantu baru ${itemData.namaAlat} berhasil ditambahkan!`, 'success');
      }
    } else {
      showToast('Gagal menyimpan data alat.', 'error');
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alat ini dari inventaris?')) {
      const success = await dbService.deleteEquipment(id);
      if (success) {
        setEquipmentList(equipmentList.filter(e => e.id !== id));
        showToast('Alat bantu telah dihapus dari inventaris.', 'info');
      }
    }
  };

  // Reset defaults isn't really needed with Firestore as much, but leaving it as a manual re-seed if necessary could be complex.
  // We'll just disable or leave it doing nothing to prevent accidental DB resets, or let it delete all and re-seed.
  const handleResetDefaults = () => {
    showToast('Fitur reset dinonaktifkan di mode database live.', 'info');
  };

  const availableCount = equipmentList.reduce((acc, curr) => acc + (curr.stokTersedia || 0), 0);
  const activeLoansCount = requests.filter(r => !r.isArchived && r.stage === 'permintaan_diterima').length;
  const incomingCount = requests.filter(r => !r.isArchived && r.stage === 'permintaan_masuk').length;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Memuat Data...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      <Navbar
        isAdminMode={isAdminMode}
        setIsAdminMode={toggleAdminMode}
        availableCount={availableCount}
        activeLoansCount={activeLoansCount}
        incomingCount={incomingCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdminMode ? (
          <SuperAdminDashboard
            equipmentList={equipmentList}
            requests={requests}
            onRequestStageChange={handleRequestStageChange}
            onArchiveRequest={handleArchiveRequest}
            onDeleteRequest={handleDeleteRequest}
            onSaveEquipment={handleSaveEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onResetDefaults={handleResetDefaults}
          />
        ) : (
          <PublicCatalog
            equipmentList={equipmentList}
            onRequestClick={(eq) => setSelectedEquipmentForRequest(eq)}
            onDetailClick={(eq) => setSelectedEquipmentForDetail(eq)}
          />
        )}
      </main>

      <Footer />

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSuccess={handleLoginSuccess}
        />
      )}

      {selectedEquipmentForRequest && (
        <RequestModal
          equipment={selectedEquipmentForRequest}
          onClose={() => setSelectedEquipmentForRequest(null)}
          onSubmitSuccess={handlePublicSubmitRequest}
        />
      )}

      {selectedEquipmentForDetail && (
        <DetailModal
          equipment={selectedEquipmentForDetail}
          onClose={() => setSelectedEquipmentForDetail(null)}
          onRequestClick={(eq) => setSelectedEquipmentForRequest(eq)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 animate-bounce">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
