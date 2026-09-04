import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface AuthStore {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isSignedIn: false,
  isLoading: true,
  token: null,

  bootstrap: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        set({
          token,
          user: JSON.parse(userData),
          isSignedIn: true,
        });
      }
    } catch (error) {
      console.error('Bootstrap error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      // TODO: Fazer chamada real à API
      const mockToken = 'mock-token-' + Date.now();
      const mockUser: User = {
        id: '1',
        name: 'Usuário Teste',
        email,
        phone: '(53) 99999-9999',
        cpf: '123.456.789-00',
      };

      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));

      set({
        token: mockToken,
        user: mockUser,
        isSignedIn: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      // TODO: Fazer chamada real à API
      const mockToken = 'mock-token-' + Date.now();
      const newUser: User = {
        id: '1',
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        cpf: userData.cpf || '',
      };

      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));

      set({
        token: mockToken,
        user: newUser,
        isSignedIn: true,
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      set({
        token: null,
        user: null,
        isSignedIn: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
}));
