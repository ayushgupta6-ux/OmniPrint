import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('jwt_token') || null,
  isAuthenticated: !!localStorage.getItem('jwt_token'),
  
  setToken: (newToken:string) => {
    localStorage.setItem('jwt_token', newToken);
    set({ token: newToken, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('jwt_token');
    set({ token: null, isAuthenticated: false });
  }
}));