<template>
  <div class="space-y-10 pb-20">

    <!-- Header -->
    <div class="pt-4">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
      <p class="text-gray-500 mt-1 text-sm">Manage your inventory and view product performance.</p>
    </div>

    <!-- Search, Filters, Add -->
    <div class="bg-white p-6 rounded-2xl shadow border border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div class="flex flex-col lg:flex-row gap-4 flex-1">

        <!-- Search -->
        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full shadow-sm hover:border-gray-300 transition">
          <i class="fa fa-search text-gray-400"></i>
          <input
            v-model="search"
            placeholder="Search by product name..."
            class="bg-transparent focus:outline-none w-full text-sm"
          />
        </div>

        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          class="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl shadow-sm cursor-pointer w-full lg:w-auto text-sm hover:border-gray-300 transition"
        >
          <option value="">Category</option>
          <option v-for="c in categoryNames" :key="c" :value="c">
            {{ c }}
          </option>
        </select>

        <!-- Stock Filter -->
        <select
          v-model="stockFilter"
          class="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl shadow-sm cursor-pointer w-full lg:w-auto text-sm hover:border-gray-300 transition"
        >
          <option value="">Stock Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <!-- Add Product -->
      <router-link
        to="/products/new"
        class="px-6 py-3 bg-blue-900 text-white rounded-xl shadow hover:bg-blue-800 transition flex items-center gap-2 text-sm"
      >
        <i class="fa fa-plus"></i>
        Add New Product
      </router-link>
    </div>

    <!-- Loader -->
    <LoadingSpinner v-if="store.isLoading" />

    <!-- Product Table -->
    <div v-else class="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-gray-600 border-b bg-gray-50 text-xs uppercase tracking-wider">
            <th class="py-4 px-5 font-medium">Product</th>
            <th class="py-4 px-5 font-medium">Category</th>
            <th class="py-4 px-5 font-medium">Price</th>
            <th class="py-4 px-5 font-medium">Stock</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in paginated"
            :key="p.id"
            class="border-b last:border-none hover:bg-gray-50 transition cursor-pointer"
            @click="goToProduct(p.id)"
          >
            <!-- Product -->
            <td class="py-5 px-5">
              <div class="flex items-start gap-4">
                <img :src="p.thumbnail" class="w-14 h-14 rounded-lg object-cover shadow-sm border border-gray-200" />
                <div>
                  <p class="font-semibold text-gray-900 text-sm leading-tight">{{ p.title }}</p>
                  <p class="text-gray-500 text-xs leading-snug line-clamp-2 max-w-xs">{{ p.description }}</p>
                </div>
              </div>
            </td>

            <!-- Category -->
            <td class="py-5 px-5">
              <span class="px-2.5 py-1 text-xs rounded-lg font-medium" :class="badgeColor(p.category)">
                {{ getCategoryName(p.category) }}
              </span>
            </td>

            <!-- Price -->
            <td class="py-5 px-5 font-semibold text-gray-700">
              ${{ Number(p.price).toFixed(2) }}
            </td>

            <!-- Stock -->
            <td class="py-5 px-5">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :class="stockDot(Number(p.stock))"></span>
                <span class="text-sm text-gray-700">{{ stockLabel(Number(p.stock)) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center text-sm text-gray-500 pt-4">
      <span>
        Showing {{ paginated.length }} of {{ filtered.length }} results
      </span>

      <div class="flex items-center gap-2">

        <!-- Prev -->
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="border border-gray-300 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 shadow-sm transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          &lt;
        </button>

        <!-- Page numbers -->
        <div class="flex items-center gap-1">
          <button
            v-for="n in totalPages"
            :key="n"
            @click="page = n"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm transition shadow-sm border',
              page === n
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
            ]"
          >
            {{ n }}
          </button>
        </div>

        <!-- Next -->
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="border border-gray-300 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 shadow-sm transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          &gt;
        </button>

      </div>
    </div>

    <!-- Logout -->
    <div class="flex justify-center pt-10">
      <button @click="logout" class="px-8 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-500 transition text-sm">
        Logout
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductsStore } from "../stores/products";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useProductsStore();

const search = ref("");
const selectedCategory = ref("");
const stockFilter = ref("");
const page = ref(1);
const perPage = 10;

// Load products + categories
onMounted(async () => {
  await store.fetchProducts();
  await store.fetchCategories();
});

// Navigate
const goToProduct = (id) => router.push(`/products/${id}`);

// Filtered products
const filtered = computed(() => {
  return store.products.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = selectedCategory.value
      ? getCategoryName(p.category)?.toLowerCase() === selectedCategory.value.toLowerCase()
      : true;

    const stock = Number(p.stock || 0);
    const matchesStock =
      stockFilter.value === ""
        ? true
        : stockFilter.value === "in"
        ? stock > 20
        : stockFilter.value === "low"
        ? stock > 0 && stock <= 20
        : stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });
});

// Pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage))
);

const paginated = computed(() => {
  const start = (page.value - 1) * perPage;
  return filtered.value.slice(start, start + perPage);
});

// Pagination actions
const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};
const prevPage = () => {
  if (page.value > 1) page.value--;
};

// Category names for select dropdown
const categoryNames = computed(() => store.categories.map(c => c.name || c));

// Map slug to human-readable category
const getCategoryName = (slug) => {
  const cat = store.categories.find(c => c.slug === slug);
  return cat?.name || slug;
};

// Category badge colors
const badgeColor = (cat) => {
  const map = {
    beauty: "bg-pink-100 text-pink-700",
    fragrances: "bg-purple-100 text-purple-700",
    furniture: "bg-yellow-100 text-yellow-700",
    groceries: "bg-green-100 text-green-700",
    smartphones: "bg-blue-100 text-blue-700",
    laptops: "bg-indigo-100 text-indigo-700",
    "home-decoration": "bg-orange-100 text-orange-700",
    tops: "bg-rose-100 text-rose-700",
    skincare: "bg-teal-100 text-teal-700",
  };
  return map[cat?.toLowerCase()] || "bg-gray-100 text-gray-600";
};

// Stock indicators
const stockDot = (stock) => {
  if (stock > 20) return "bg-green-500";
  if (stock > 0) return "bg-orange-500";
  return "bg-red-500";
};

const stockLabel = (stock) => {
  if (stock > 20) return `${stock} In Stock`;
  if (stock > 0) return `${stock} Low Stock`;
  return "Out of Stock";
};

// Logout
const logout = () => {
  localStorage.clear();
  router.push("/");
};
</script>

<style scoped>
button {
  transition: 0.15s ease;
}
</style>
