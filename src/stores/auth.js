import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login({ username, password }) {
      const res = await api.post('/auth/login', { username, password })

      this.token = res.data.token
      this.user = res.data

      localStorage.setItem('auth', JSON.stringify({
        token: this.token,
        user: this.user
      }))

      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },

    restoreSession() {
      const saved = localStorage.getItem('auth')
      if (!saved) return

      const data = JSON.parse(saved)
      this.token = data.token
      this.user = data.user

      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth')
      delete api.defaults.headers.common['Authorization']
    }
  }
})
