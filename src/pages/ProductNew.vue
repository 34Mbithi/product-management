<template>
  <div class="min-h-screen bg-gray-50 flex justify-center py-12 px-4 relative">

    <div class="w-full max-w-5xl">

      <!-- Header Row: Back Button + Title -->
      <div class="flex items-center gap-4 mb-6">

        <!-- Back Button (In circled area) -->
        <button
          @click="router.back()"
          class="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-2 text-blue-700 shadow"
        >
          <i class="fa fa-arrow-left"></i>
          Back
        </button>

        <h1 class="text-3xl font-bold text-gray-900">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h1>
      </div>

      <p class="text-gray-500 mb-8">
        Fill out the form below to add a new product to your inventory.
      </p>

      <div class="bg-white rounded-2xl shadow-lg p-10">

        <form @submit.prevent="submit" class="space-y-8">

          <!-- Product Info -->
          <section class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">
              Product Information
            </h2>
            <TextInput
              v-model="title"
              label="Product Title"
              placeholder="Enter product title"
            />
            <TextareaInput
              v-model="description"
              label="Product Description"
              placeholder="Provide a detailed description"
            />
          </section>

          <!-- Pricing -->
          <section class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">
              Pricing & Inventory
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput v-model="price" label="Price" placeholder="$ 0.00" />
              <NumberInput
                v-model="stock"
                label="Stock Quantity"
                placeholder="Enter stock"
              />
            </div>

            <SelectSearchable
              v-model="category"
              :options="store.categories"
              label="Category"
              placeholder="Search category..."
            />
          </section>

          <!-- Media Upload -->
          <section class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">Media</h2>
            <FileUpload v-model="image" label="Product Image" />
            <!-- keep compatibility: FileUpload provides File or base64 -->
          </section>

          <!-- Actions -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="router.push('/products')"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              {{ isEditing ? 'Save Changes' : 'Save Product' }}
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'

import TextInput from '../components/Inputs/TextInput.vue'
import TextareaInput from '../components/Inputs/TextareaInput.vue'
import NumberInput from '../components/Inputs/NumberInput.vue'
import SelectSearchable from '../components/Inputs/SelectSearchable.vue'
import FileUpload from '../components/Inputs/FileUpload.vue'

const router = useRouter()
const route = useRoute()
const store = useProductsStore()

const isEditing = !!route.params.id

const title = ref('')
const description = ref('')
const category = ref('')
const price = ref(0)
const stock = ref(0)
const image = ref('') // can be base64 string or File

onMounted(async () => {
  // load categories (same as before)
  store.fetchCategories()

  // ensure products loaded so local items are available
  if (!store.products.length) {
    await store.fetchProducts()
  }

  if (isEditing) {
    const id = route.params.id
    const p = await store.fetchProductById(id)
    // Defensive: p might be the structure from remote (res.data) or local
    title.value = p.title ?? ''
    description.value = p.description ?? ''
    category.value = p.category ?? ''
    price.value = p.price ?? 0
    stock.value = p.stock ?? 0
    // prefer image then thumbnail for backward compatibility
    image.value = p.image ?? p.thumbnail ?? ''
  }
})

const submit = async () => {
  const payload = {
    id: isEditing ? Number(route.params.id) : Date.now(),
    title: title.value,
    description: description.value,
    category: category.value,
    price: Number(price.value),
    stock: Number(stock.value),
    // FileUpload binds to `image` ref (may be File or base64 string)
    image: image.value,
    thumbnail: image.value // also set thumbnail for compatibility
  }

  if (isEditing) {
    await store.updateProduct(payload)
  } else {
    await store.addProduct(payload)
  }

  router.push('/products')
}
</script>
