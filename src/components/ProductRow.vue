<template>
  <tr class="border-b hover:bg-gray-100">
    <td class="p-3">
      <img :src="product.thumbnail" class="w-12 h-12 rounded-full object-cover" />
    </td>

    <td class="p-3">
      <div class="font-semibold">{{ product.title }}</div>
      <div class="text-sm text-gray-500 truncate max-w-xs">
        {{ product.description }}
      </div>
    </td>

    <td class="p-3">{{ product.category }}</td>
    <td class="p-3">Ksh {{ product.price }}</td>
    <td class="p-3">{{ product.stock }}</td>

    <td class="p-3">
      <div class="flex gap-2">
        <button @click="$emit('view')" class="px-3 py-1 border rounded">View</button>
        <button @click="$emit('delete')" class="px-3 py-1 bg-red-600 text-white rounded">
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  product: Object
})
</script>
