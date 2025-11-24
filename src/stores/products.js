import { defineStore } from 'pinia'
import api from '../services/api'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchProducts() {
      this.isLoading = true;
      try {
        const res = await api.get('/products')
        this.products = res.data.products
      } catch (e) {
        this.error = 'Failed to load products'
      }
      this.isLoading = false;
    },

    async fetchProductById(id) {
      const exists = this.products.find(p => p.id == id)
      if (exists) return exists

      const res = await api.get(`/products/${id}`)
      return res.data
    },

    async addProduct(payload) {
      const res = await api.post('/products/add', payload)
      this.products.unshift(res.data)
      return res.data
    },

    async deleteProduct(id) {
      await api.delete(`/products/${id}`)
      this.products = this.products.filter(p => p.id !== id)
    }
  }
})
