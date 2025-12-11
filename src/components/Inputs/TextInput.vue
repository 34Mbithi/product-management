<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-600">
      {{ label }}
    </label>

    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: String,
  placeholder: String,
})

defineEmits(['update:modelValue'])
</script>
