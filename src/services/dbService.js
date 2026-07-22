import { getStoredEquipment, getStoredRequests } from '../data/storage';

export const dbService = {
  // --- EQUIPMENT ---
  getEquipment: async () => {
    try {
      const res = await fetch('/api/equipment');
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (error) {
      console.error("Error getting equipment:", error);
      return getStoredEquipment(); // Fallback to storage
    }
  },

  saveEquipment: async (itemData) => {
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      return res.ok;
    } catch (error) {
      console.error("Error saving equipment:", error);
      return false;
    }
  },

  deleteEquipment: async (id) => {
    try {
      const res = await fetch('/api/equipment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return res.ok;
    } catch (error) {
      console.error("Error deleting equipment:", error);
      return false;
    }
  },

  // --- REQUESTS ---
  getRequests: async () => {
    try {
      const res = await fetch('/api/requests');
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (error) {
      console.error("Error getting requests:", error);
      return getStoredRequests(); // Fallback to storage
    }
  },

  saveRequest: async (requestData) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      return res.ok;
    } catch (error) {
      console.error("Error saving request:", error);
      return false;
    }
  },

  updateRequest: async (id, updates) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });
      return res.ok;
    } catch (error) {
      console.error("Error updating request:", error);
      return false;
    }
  },

  deleteRequest: async (id) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return res.ok;
    } catch (error) {
      console.error("Error deleting request:", error);
      return false;
    }
  }
};
