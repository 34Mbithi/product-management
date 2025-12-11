<template>
<div>
<label v-if="label" class="block text-sm font-medium text-gray-600 mb-1">{{ label }}</label>
<input type="number" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
</div>
</template>
<script setup>
const props = defineProps({ modelValue: [Number, String], label: String, placeholder: String })
</script>