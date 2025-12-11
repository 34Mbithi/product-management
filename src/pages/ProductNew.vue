<template>
  <div class="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10">
      <h1 class="text-3xl font-bold mb-2 text-gray-900">Add New Product</h1>
      <p class="text-gray-500 mb-8">Fill out the form below to add a new product to your inventory.</p>

      <form @submit.prevent="submit" class="space-y-8">

        <!-- Product Info -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">Product Information</h2>
          <TextInput v-model="title" label="Product Title" placeholder="Enter product title" />
          <TextareaInput v-model="description" label="Product Description" placeholder="Provide a detailed description" />
        </section>

        <!-- Pricing -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-700 border-b pb-2">Pricing & Inventory</h2>
          <div class="grid grid-cols-2 gap-4">
            <NumberInput v-model="price" label="Price" placeholder="$ 0.00" />
            <NumberInput v-model="stock" label="Stock Quantity" placeholder="Enter stock" />
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
          <FileUpload v-model="thumbnail" label="Product Image" />
        </section>

        <!-- Actions -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="router.push('/products')"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-200"
          >Cancel</button>

          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >Save Product</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'

import TextInput from '../components/Inputs/TextInput.vue'
import TextareaInput from '../components/Inputs/TextareaInput.vue'
import NumberInput from '../components/Inputs/NumberInput.vue'
import SelectSearchable from '../components/Inputs/SelectSearchable.vue'
import FileUpload from '../components/Inputs/FileUpload.vue'

const router = useRouter()
const store = useProductsStore()

const title = ref('')
const description = ref('')
const category = ref('')
const price = ref(0)
const stock = ref(0)
const thumbnail = ref('')

onMounted(() => store.fetchCategories())

const submit = async () => {
  const payload = { title: title.value, description: description.value, category: category.value, price: price.value, stock: stock.value, thumbnail: thumbnail.value }
  await store.addProduct(payload)
  router.push('/products')
}
</script>


