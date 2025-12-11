import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,

    accountAgeDays: (state) => {
      if (!state.user || !state.user.birthDate) return 0;
      const created = new Date(state.user.birthDate);
      return Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
    }
  },

  actions: {
    async login({ username, password }) {
      try {
        const res = await api.post('/auth/login', { username, password });

        // DummyJSON returns: token, id, firstName, lastName, email...
        this.token = res.data.token;
        this.user = res.data;

        localStorage.setItem('auth', JSON.stringify({
          token: this.token,
          user: this.user
        }));

        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (err) {
        console.error("Login failed:", err);
        throw err;
      }
    },

    restoreSession() {
      const saved = localStorage.getItem('auth');
      if (!saved) return;

      const parsed = JSON.parse(saved);
      this.token = parsed.token;
      this.user = parsed.user;

      api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    },

    logout() {
      this.token = null;
      this.user = null;

      localStorage.removeItem('auth');
      delete api.defaults.headers.common['Authorization'];
    }
  }
});
