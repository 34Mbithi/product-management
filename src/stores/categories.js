import { defineStore } from 'pinia'
import api from '../services/api'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchCategories() {
      this.isLoading = true
      this.error = null

      try {
        const res = await api.get('/products/categories')
        this.categories = Array.isArray(res.data) ? res.data : res.data.categories || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
