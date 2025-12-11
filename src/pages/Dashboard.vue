<template>
  <div class="min-h-screen bg-gray-100 p-6">

    <!-- NAVBAR -->
    <header class="flex items-center justify-between bg-white p-4 rounded-2xl shadow mb-6 border">
      <h1 class="text-xl font-semibold text-[#000080]">Dashboard</h1>

      <div class="flex items-center gap-3">
        <img
          :src="userAvatar || 'https://via.placeholder.com/50'"
          class="w-10 h-10 rounded-full object-cover border cursor-pointer"
        />
        <p class="font-medium text-[#000080]">
          Hello {{ authUser?.firstName || 'Guest User' }}
        </p>
      </div>
    </header>

    <!-- TOP ANALYTICS GRID -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow border border-[#000080]/20 hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Total Products</p>
        <p class="text-3xl font-semibold text-[#000080] mt-2">{{ stats.totalProducts }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow border border-[#000080]/20 hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Average Price</p>
        <p class="text-3xl font-semibold text-[#000080] mt-2">${{ stats.avgPrice.toFixed(2) }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow border border-[#000080]/20 hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Total Inventory Value</p>
        <p class="text-3xl font-semibold text-[#000080] mt-2">${{ stats.totalValue.toFixed(2) }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow border border-[#000080]/20 hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Low Stock Items</p>
        <p class="text-3xl font-semibold text-[#000080] mt-2">{{ stats.lowStockCount }}</p>
      </div>
    </div>

    <!-- RECENT PRODUCTS -->
    <div class="bg-white p-6 rounded-2xl shadow border border-[#000080]/20 mb-8">
      <h2 class="font-semibold mb-3 text-[#000080]">Recent Products</h2>

      <ul class="space-y-4">
        <li
          v-for="p in recent"
          :key="p.id"
          @click="goToProduct(p.id)"
          class="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-blue-50 transition shadow-sm border border-gray-100 hover:shadow-md cursor-pointer"
        >
          <!-- LEFT -->
          <div class="flex items-center gap-4">
            <img
              :src="p.thumbnail"
              class="w-14 h-14 rounded-xl object-cover shadow"
            />
            <div>
              <p class="font-semibold text-[#000080]">{{ p.title }}</p>
              <p class="text-xs text-gray-500">
                {{ p.category || 'Uncategorized' }} • ${{ Number(p.price).toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="text-sm text-gray-600">
            {{ Number(p.stock) || 0 }} units
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useProductsStore } from "../stores/products";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const store = useProductsStore();
const authStore = useAuthStore();
const router = useRouter();

const loading = ref(true);
const authUser = ref(null);
const userAvatar = ref(null);

const goToProduct = (id) => {
  router.push({ name: "ProductView", params: { id } });
};

function initAuthFromStore() {
  if (authStore.restoreSession) {
    authStore.restoreSession();
  }

  authUser.value = authStore.user || null;
  userAvatar.value = authStore.user?.image || null;
}

onMounted(async () => {
  initAuthFromStore();
  await store.fetchProducts();
  loading.value = false;
});

const stats = computed(() => {
  const prods = store.products || [];

  return {
    totalProducts: prods.length,
    totalValue: prods.reduce(
      (s, p) => s + (Number(p.price) || 0) * (Number(p.stock) || 0),
      0
    ),
    avgPrice: prods.length
      ? prods.reduce((s, p) => s + (Number(p.price) || 0), 0) / prods.length
      : 0,
    lowStockCount: prods.filter(
      (p) => (Number(p.stock) || 0) <= 20
    ).length,
  };
});

const recent = computed(() => (store.products || []).slice(0, 8));
</script>

<style scoped>

</style>
