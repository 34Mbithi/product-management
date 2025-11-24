<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

    <!-- Logo -->
    <div class="flex flex-col items-center mb-6">
      <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md"></div>
      <h1 class="text-primary font-semibold text-lg mt-2">Platform Logo</h1>
    </div>

    <!-- Card -->
    <div class="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold text-center">Welcome Back</h2>
      <p class="text-center text-gray-500 mb-6">Sign in to manage your products.</p>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">

        <!-- Email -->
        <div>
          <label class="text-sm font-medium">Email or Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="you@example.com"
          >
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm font-medium">Password</label>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Enter your password"
            >
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-3 text-gray-500"
            >
              👁
            </button>
          </div>
        </div>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox">
            <span>Remember me</span>
          </label>
          <button class="text-primary hover:underline">Forgot Password?</button>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full bg-primary text-white p-3 rounded-lg font-medium hover:bg-blue-900 transition"
        >
          Login
        </button>
      </form>
    </div>

    <!-- Footer -->
    <p class="text-gray-500 text-sm mt-6">
      © 2024 Platform Inc. All Rights Reserved.
    </p>

  </div>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "../stores/auth"

const username = ref("")
const password = ref("")
const showPassword = ref(false)

const auth = useAuthStore()

const handleLogin = async () => {
  await auth.login({
    username: username.value,
    password: password.value,
  })
}
</script>

<style scoped>
</style>
