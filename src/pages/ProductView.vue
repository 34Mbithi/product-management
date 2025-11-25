<template>
  <div class="p-6 max-w-6xl mx-auto">

    <!-- Back -->
    <button @click="router.back()" class="mb-5 px-4 py-2 bg-blue-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
      <i class="fa fa-arrow-left"></i> Back
    </button>

    <LoadingSpinner v-if="loading" />

    <div v-else class="bg-white rounded-2xl shadow p-8 grid grid-cols-1 md:grid-cols-2 gap-10">

      <!-- Image -->
      <img :src="product.thumbnail" class="w-full rounded-xl shadow object-cover" />

      <!-- Info -->
      <div>
        <h1 class="text-3xl font-bold">{{ product.title }}</h1>
        <p class="text-gray-600 mt-2 leading-relaxed">
          {{ product.description }}
        </p>

        <button
          class="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2"
        >
          <i class="fa fa-edit"></i> Edit Product
        </button>

        <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500">Price</p>
            <p class="text-gray-900 font-semibold">${{ product.price }}</p>
          </div>

          <div>
            <p class="text-gray-500">Category</p>
            <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">
              {{ product.category }}
            </span>
          </div>

          <div>
            <p class="text-gray-500">Stock</p>
            <span class="px-3 py-1 rounded-lg"
                  :class="product.stock > 20 ? 'bg-green-100 text-green-600' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-600' :
                                               'bg-red-100 text-red-600'">
              {{ product.stock }} units
            </span>
          </div>
        </div>

        <!-- Delete -->
        <button
          @click="showConfirm = true"
          class="mt-8 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
        >
          Delete Product
        </button>
      </div>
    </div>

    <!-- Customer Reviews -->
    <div class="mt-12 bg-white rounded-2xl shadow p-8">
      <h2 class="text-2xl font-bold mb-6">Customer Reviews</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Average Rating -->
        <div class="flex flex-col items-center">
          <p class="text-5xl font-bold">{{ averageRating.toFixed(1) }}</p>
          <div class="flex text-yellow-400 text-xl mt-1">
            <i v-for="i in 5" :key="i"
              class="fa"
              :class="i <= Math.round(averageRating) ? 'fa-star' : 'fa-star-o'">
            </i>
          </div>
          <p class="text-gray-500 text-sm mt-1">Based on {{ reviews.length }} reviews</p>
        </div>

        <!-- Rating Bars -->
        <div class="col-span-2 space-y-3">
          <div v-for="rating in [5,4,3,2,1]" :key="rating" class="flex items-center gap-3">
            <span class="w-6 text-sm">{{ rating }}</span>

            <div class="flex-1 bg-gray-100 h-3 rounded">
              <div class="h-full bg-yellow-400 rounded"
                :style="{ width: ratingPercent[rating] + '%' }">
              </div>
            </div>

            <span class="w-10 text-sm text-gray-500">{{ ratingPercent[rating] }}%</span>
          </div>
        </div>
      </div>

      <!-- Individual Reviews -->
      <div class="mt-10 space-y-6">
        <div
          v-for="(review, index) in reviews"
          :key="index"
          class="border-b pb-5"
        >
          <div class="flex items-center gap-2 mb-1">
            <p class="font-semibold text-gray-800">{{ review.user }}</p>
            <div class="flex text-yellow-400 text-sm">
              <i v-for="i in 5" :key="i"
                class="fa"
                :class="i <= review.rating ? 'fa-star' : 'fa-star-o'"></i>
            </div>
          </div>
          <p class="text-gray-600">{{ review.comment }}</p>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      :show="showConfirm"
      title="Delete Product"
      message="This action cannot be undone."
      @update:show="showConfirm = $event"
      @confirmed="remove"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductsStore } from "../stores/products";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ConfirmModal from "../components/ConfirmModal.vue";

const route = useRoute();
const router = useRouter();
const store = useProductsStore();

const loading = ref(true);
const product = ref({});
const showConfirm = ref(false);

// Mock Reviews
const reviews = ref([
  { user: "John D.", rating: 5, comment: "Fantastic quality! Exceeded expectations." },
  { user: "Sarah M.", rating: 4, comment: "Great jacket, fits well. Color is perfect." },
  { user: "Adam K.", rating: 3, comment: "Good material but delivery was slow." },
  { user: "Lisa R.", rating: 5, comment: "Absolutely love it! Would buy again." },
  { user: "Chris P.", rating: 1, comment: "Received the wrong size." }
]);

// Average Rating
const averageRating = computed(() => {
  if (!reviews.value.length) return 0;
  return reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length;
});

// Rating Percentages
const ratingPercent = computed(() => {
  const counts = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  reviews.value.forEach(r => counts[r.rating]++);
  const total = reviews.value.length;

  for (let key in counts) {
    counts[key] = total ? Math.round((counts[key] / total) * 100) : 0;
  }
  return counts;
});

onMounted(async () => {
  product.value = await store.fetchProductById(route.params.id);
  loading.value = false;
});

const remove = async () => {
  await store.deleteProduct(route.params.id);
  router.push("/products");
};
</script>
