// src/stores/orders.js
import { defineStore } from 'pinia'
import api from '../services/api'

/**
 * Using DummyJSON "carts" as orders.
 * We attach a deterministic "status" derived from the cart id
 * so the UI can show Pending / Paid / Shipped
 */
const statusMap = ['Pending', 'Paid', 'Shipped', 'Cancelled']

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    isLoading: false,
    error: null,
    total: 0
  }),

  getters: {
    count: (s) => s.orders.length
  },

  actions: {
    async fetchOrders({ limit = 100, skip = 0 } = {}) {
      this.isLoading = true
      this.error = null
      try {
        const res = await api.get('/carts', { params: { limit, skip } })
        // DummyJSON returns { carts: [...], total, skip, limit }
        const carts = Array.isArray(res.data.carts) ? res.data.carts : []
        // convert cart => order-like object
        this.orders = carts.map(c => ({
          id: c.id,
          userId: c.userId,
          total: c.total || c.discountedTotal || 0,
          discountedTotal: c.discountedTotal || 0,
          totalProducts: c.totalProducts || (c.products && c.products.length) || 0,
          totalQuantity: c.totalQuantity || 0,
          products: c.products || [],
          // deterministic status for UI
          status: statusMap[c.id % statusMap.length],
          date: (new Date(Date.now() - (c.id * 86400000))).toISOString().slice(0,10) // fake date
        }))
        this.total = res.data.total || this.orders.length
      } catch (err) {
        this.error = err.message || 'Failed to load orders'
        console.error('fetchOrders error', err)
      } finally {
        this.isLoading = false
      }
    },

    async getOrderById(id) {
      const found = this.orders.find(o => String(o.id) === String(id))
      if (found) return found
      try {
        const res = await api.get(`/carts/${id}`)
        const c = res.data
        return {
          id: c.id,
          userId: c.userId,
          total: c.total,
          discountedTotal: c.discountedTotal,
          totalProducts: c.totalProducts,
          totalQuantity: c.totalQuantity,
          products: c.products,
          status: statusMap[c.id % statusMap.length],
          date: (new Date()).toISOString().slice(0,10)
        }
      } catch (err) {
        console.error('getOrderById error', err)
        throw err
      }
    }
  }
})
