<template>
  <div>
    <!-- Hamburger Button -->
    <button
      class="p-3 fixed top-4 left-4 z-50 bg-white shadow-lg rounded-xl"
      @click="$emit('toggle')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-white border-r shadow-xl z-40 p-5 flex flex-col justify-between transition-transform duration-300',
        collapsed ? '-translate-x-full' : 'translate-x-0'
      ]"
    >

      <!-- TOP SECTION -->
      <div>
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              PM
            </div>
            <div>
              <h3 class="font-semibold">Product Manager</h3>
              <p class="text-xs text-gray-500">Admin</p>
            </div>
          </div>

          <button @click="$emit('toggle')">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <router-link
            to="/dashboard"
            class="block p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3"
            :class="$route.path === '/dashboard' ? 'bg-gray-200 font-semibold' : ''"
          >
            <i class="fa fa-home"></i> Dashboard
          </router-link>

          <router-link
            to="/products"
            class="block p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3"
            :class="$route.path.startsWith('/products') && !$route.path.includes('new') ? 'bg-gray-200 font-semibold' : ''"
          >
            <i class="fa fa-box"></i> Products
          </router-link>

          <router-link
            to="/products/new"
            class="block p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3"
            :class="$route.path === '/products/new' ? 'bg-gray-200 font-semibold' : ''"
          >
            <i class="fa fa-plus"></i> Add Product
          </router-link>
        </nav>
      </div>

      <!-- BOTTOM LOGOUT BUTTON -->
      <button
        @click="logout"
        class="mt-6 w-full p-3 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-3 
               hover:bg-blue-700 transition-all"
      >
        <i class="fa fa-sign-out"></i>
        Logout
      </button>

    </aside>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'

defineProps({ collapsed: Boolean })
defineEmits(['toggle'])

const router = useRouter()

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
aside {
  backdrop-filter: blur(4px);
}
</style>
