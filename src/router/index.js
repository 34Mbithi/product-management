import { createRouter, createWebHistory } from "vue-router"

import LoginPage from "../pages/Login.vue"
import ProductsList from "../pages/ProductsList.vue"
import ProductView from "../pages/ProductView.vue"
import ProductNew from "../pages/ProductNew.vue"

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/products", name: "ProductsList", component: ProductsList },
  { path: "/products/new", name: "ProductNew", component: ProductNew },
  { path: "/products/:id", name: "ProductView", component: ProductView },
]

const router = createRouter({
  // Set the base path to your repo name for GitHub Pages
  history: createWebHistory("/product-management/"),
  routes,
})

// 🔒 Route Protection
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token")

  // User NOT logged in → redirect everything except login
  if (!isLoggedIn && to.path !== "/") {
    return next("/")
  }

  // User logged in → prevent visiting login page
  if (isLoggedIn && to.path === "/") {
    return next("/products")
  }

  next()
})

export default router
