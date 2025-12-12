// src/stores/customers.js
import { defineStore } from 'pinia'
import api from '../services/api'

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: [],
    isLoading: false,
    error: null,
    total: 0
  }),

  getters: {
    count: (state) => state.customers.length
  },

  actions: {
    async fetchCustomers({ limit = 100, skip = 0 } = {}) {
      this.isLoading = true
      this.error = null
      try {
        const res = await api.get('/users', { params: { limit, skip } })
        // DummyJSON returns { users: [...], total, skip, limit }
        this.customers = Array.isArray(res.data.users) ? res.data.users : []
        this.total = res.data.total || this.customers.length
      } catch (err) {
        this.error = err.message || 'Failed to load customers'
        console.error('fetchCustomers error', err)
      } finally {
        this.isLoading = false
      }
    },

    async getCustomerById(id) {
      // try to find locally first
      const found = this.customers.find(c => String(c.id) === String(id))
      if (found) return found
      try {
        const res = await api.get(`/users/${id}`)
        return res.data
      } catch (err) {
        console.error('getCustomerById error', err)
        throw err
      }
    }
  }
})
