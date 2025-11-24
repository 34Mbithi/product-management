<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="search"
        placeholder="Search products..."
        class="border px-4 py-2 rounded w-72"
      />

      <router-link
        to="/products/new"
        class="px-4 py-2 bg-primary text-white rounded"
      >
        Add New Product
      </router-link>
    </div>

    <LoadingSpinner v-if="store.isLoading" />

    <ProductTable v-else>
      <ProductRow
        v-for="p in filtered"
        :key="p.id"
        :product="p"
        @view="goTo(p.id)"
        @delete="confirmDelete(p.id)"
      />
    </ProductTable>

    <ConfirmModal
      :show="confirming"
      title="Delete Product"
      message="Are you sure?"
      @update:show="confirming = $event"
      @confirmed="deleteProduct"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductTable from '../components/ProductTable.vue'
import ProductRow from '../components/ProductRow.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useProductsStore()

const search = ref('')
const confirming = ref(false)
const deleteId = ref(null)

onMounted(() => store.fetchProducts())

const filtered = computed(() =>
  store.products.filter(p =>
    p.title.toLowerCase().includes(search.value.toLowerCase())
  )
)

const goTo = (id) => router.push(`/products/${id}`)

const confirmDelete = (id) => {
  deleteId.value = id
  confirming.value = true
}

const deleteProduct = async () => {
  await store.deleteProduct(deleteId.value)
}
</script>
