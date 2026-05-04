import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      requiresTwoFactor: false,
      tempToken: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password });
          
          if (response.data.data.requiresTwoFactor) {
            set({ 
              requiresTwoFactor: true, 
              tempToken: response.data.data.tempToken,
              isLoading: false 
            });
            return { requiresTwoFactor: true };
          }

          const { token, user } = response.data.data;
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            requiresTwoFactor: false,
            tempToken: null
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      verifyOTP: async (otp) => {
        const { tempToken } = get();
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/verify-otp`, 
            { otp },
            { headers: { Authorization: `Bearer ${tempToken}` } }
          );

          const { token, user } = response.data.data;
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            requiresTwoFactor: false,
            tempToken: null
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Verification failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          requiresTwoFactor: false,
          tempToken: null 
        });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
