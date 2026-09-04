import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface RequestStore {
  requests: ServiceRequest[];
  loading: boolean;
  fetchRequests: () => Promise<void>;
  createRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { userId: string }) => Promise<void>;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  getRequestById: (id: string) => ServiceRequest | undefined;
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  requests: [],
  loading: false,

  fetchRequests: async () => {
    set({ loading: true });
    try {
      // TODO: Fazer chamada real à API
      const stored = await AsyncStorage.getItem('requests');
      if (stored) {
        set({ requests: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
    } finally {
      set({ loading: false });
    }
  },

  createRequest: async (requestData) => {
    try {
      const newRequest: ServiceRequest = {
        ...requestData,
        id: 'req-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedRequests = [...get().requests, newRequest];
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
      set({ requests: updatedRequests });
    } catch (error) {
      console.error('Create request error:', error);
      throw error;
    }
  },

  updateRequest: async (id, updates) => {
    try {
      const updatedRequests = get().requests.map((req) =>
        req.id === id ? { ...req, ...updates, updatedAt: new Date().toISOString() } : req
      );
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
      set({ requests: updatedRequests });
    } catch (error) {
      console.error('Update request error:', error);
      throw error;
    }
  },

  deleteRequest: async (id) => {
    try {
      const updatedRequests = get().requests.filter((req) => req.id !== id);
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
      set({ requests: updatedRequests });
    } catch (error) {
      console.error('Delete request error:', error);
      throw error;
    }
  },

  getRequestById: (id) => {
    return get().requests.find((req) => req.id === id);
  },
}));
