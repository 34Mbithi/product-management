<template>
<div>
<label v-if="label" class="block text-sm font-medium text-gray-600 mb-1">{{ label }}</label>
<textarea :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)" class="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none h-32 focus:ring-2 focus:ring-blue-500">{{ modelValue }}</textarea>
</div>
</template>
<script setup>
const props = defineProps({ modelValue: String, label: String, placeholder: String })
</script>