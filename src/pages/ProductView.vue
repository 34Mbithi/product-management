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
import { ref, onMounted } from "vue";
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

onMounted(async () => {
  product.value = await store.fetchProductById(route.params.id);
  loading.value = false;
});

const remove = async () => {
  await store.deleteProduct(route.params.id);
  router.push("/products");
};
</script>
