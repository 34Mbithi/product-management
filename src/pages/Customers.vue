<!-- src/pages/Customers.vue -->
<template>
  <div class="p-6">

    <!-- Back + Title -->
    <!-- Back + Title -->
    <div class="flex items-center gap-4 mb-6">
    <button
    @click="router.back()"
    class="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 transition"
    >
    Back
        </button>

  <h1 class="text-3xl font-bold">Customers</h1>
</div>


      <h1 class="text-3xl font-bold">Customers</h1>
    </div>

    <!-- Search Bar -->
    <div class="bg-white shadow rounded-lg p-4 mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <input
          v-model="q"
          placeholder="Search customers..."
          class="p-2 border rounded w-72"
        />
        <button
          @click="reload"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Search
        </button>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="store.isLoading" />

    <!-- Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="w-full border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-3 text-left">Name</th>
            <th class="border p-3 text-left">Email</th>
            <th class="border p-3 text-left">Phone</th>
            <th class="border p-3 text-left">Address</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="c in filtered"
            :key="c.id"
            class="hover:bg-gray-50 cursor-pointer transition"
            @click="goToCustomer(c.id)"
          >
            <td class="border p-3">{{ c.firstName }} {{ c.lastName }}</td>
            <td class="border p-3">{{ c.email }}</td>
            <td class="border p-3">{{ c.phone }}</td>
            <td class="border p-3">
              <p class="truncate max-w-xs">
                {{ c.address?.address }},
                {{ c.address?.city }},
                {{ c.address?.country }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="filtered.length === 0" class="text-gray-500 p-4">
        No customers found.
      </p>
    </div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCustomersStore } from '../stores/customers'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useCustomersStore()
const q = ref('')

onMounted(async () => {
  if (!store.customers.length) await store.fetchCustomers({ limit: 100 })
})

const reload = () => store.fetchCustomers({ limit: 100 })

const filtered = computed(() => {
  const term = q.value.toLowerCase().trim()
  if (!term) return store.customers
  return store.customers.filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase()
    return (
      name.includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.phone || '').toLowerCase().includes(term)
    )
  })
})

const goToCustomer = (id) => {
  router.push({ name: 'Customers', params: { id } })
}
</script>
