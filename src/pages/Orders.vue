<!-- src/pages/Orders.vue -->
<template>
  <div class="p-6">

   <!-- Back + Title -->
    <div class="flex items-center gap-4 mb-6">
    <button
    @click="router.back()"
    class="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 transition"
    >
     Back
        </button>

  <h1 class="text-3xl font-bold">Search by order ID or user ID.
</h1>
</div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-4 mb-6 flex items-center gap-4">
      <input
        v-model="q"
        placeholder="Search by order ID or user ID..."
        class="p-2 border rounded w-64"
      />

      <select v-model="statusFilter" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Shipped">Shipped</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button
        @click="reload"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Search
      </button>
    </div>

    <LoadingSpinner v-if="store.isLoading" />

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="w-full border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-3 text-left">Order ID</th>
            <th class="border p-3 text-left">User ID</th>
            <th class="border p-3 text-left">Amount</th>
            <th class="border p-3 text-left">Items</th>
            <th class="border p-3 text-left">Status</th>
            <th class="border p-3 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="o in filtered"
            :key="o.id"
            @click="viewOrder(o.id)"
            class="hover:bg-gray-50 cursor-pointer transition"
          >
            <td class="border p-3">{{ o.id }}</td>
            <td class="border p-3">{{ o.userId }}</td>
            <td class="border p-3 font-semibold">${{ o.total }}</td>
            <td class="border p-3">{{ o.totalProducts }} items</td>
            <td class="border p-3">
              <span
                :class="[
                  'px-2 py-1 rounded text-white text-sm',
                  statusClass(o.status)
                ]"
              >
                {{ o.status }}
              </span>
            </td>
            <td class="border p-3">{{ o.date }}</td>
          </tr>
        </tbody>
      </table>

      <p v-if="filtered.length === 0" class="text-gray-500 p-4">
        No orders found.
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '../stores/orders'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useRouter } from 'vue-router'

const store = useOrdersStore()
const router = useRouter()

const q = ref('')
const statusFilter = ref('')

onMounted(async () => {
  if (!store.orders.length) await store.fetchOrders({ limit: 100 })
})

const reload = () => store.fetchOrders({ limit: 100 })

const filtered = computed(() => {
  const term = q.value.toLowerCase().trim()
  return store.orders.filter(o => {
    const matchesTerm =
      !term ||
      String(o.id).includes(term) ||
      String(o.userId).includes(term)

    const matchesStatus =
      !statusFilter.value || o.status === statusFilter.value

    return matchesTerm && matchesStatus
  })
})

const viewOrder = (id) => {
  router.push({ name: 'Orders', params: { id } })
}

const statusClass = (status) => ({
  Pending: 'bg-yellow-500',
  Paid: 'bg-green-600',
  Shipped: 'bg-indigo-600',
  Cancelled: 'bg-red-600'
}[status] || 'bg-gray-500')
</script>
