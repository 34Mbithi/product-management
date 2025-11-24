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
  history: createWebHistory(),
  routes,
})

export default router
