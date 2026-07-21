import { INITIAL_EQUIPMENT, INITIAL_REQUESTS } from './initialData';

const STORAGE_KEYS = {
  EQUIPMENT: 'perisai_temon_equipment_v1',
  REQUESTS: 'perisai_temon_requests_v1',
  ADMIN_AUTH: 'perisai_temon_admin_auth'
};

export const getStoredEquipment = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
      return INITIAL_EQUIPMENT;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed reading equipment from localStorage:', error);
    return INITIAL_EQUIPMENT;
  }
};

export const saveEquipment = (equipmentList) => {
  try {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipmentList));
  } catch (error) {
    console.error('Failed saving equipment to localStorage:', error);
  }
};

export const getStoredRequests = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed reading requests from localStorage:', error);
    return INITIAL_REQUESTS;
  }
};

export const saveRequests = (requestList) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requestList));
  } catch (error) {
    console.error('Failed saving requests to localStorage:', error);
  }
};

export const resetStorageToDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  return { equipment: INITIAL_EQUIPMENT, requests: INITIAL_REQUESTS };
};
