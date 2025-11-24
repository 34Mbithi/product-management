<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
    <h1 class="text-xl font-semibold mb-4">Add Product</h1>

    <form @submit.prevent="submit">
      <div class="mb-3">
        <label>Title *</label>
        <input v-model="title" class="w-full border px-3 py-2 rounded" />
      </div>

      <div class="mb-3">
        <label>Description</label>
        <textarea v-model="description" class="w-full border px-3 py-2 rounded"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label>Category</label>
          <input v-model="category" class="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label>Price</label>
          <input v-model.number="price" type="number" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label>Stock</label>
          <input v-model.number="stock" type="number" class="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label>Thumbnail URL</label>
          <input v-model="thumbnail" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <button class="px-4 py-2 bg-primary text-white rounded">Create</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'

const router = useRouter()
const store = useProductsStore()

const title = ref('')
const description = ref('')
const category = ref('')
const price = ref(0)
const stock = ref(0)
const thumbnail = ref('')

const submit = async () => {
  const payload = {
    title: title.value,
    description: description.value,
    category: category.value,
    price: price.value,
    stock: stock.value,
    thumbnail: thumbnail.value
  }

  const product = await store.addProduct(payload)
  router.push(`/products/${product.id}`)
}
</script>
