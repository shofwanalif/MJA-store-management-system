import { create } from 'zustand';
import axios from '../api/axios';

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,

  setAuth: ({ user, accessToken, refreshToken }) => {
    set({ user, accessToken, refreshToken });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  login: async (credentials) => {
    const res = await axios.post('/auth/login', credentials);
    const user = decodeToken(res.data.accessToken);
    get().setAuth({ user, ...res.data });
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout', { token: get().refreshToken });
    } catch (e) {
      console.warn('logout error', e.message);
    } finally {
      get().clearAuth();
    }
  },

  refreshAccessToken: async () => {
    const res = await axios.post('/auth/refresh', {
      token: get().refreshToken,
    });
    const user = decodeToken(res.data.accessToken);
    get().setAuth({ user, ...res.data });
    return res.data;
  },

  init: () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      set({
        accessToken,
        refreshToken: localStorage.getItem('refreshToken'),
        user: decodeToken(accessToken),
      });
    }
  },
}));

export default useAuthStore;
