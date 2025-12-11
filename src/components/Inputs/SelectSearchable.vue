<template>
<div>
<label v-if="label" class="block text-sm font-medium text-gray-600 mb-1">{{ label }}</label>
<div class="relative">
<input v-model="filter" @focus="open = true" @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrev" @keydown.enter.prevent="applyHighlight" :placeholder="placeholder" class="w-full border border-gray-300 rounded-lg px-4 py-2" />


<ul v-if="open" class="absolute z-20 left-0 right-0 mt-1 bg-white border rounded shadow max-h-48 overflow-auto">
<li v-for="(opt, idx) in filtered" :key="optKey(opt)" @click="select(opt)" :class="['px-4 py-2 cursor-pointer', idx === highlight ? 'bg-gray-100' : 'hover:bg-gray-50']">
{{ optLabel(opt) }}
</li>
<li v-if="!filtered.length" class="px-4 py-2 text-sm text-gray-400">No results</li>
</ul>
</div>
</div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps({
modelValue: [String, Object],
options: { type: Array, default: () => [] },
label: String,
placeholder: { type: String, default: 'Search...'}
})
const emit = defineEmits(['update:modelValue'])


const filter = ref('')
const open = ref(false)
const highlight = ref(0)


const normalize = (o) => (typeof o === 'string' ? { slug: o, name: o } : (o.name ? o : { slug: o.slug || o.value || o.id, name: o.name || o.label }))


const optionsNorm = computed(() => props.options.map(normalize))


const filtered = computed(() => {
if (!filter.value) return optionsNorm.value
return optionsNorm.value.filter(o => o.name.toLowerCase().includes(filter.value.toLowerCase()))
})


const optLabel = (o) => o.name
const optKey = (o) => o.slug || o.name


const select = (o) => {
emit('update:modelValue', o.slug || o.name)
filter.value = optLabel(o)
open.value = false
}


const highlightNext = () => {
highlight.value = Math.min(highlight.value + 1, filtered.value.length - 1)
}
const highlightPrev = () => {
highlight.value = Math.max(highlight.value - 1, 0)
}
const applyHighlight = () => {
if (!filtered.value.length) return
select(filtered.value[highlight.value])
}


watch(() => props.modelValue, (v) => {
if (!v) filter.value = ''
})
</script>