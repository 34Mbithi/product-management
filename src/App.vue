<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Sidebar (hidden on login page) -->
    <Sidebar
      v-if="showSidebar"
      :collapsed="collapsed"
      @toggle="toggleSidebar"
    />

    <!-- Main Content Area -->
    <div
      :class="[
        'flex-1 transition-all duration-300 p-6',
        showSidebar ? (collapsed ? 'ml-0' : 'ml-64') : 'ml-0'
      ]"
    >
      <router-view />
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const collapsed = ref(true)
const route = useRoute()


const showSidebar = computed(() => route.path !== '/')

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}
</script>
