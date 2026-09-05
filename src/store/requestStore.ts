import { create } from 'zustand';

export interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface RequestStore {
  requests: Request[];
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  getRequestById: (id: string) => Request | undefined;
  getRequestsByStatus: (status: Request['status']) => Request[];
  getAllRequests: () => Request[];
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  requests: [],

  addRequest: async (request) => {
    const newRequest: Request = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      requests: [newRequest, ...state.requests],
    }));
  },

  updateRequest: async (id, updates) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? {
              ...request,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : request
      ),
    }));
  },

  deleteRequest: async (id) => {
    set((state) => ({
      requests: state.requests.filter((request) => request.id !== id),
    }));
  },

  getRequestById: (id) => {
    return get().requests.find((request) => request.id === id);
  },

  getRequestsByStatus: (status) => {
    return get().requests.filter((request) => request.status === status);
  },

  getAllRequests: () => {
    return get().requests;
  },
}));