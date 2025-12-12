<!-- src/pages/Settings.vue -->
<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">Settings</h1>

    <section class="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 class="text-xl font-semibold mb-4">System Preferences</h2>

      <div class="flex items-center gap-4">
        <label class="text-gray-600 dark:text-gray-300">Dark Mode</label>

        <!-- Toggle -->
        <input type="checkbox" v-model="darkMode" @change="applyDarkMode" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const darkMode = ref(false)

onMounted(() => {
  // Load saved preference
  const saved = localStorage.getItem("darkMode") === "true"
  darkMode.value = saved

  // Apply on load
  document.documentElement.classList.toggle("dark", saved)
})

const applyDarkMode = () => {
  document.documentElement.classList.toggle("dark", darkMode.value)

  // Save preference
  localStorage.setItem("darkMode", darkMode.value)
}
</script>
