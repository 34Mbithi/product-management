<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow w-80">
      <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>
      <p class="text-sm text-gray-600 mb-4">{{ message }}</p>

      <div class="flex justify-end gap-3">
        <button @click="close" class="px-3 py-1 border rounded">Cancel</button>
        <button @click="confirm" class="px-3 py-1 bg-primary text-white rounded">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: String,
  message: String
})

const emit = defineEmits(['update:show', 'confirmed'])

const close = () => emit('update:show', false)
const confirm = () => emit('confirmed')
</script>
