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
      try {
        console.log("🔵 Attempting login with:", username)

        const res = await api.post('/auth/login', { username, password })

        this.token = res.data.accessToken
        this.user = res.data

        console.log("Login successful!")
        console.log("Token:", this.token)
        console.log("User data:", this.user)

        localStorage.setItem('auth', JSON.stringify({
          token: this.token,
          user: this.user
        }))

        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (err) {
        console.error("Login failed:", err)
        throw err
      }
    },

    restoreSession() {
      console.log("Checking localStorage for saved session...")

      const saved = localStorage.getItem('auth')
      if (!saved) {
        console.log("No saved session found.")
        return
      }

      const data = JSON.parse(saved)
      this.token = data.token
      this.user = data.user

      console.log("Session restored!")
      console.log("Restored token:", this.token)
      console.log("Restored user:", this.user)

      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    },

    logout() {
      console.log("🟡 Logging out user...")

      this.token = null
      this.user = null

      localStorage.removeItem('auth')
      delete api.defaults.headers.common['Authorization']

      console.log("🟡 Logged out. Token cleared.")
    }
  }
})
