<template>
  <div class="space-y-8 pb-20 p-6">

    <!-- Header -->
    <div class="pt-2">
      <h1 class="text-3xl font-bold pl-1 tracking-tight text-gray-900">Products</h1>
      <p class="text-gray-500 mt-1 text-sm">Manage your inventory and view product performance.</p>
    </div>

    <!-- Search, Filters, Add -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div class="flex flex-col lg:flex-row gap-3 flex-1 items-stretch">

        <!-- Search -->
        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full shadow-sm hover:border-gray-300 transition">
          <i class="fa fa-search text-gray-400"></i>
          <input
            v-model.trim="search"
            placeholder="Search by product name..."
            class="bg-transparent focus:outline-none w-full text-sm"
            @keydown.enter.prevent
            aria-label="Search products by name"
          />
          <button v-if="search" @click="search = ''" class="text-gray-400 hover:text-gray-600 ml-2">
            ✕
          </button>
        </div>

        <!-- Category Filter implemented with datalist (native, reliable) -->
        <div class="relative w-full lg:w-64">
          <input
            v-model.trim="selectedCategory"
            list="category-datalist"
            placeholder="Filter by category..."
            class="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
            aria-label="Filter by category"
          />
          <datalist id="category-datalist">
            <option v-for="c in categoryNames" :key="c" :value="c" />
          </datalist>
          <button v-if="selectedCategory" @click="selectedCategory = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <!-- Stock Filter -->
        <select
          v-model="stockFilter"
          class="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl shadow-sm cursor-pointer w-full lg:w-auto text-sm hover:border-gray-300 transition"
        >
          <option value="">Stock Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <!-- Add Product -->
      <router-link
        :to="{ name: 'ProductNew' }"
        class="px-5 py-2.5 bg-blue-900 text-white rounded-xl shadow hover:bg-blue-800 transition flex items-center gap-2 text-sm whitespace-nowrap"
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
        <thead class="bg-gray-50">
          <tr class="text-left text-gray-600 border-b text-xs uppercase tracking-wider sticky top-0">
            <th class="py-4 px-5 font-medium">Product</th>
            <th class="py-4 px-5 font-medium">Category</th>
            <th class="py-4 px-5 font-medium">Price</th>
            <th class="py-4 px-5 font-medium">Stock</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(p, index) in paginated"
            :key="p.id + '-' + index"
            class="border-b last:border-none hover:bg-gray-50 transition cursor-pointer"
            @click="goToProduct(p.id)"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          >
            <!-- Product -->
            <td class="py-5 px-5 align-top">
              <div class="flex items-start gap-4">
                <img :src="p.thumbnail || p.images?.[0]" class="w-14 h-14 rounded-lg object-cover shadow-sm border border-gray-200" />
                <div class="min-w-0">
                  <p class="font-semibold text-gray-900 text-sm leading-tight truncate">{{ p.title }}</p>
                  <p class="text-gray-500 text-xs leading-snug line-clamp-2 max-w-xs">{{ p.description }}</p>
                </div>
              </div>
            </td>

            <!-- Category -->
            <td class="py-5 px-5 align-top">
              <span class="px-2.5 py-1 text-xs rounded-lg font-medium inline-block" :class="badgeColor(p.category)">
                {{ getCategoryName(p.category) }}
              </span>
            </td>

            <!-- Price -->
            <td class="py-5 px-5 font-semibold text-gray-700 align-top">
              ${{ Number(p.price).toFixed(2) }}
            </td>

            <!-- Stock -->
            <td class="py-5 px-5 align-top">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :class="stockDot(Number(p.stock))"></span>
                <span class="text-sm text-gray-700">{{ stockLabel(Number(p.stock)) }}</span>
              </div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="!filtered.length">
            <td colspan="4" class="py-8 px-5 text-center text-gray-500">No products match your filters.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-4 gap-3">
      <span class="whitespace-nowrap">
        Showing <strong class="text-gray-700">{{ paginated.length }}</strong> of <strong class="text-gray-700">{{ filtered.length }}</strong> results
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useProductsStore } from "../stores/products";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useProductsStore();

const search = ref("");
const selectedCategory = ref("");
const stockFilter = ref("");
const page = ref(1);
const perPage = ref(10);

// Load products + categories
onMounted(async () => {
  await store.fetchProducts();
  await store.fetchCategories();
});

// Reset page when filters/search change (avoid empty pages)
watch([search, selectedCategory, stockFilter], () => {
  page.value = 1;
});

// Provide small debounce to avoid firing on every single keystroke if needed
// (kept simple for now; you can add useDebounce later)

// Navigate
const goToProduct = (id) => router.push({ name: 'ProductView', params: { id } });

// Filtered products (defensive & robust)
const filtered = computed(() => {
  const q = (search.value || "").toString().trim().toLowerCase();
  const catFilter = (selectedCategory.value || "").toString().trim().toLowerCase();
  const isCatEmpty = !catFilter;

  return (store.products || []).filter((p) => {
    // title match (if there's a query)
    const title = (p.title || "").toString().toLowerCase();
    const matchesSearch = !q || title.includes(q);

    // category match - if user cleared category, allow all
    const productCat = (p.category || "").toString().toLowerCase();
    let matchesCategory = true;
    if (!isCatEmpty) {
      // accept exact match OR substring match (user may type partial)
      matchesCategory = productCat === catFilter || productCat.includes(catFilter);
    }

    // stock match
    const stock = Number(p.stock || 0);
    let matchesStock = true;
    if (stockFilter.value === "in") matchesStock = stock > 20;
    else if (stockFilter.value === "low") matchesStock = stock > 0 && stock <= 20;
    else if (stockFilter.value === "out") matchesStock = stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });
});

// Pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage.value))
);

const paginated = computed(() => {
  // clamp page to valid range
  if (page.value > totalPages.value) page.value = totalPages.value;
  const start = (page.value - 1) * perPage.value;
  return filtered.value.slice(start, start + perPage.value);
});

// Pagination actions
const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};
const prevPage = () => {
  if (page.value > 1) page.value--;
};

// Category names for datalist (normalize values to simple strings)
const categoryNames = computed(() => {
  // store.categories can be either array of strings (from DummyJSON) or objects
  const raw = store.categories || [];
  // ensure unique & sorted presentation
  const arr = raw.map(c => (typeof c === 'string' ? c : (c.name || c.slug || c))).filter(Boolean);
  return Array.from(new Set(arr)).sort((a,b) => a.localeCompare(b));
});

// Get display label for a product category 
const getCategoryName = (cat) => {
  if (!cat) return "Uncategorized";
  const found = (store.categories || []).find(c => {
    if (typeof c === 'string') return c.toLowerCase() === String(cat).toLowerCase();
    return (c.slug && c.slug.toString().toLowerCase() === String(cat).toLowerCase())
      || (c.name && c.name.toString().toLowerCase() === String(cat).toLowerCase());
  });
  if (found) return typeof found === 'string' ? found : (found.name || found.slug || cat);
  return cat;
};

// Category badge colors (lowercase defensively)
const badgeColor = (cat) => {
  const key = (cat || "").toString().toLowerCase();
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
  return map[key] || "bg-gray-100 text-gray-600";
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
</script>

<style scoped>

table thead { 
  background: rgba(247, 249, 252, 0.9);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rounded-2xl { border-radius: 1rem; }


thead tr { position: sticky; top: 0; z-index: 10; }
</style>
