// stores/products.js
import { defineStore } from "pinia";
import api from "../services/api";

const LOCAL_KEY = "products_local";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    categories: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    // Load products from localStorage
    loadLocalProducts() {
      console.log("[store] loadLocalProducts()");
      const saved = localStorage.getItem(LOCAL_KEY);
      if (!saved) {
        console.log("[store] No local products found");
        return [];
      }
      try {
        const data = JSON.parse(saved);
        console.log("[store] Loaded local products:", data);
        return data;
      } catch (e) {
        console.error("[store] Failed to parse localStorage products:", e);
        return [];
      }
    },

    // Save current state to localStorage
    saveLocalProducts() {
      console.log("[store] saveLocalProducts() saving:", this.products);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(this.products));
    },

    // Fetch products from API and merge with local products
    async fetchProducts() {
      this.isLoading = true;
      this.error = null;
      console.log("[store] fetchProducts() start");

      try {
        const res = await api.get("/products");
        console.log("[store] fetchProducts() API response:", res.data);

        const apiProducts =
          res.data.products || res.data.productList || res.data || [];

        const localProds = this.loadLocalProducts();

        // Merge local + API at top
        this.products = [...localProds, ...apiProducts];

        console.log("[store] FINAL products after merge:", this.products);
      } catch (e) {
        this.error = "Failed to load products";
        console.error("[store] fetchProducts() ERROR:", e);
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch single product by ID (checks local first)
    async fetchProductById(id) {
      console.log("[store] fetchProductById()", id);
      const local = this.products.find((p) => p.id == id);
      if (local) {
        console.log("[store] Found locally:", local);
        return local;
      }

      try {
        const res = await api.get(`/products/${id}`);
        const prod = res.data.product || res.data;
        console.log("[store] Fetched from API:", prod);
        return prod;
      } catch (e) {
        console.error("[store] fetchProductById() error:", e);
        throw e;
      }
    },

    // Add a new product (FormData expected)
    async addProduct(formData) {
      console.log("[store] addProduct() called. FormData:", formData instanceof FormData);

      try {
        const res = await api.post("/products/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("[store] addProduct() API res:", res.data);

        const newProd = res.data.product || res.data;

        // Generate stable ID if API does not return one
        newProd.id = newProd.id || Date.now();

        // Add to state
        this.products.unshift(newProd);
        console.log("[store] products after add:", this.products);

        // Save to localStorage
        this.saveLocalProducts();

        return newProd;
      } catch (e) {
        console.error("[store] addProduct() error:", e);
        throw e;
      }
    },

    // Delete product by ID (updates localStorage)
    async deleteProduct(id) {
      console.log("[store] deleteProduct()", id);

      // Remove from local state first
      this.products = this.products.filter((p) => p.id != id);
      this.saveLocalProducts();

      // Optional: call API to delete on server
      try {
        await api.delete(`/products/${id}`);
      } catch (e) {
        console.error("[store] deleteProduct() API error:", e);
      }
    },

    // Fetch categories from API
    async fetchCategories() {
      console.log("[store] fetchCategories()");
      try {
        const res = await api.get("/products/categories");
        this.categories = Array.isArray(res.data) ? res.data : res.data.categories || [];
        console.log("[store] categories:", this.categories);
      } catch (e) {
        console.error("[store] fetchCategories() ERROR:", e);
      }
    },
  },
});
