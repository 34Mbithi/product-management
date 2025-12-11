import { defineStore } from "pinia";
import api from "../services/api";

const LOCAL_KEY = "products_local";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    categories: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getTitles: (state) => state.products.map(p => p.title.slice(0, 12) + '...'),

    getPriceList: (state) => state.products.map(p => p.price),

    totalReviews: (state) =>
      state.products.reduce((s, p) => s + (p.reviews?.length || 0), 0),

    avgRating: (state) =>
      state.products.length
        ? state.products.reduce((s, p) => s + (p.rating || 0), 0) / state.products.length
        : 0,

    topStockProduct: (state) =>
      state.products.reduce((max, p) => p.stock > (max?.stock || 0) ? p : max, null),
  },

  actions: {
    loadLocalProducts() {
      try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
      } catch {
        return [];
      }
    },

    saveLocalProducts() {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(this.products));
    },

    async fetchProducts() {
      this.isLoading = true;
      this.error = null;

      try {
        const res = await api.get("/products");
        const backend = res.data.products || [];

        const local = this.loadLocalProducts();

        // Merge both – local first (so new local items appear at top)
        this.products = [...local, ...backend];
      } catch (e) {
        this.error = "Failed to load products";
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductById(id) {
      const local = this.products.find(p => p.id == id);
      if (local) return local;

      const res = await api.get(`/products/${id}`);
      return res.data;
    },

    async addProduct(payload) {
      let base64 = payload.thumbnail;

      if (payload.thumbnail instanceof File) {
        base64 = await fileToBase64(payload.thumbnail);
      }

      const newProd = {
        ...payload,
        id: Date.now(),
        thumbnail: base64,
        images: [base64],
      };

      this.products.unshift(newProd);
      this.saveLocalProducts();

      return newProd;
    },

    async deleteProduct(id) {
      this.products = this.products.filter(p => p.id != id);
      this.saveLocalProducts();
      try {
        await api.delete(`/products/${id}`);
      } catch (err) {
        console.warn("API delete failed (expected for DummyJSON)", err);
      }
    },

    async fetchCategories() {
      try {
        const res = await api.get("/products/categories");
        this.categories = Array.isArray(res.data)
          ? res.data
          : res.data.categories || [];
      } catch (e) {
        console.error("fetchCategories() ERROR:", e);
      }
    },
  },
});
