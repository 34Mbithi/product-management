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
    getTitles: (state) => state.products.map((p) => p.title.slice(0, 12) + "..."),

    getPriceList: (state) => state.products.map((p) => p.price),

    totalReviews: (state) =>
      state.products.reduce((s, p) => s + (p.reviews?.length || 0), 0),

    avgRating: (state) =>
      state.products.length
        ? state.products.reduce((s, p) => s + (p.rating || 0), 0) / state.products.length
        : 0,

    topStockProduct: (state) =>
      state.products.reduce((max, p) => (p.stock > (max?.stock || 0) ? p : max), null),
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
      const local = this.products.find((p) => p.id == id);
      if (local) return local;

      const res = await api.get(`/products/${id}`);
      return res.data;
    },

    async addProduct(payload) {
      // payload may contain 'thumbnail' or 'image' or File
      let base64 = payload.thumbnail || payload.image || null;

      if (payload.thumbnail instanceof File || payload.image instanceof File) {
        const file = payload.thumbnail instanceof File ? payload.thumbnail : payload.image;
        base64 = await fileToBase64(file);
      }

      const newProd = {
        ...payload,
        id: Date.now(),
        // store both for compatibility
        thumbnail: base64,
        image: base64,
      };

      this.products.unshift(newProd);
      this.saveLocalProducts();

      try {
        // Attempt to call API (DummyJSON will simulate but not persist)
        await api.post("/products/add", newProd);
      } catch (err) {
        // expected for DummyJSON — no hard failure
        console.warn("API add simulated / not persisted", err);
      }

      return newProd;
    },

    async updateProduct(updated) {
      // Convert uploaded File to base64 if needed
      let base64 = updated.thumbnail ?? updated.image ?? null;

      if (updated.thumbnail instanceof File || updated.image instanceof File) {
        const file = updated.thumbnail instanceof File ? updated.thumbnail : updated.image;
        base64 = await fileToBase64(file);
      }

      const index = this.products.findIndex((p) => p.id == updated.id);

      if (index !== -1) {
        // Keep existing fields that aren't provided
        const current = this.products[index];
        const productToSave = {
          ...current,
          ...updated,
          thumbnail: base64 ?? current.thumbnail,
          image: base64 ?? current.image,
        };
        this.products[index] = productToSave;

        this.saveLocalProducts();
      } else {
        // If not found locally, push as new local product
        const productToSave = {
          ...updated,
          thumbnail: base64 ?? updated.thumbnail ?? updated.image ?? null,
          image: base64 ?? updated.image ?? updated.thumbnail ?? null,
        };
        this.products.unshift(productToSave);
        this.saveLocalProducts();
      }

      try {
        // Try to update remote (DummyJSON will respond but not persist)
        await api.put(`/products/${updated.id}`, updated);
      } catch (err) {
        console.warn("API update simulated / not persisted", err);
      }
    },

    async deleteProduct(id) {
      this.products = this.products.filter((p) => p.id != id);
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
        this.categories = Array.isArray(res.data) ? res.data : res.data.categories || [];
      } catch (e) {
        console.error("fetchCategories() ERROR:", e);
      }
    },
  },
});
