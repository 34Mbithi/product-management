<template>
  <div class="min-h-screen bg-gray-100 p-6">

    <!-- NAVBAR -->
    <header class="flex items-center justify-between bg-white p-4 rounded-2xl shadow mb-6 border">
      <h1 class="text-2xl font-bold text-[#0b2b7a]">Dashboard</h1>

      <div class="flex items-center gap-3">
        <img
          :src="userAvatar || 'https://via.placeholder.com/50'"
          class="w-10 h-10 rounded-full object-cover border cursor-pointer"
        />
        <p class="font-medium text-[#0b2b7a]">
          Hello {{ authUser?.firstName || 'Guest User' }}
        </p>
      </div>
    </header>

    <!-- METRICS ROW -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Total Products</p>
        <p class="text-3xl font-semibold text-[#0b2b7a] mt-2">{{ stats.totalProducts }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Average Price</p>
        <p class="text-3xl font-semibold text-[#0b2b7a] mt-2">${{ stats.avgPrice.toFixed(2) }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Total Inventory Value</p>
        <p class="text-3xl font-semibold text-[#0b2b7a] mt-2">${{ stats.totalValue.toFixed(2) }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <p class="text-sm text-gray-500">Low Stock Items</p>
        <p class="text-3xl font-semibold text-[#0b2b7a] mt-2">{{ stats.lowStockCount }}</p>
      </div>
    </div>

    <!-- CHARTS ROW -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[#0b2b7a]">Products per Category</h2>
        </div>
        <div class="w-full">
          <canvas ref="pieCanvas" />
          <p v-if="!categoryLabels.length" class="text-sm text-gray-500 mt-3">
            No categories available
          </p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-[#0b2b7a]">Average Price by Category</h2>
        </div>
        <div class="w-full">
          <canvas ref="barCanvas" />
          <p v-if="!avgPriceLabels.length" class="text-sm text-gray-500 mt-3">
            No data available
          </p>
        </div>
      </div>
    </div>

    <!-- INSIGHTS ROW -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

      <!-- Top 5 Expensive (CLICKABLE NOW) -->
      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <h3 class="text-lg font-semibold text-[#0b2b7a] mb-4">Top 5 Expensive Products</h3>

        <ul class="space-y-4">
          <li
            v-for="p in topExpensive"
            :key="p.id"
            @click="goToProduct(p.id)"
            class="flex items-center gap-4 py-3 border-b last:border-b-0
                   cursor-pointer hover:bg-blue-50 rounded-lg px-2 transition"
          >
            <img :src="p.thumbnail" class="w-14 h-14 rounded object-cover border" />

            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">{{ p.title }}</p>
              <p class="text-xs text-gray-500 truncate">{{ p.category || "Uncategorized" }}</p>
            </div>

            <div class="text-blue-700 font-semibold">
              ${{ Number(p.price).toFixed(2) }}
            </div>
          </li>
        </ul>
      </div>

      <!-- Low Stock -->
      <div class="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
        <h3 class="text-lg font-semibold text-[#0b2b7a] mb-4">Low Stock Items</h3>

        <div class="overflow-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-gray-500">
                <th class="pb-2">Product</th>
                <th class="pb-2">Stock</th>
                <th class="pb-2">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in lowStock" :key="p.id" class="border-t">
                <td class="py-3">
                  <div class="truncate max-w-xs">{{ p.title }}</div>
                </td>
                <td class="py-3 font-semibold text-red-600">{{ p.stock }}</td>
                <td class="py-3 text-gray-500">{{ p.category || "—" }}</td>
              </tr>

              <tr v-if="!lowStock.length">
                <td colspan="3" class="py-4 text-gray-500">No low-stock items</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- RECENT PRODUCTS (UNTOUCHED) -->
    <div class="bg-white p-6 rounded-2xl shadow border border-[#000080]/20 mb-8">
      <h2 class="font-semibold mb-3 text-[#000080]">Recent Products</h2>

      <ul class="space-y-4">
        <li
          v-for="p in recent"
          :key="p.id"
          @click="goToProduct(p.id)"
          class="flex items-center justify-between p-3 rounded-xl bg-white
                 hover:bg-blue-50 transition shadow-sm border border-gray-100
                 hover:shadow-md cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <img :src="p.thumbnail" class="w-14 h-14 rounded-xl object-cover shadow" />
            <div>
              <p class="font-semibold text-[#000080]">{{ p.title }}</p>
              <p class="text-xs text-gray-500">
                {{ p.category || 'Uncategorized' }} • ${{ Number(p.price).toFixed(2) }}
              </p>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            {{ Number(p.stock) || 0 }} units
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useProductsStore } from "../stores/products";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const store = useProductsStore();
const authStore = useAuthStore();
const router = useRouter();

const pieCanvas = ref(null);
const barCanvas = ref(null);
let pieChart = null;
let barChart = null;

const loading = ref(true);
const authUser = ref(null);
const userAvatar = ref(null);

function initAuthFromStore() {
  if (authStore.restoreSession) authStore.restoreSession();
  authUser.value = authStore.user || null;
  userAvatar.value = authStore.user?.image || null;
}

const goToProduct = (id) => {
  router.push({ name: "ProductView", params: { id } });
};

onMounted(async () => {
  initAuthFromStore();
  await store.fetchProducts();
  if (store.fetchCategories) await store.fetchCategories();
  loading.value = false;
  buildCharts();
});

watch(
  () => store.products,
  () => buildCharts(),
  { deep: true }
);

/* ------------ Stats & Lists ------------ */
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
    lowStockCount: prods.filter((p) => (Number(p.stock) || 0) <= 20).length,
  };
});

const recent = computed(() => (store.products || []).slice(0, 8));

const topExpensive = computed(() =>
  [...(store.products || [])]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
);

const lowStock = computed(() =>
  (store.products || [])
    .filter((p) => Number(p.stock) <= 20)
    .sort((a, b) => a.stock - b.stock)
);

/* ------------ Chart Data ------------ */
const categoryCounts = computed(() => {
  const map = {};
  (store.products || []).forEach((p) => {
    const key = p.category || "Uncategorized";
    map[key] = (map[key] || 0) + 1;
  });
  return map;
});

const categoryLabels = computed(() => Object.keys(categoryCounts.value));
const categoryValues = computed(() => Object.values(categoryCounts.value));

const avgPriceByCategory = computed(() => {
  const sum = {}, count = {};
  (store.products || []).forEach((p) => {
    const key = p.category || "Uncategorized";
    sum[key] = (sum[key] || 0) + (Number(p.price) || 0);
    count[key] = (count[key] || 0) + 1;
  });
  const out = {};
  Object.keys(sum).forEach((k) => {
    out[k] = +(sum[k] / count[k]).toFixed(2);
  });
  return out;
});

const avgPriceLabels = computed(() => Object.keys(avgPriceByCategory.value));
const avgPriceValues = computed(() => Object.values(avgPriceByCategory.value));

/* ------------ Build Charts ------------ */
function destroyCharts() {
  try { if (pieChart) pieChart.destroy(); pieChart = null; } catch {}
  try { if (barChart) barChart.destroy(); barChart = null; } catch {}
}

function generatePalette(n) {
  const base = [
    "#2563EB", "#7C3AED", "#06B6D4",
    "#10B981", "#F59E0B", "#EF4444",
    "#F97316", "#3B82F6",
  ];
  const palette = [];
  for (let i = 0; i < n; i++) palette.push(base[i % base.length]);
  return palette;
}

function buildCharts() {
  if (!pieCanvas.value || !barCanvas.value) return;

  destroyCharts();

  pieChart = new Chart(pieCanvas.value.getContext("2d"), {
    type: "pie",
    data: {
      labels: categoryLabels.value,
      datasets: [{
        data: categoryValues.value,
        backgroundColor: generatePalette(categoryLabels.value.length),
        borderWidth: 0.5,
      }],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  barChart = new Chart(barCanvas.value.getContext("2d"), {
    type: "bar",
    data: {
      labels: avgPriceLabels.value,
      datasets: [{
        label: "Avg Price",
        data: avgPriceValues.value,
        backgroundColor: generatePalette(avgPriceLabels.value.length),
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } },
    },
  });
}

onMounted(() => {
  if (pieCanvas.value) pieCanvas.value.parentElement.style.height = "280px";
  if (barCanvas.value) barCanvas.value.parentElement.style.height = "280px";
});
</script>

<style scoped>
@media (max-width: 1024px) {
  header {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

table td {
  vertical-align: middle;
}
</style>
