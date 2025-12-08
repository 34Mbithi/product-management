import { defineStore } from "pinia";
import api from "../services/api";

const LOCAL_KEY = "products_local";

// Helper to convert File -> base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
  });
}

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    categories: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    loadLocalProducts() {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (!saved) return [];
      try {
        return JSON.parse(saved);
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
        const apiProducts = res.data.products || res.data.productList || res.data || [];
        const localProds = this.loadLocalProducts();
        this.products = [...localProds, ...apiProducts];
      } catch (e) {
        this.error = "Failed to load products";
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductById(id) {
      const local = this.products.find((p) => p.id == id);
      if (local) return local;

      try {
        const res = await api.get(`/products/${id}`);
        return res.data.product || res.data;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    async addProduct(payload) {
  try {
    let base64 = payload.thumbnail;

    // Convert File to base64
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
  } catch (e) {
    console.error("addProduct() error:", e);
    throw e;
  }
},

    async deleteProduct(id) {
      this.products = this.products.filter((p) => p.id != id);
      this.saveLocalProducts();
      try {
        await api.delete(`/products/${id}`);
      } catch (e) {
        console.error("deleteProduct() API error:", e);
      }
    },

    async fetchCategories() {
      try {
        const res = await api.get("/products/categories");
        this.categories = Array.isArray(res.data) ? res.data : res.data.categories || [];
      } catch (e) {
        console.error("fetchCategories() ERROR:", e);
      }
    },
  },
});
