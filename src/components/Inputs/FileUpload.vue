<template>
<div>
<label v-if="label" class="block text-sm font-medium text-gray-600 mb-1">{{ label }}</label>
<div @click="trigger" class="w-full border-2 border-dashed rounded-2xl h-40 flex items-center justify-center cursor-pointer">
<div v-if="preview">
<img :src="preview" class="max-h-36 object-contain" />
</div>
<div v-else class="text-sm text-gray-500">Click to upload or drag file</div>
</div>
<input ref="input" class="hidden" type="file" accept="image/*" @change="onFile" />
</div>
</template>


<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ modelValue: [File, String], label: String })
const emit = defineEmits(['update:modelValue'])
const input = ref(null)
const preview = ref('')


const trigger = () => input.value?.click()


const onFile = (e) => {
const f = e.target.files?.[0]
if (!f) return
const reader = new FileReader()
reader.onload = () => {
preview.value = reader.result
emit('update:modelValue', f)
}
reader.readAsDataURL(f)
}


watch(() => props.modelValue, (v) => {
if (!v) preview.value = ''
if (typeof v === 'string') preview.value = v
})
</script>