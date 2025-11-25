<template>
  <div class="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10">
      <!-- Header -->
      <h1 class="text-3xl font-bold mb-2 text-gray-900">Add New Product</h1>
      <p class="text-gray-500 mb-8">Fill out the form below to add a new product to your inventory.</p>

      <form @submit.prevent="submit" class="space-y-8">

        <!-- Product Info -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">Product Information</h2>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Product Title</label>
            <input v-model="title" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Enter product title"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Product Description</label>
            <textarea v-model="description" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none h-32" placeholder="Provide a detailed description"></textarea>
          </div>
        </section>

        <!-- Pricing & Inventory -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">Pricing & Inventory</h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Price</label>
              <input type="number" v-model.number="price" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="$ 0.00"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Stock Quantity</label>
              <input type="number" v-model.number="stock" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Enter stock quantity"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select v-model="category" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <option value="" disabled>Select a category</option>
              <option v-for="c in store.categories" :key="c">{{ c }}</option>
            </select>
          </div>
        </section>

        <!-- Media Upload -->
        <section class="space-y-2">
          <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">Media</h2>

          <label class="block text-sm font-medium text-gray-600 mb-2">Product Image</label>
          <div class="w-full border-2 border-dashed border-gray-300 rounded-2xl h-48 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition" @click="triggerFile">
            <template v-if="thumbnailPreview">
              <img :src="thumbnailPreview" class="h-full w-full object-contain rounded-2xl"/>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <p class="text-sm font-medium">Click to upload or drag and drop</p>
              <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (Max. 800x400px)</p>
            </template>
          </div>
          <input type="file" ref="fileInput" class="hidden" @change="handleFile" accept="image/*"/>
        </section>

        <!-- Actions -->
        <div class="flex justify-end gap-4">
          <button type="button" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition" @click="router.push('/products')">Cancel</button>
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Save Product</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
const thumbnailPreview = ref('')

const fileInput = ref(null)

const triggerFile = () => fileInput.value.click()

const handleFile = (event) => {
  const file = event.target.files[0]
  if (!file) return
  thumbnail.value = file
  thumbnailPreview.value = URL.createObjectURL(file)
}

onMounted(() => {
  store.fetchCategories()
})

const submit = async () => {
  const payload = {
    title: title.value,
    description: description.value,
    category: category.value,
    price: Number(price.value),
    stock: Number(stock.value),
    thumbnail: thumbnail.value
  }

  const product = await store.addProduct(payload)

  // Reset search and filters
  router.push("/products")
}
</script>
