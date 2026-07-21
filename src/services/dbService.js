import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { INITIAL_EQUIPMENT, INITIAL_REQUESTS } from '../data/initialData';

const EQUIPMENT_COLLECTION = 'equipment';
const REQUESTS_COLLECTION = 'requests';

export const dbService = {
  // --- EQUIPMENT ---
  getEquipment: async () => {
    try {
      const q = query(collection(db, EQUIPMENT_COLLECTION));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Seed initial data if empty
        console.log("Seeding equipment...");
        for (const item of INITIAL_EQUIPMENT) {
          await setDoc(doc(db, EQUIPMENT_COLLECTION, item.id), item);
        }
        return INITIAL_EQUIPMENT;
      }
      
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Error getting equipment:", error);
      return [];
    }
  },

  saveEquipment: async (itemData) => {
    try {
      await setDoc(doc(db, EQUIPMENT_COLLECTION, itemData.id), itemData);
      return true;
    } catch (error) {
      console.error("Error saving equipment:", error);
      return false;
    }
  },

  deleteEquipment: async (id) => {
    try {
      await deleteDoc(doc(db, EQUIPMENT_COLLECTION, id));
      return true;
    } catch (error) {
      console.error("Error deleting equipment:", error);
      return false;
    }
  },

  // --- REQUESTS ---
  getRequests: async () => {
    try {
      const q = query(collection(db, REQUESTS_COLLECTION), orderBy('tanggalPengajuan', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Seed initial data if empty
        console.log("Seeding requests...");
        for (const req of INITIAL_REQUESTS) {
          await setDoc(doc(db, REQUESTS_COLLECTION, req.id), req);
        }
        return INITIAL_REQUESTS;
      }

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Error getting requests:", error);
      return [];
    }
  },

  saveRequest: async (requestData) => {
    try {
      await setDoc(doc(db, REQUESTS_COLLECTION, requestData.id), requestData);
      return true;
    } catch (error) {
      console.error("Error saving request:", error);
      return false;
    }
  },

  updateRequest: async (id, updates) => {
    try {
      await updateDoc(doc(db, REQUESTS_COLLECTION, id), updates);
      return true;
    } catch (error) {
      console.error("Error updating request:", error);
      return false;
    }
  },

  deleteRequest: async (id) => {
    try {
      await deleteDoc(doc(db, REQUESTS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error("Error deleting request:", error);
      return false;
    }
  }
};
