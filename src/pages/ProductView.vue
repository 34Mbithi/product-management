<template>
  <div>
    <button @click="router.back()" class="mb-4 px-3 py-1 border rounded">
      Back
    </button>

    <LoadingSpinner v-if="loading" />

    <div v-else class="bg-white p-6 rounded shadow max-w-2xl">
      <img
        :src="product.thumbnail"
        class="w-full h-64 object-cover rounded mb-4"
      />

      <h1 class="text-2xl font-bold">{{ product.title }}</h1>
      <p class="text-gray-600 mt-2">{{ product.description }}</p>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <div><b>Category:</b> {{ product.category }}</div>
        <div><b>Price:</b> Ksh {{ product.price }}</div>
        <div><b>Stock:</b> {{ product.stock }}</div>
      </div>

      <button
        @click="confirmDelete"
        class="mt-6 px-4 py-2 bg-red-600 text-white rounded"
      >
        Delete
      </button>
    </div>

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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

const loading = ref(true)
const product = ref({})
const showConfirm = ref(false)

onMounted(async () => {
  product.value = await store.fetchProductById(route.params.id)
  loading.value = false
})

const confirmDelete = () => (showConfirm.value = true)

const remove = async () => {
  await store.deleteProduct(route.params.id)
  router.push('/products')
}
</script>
