import { createRouter, createWebHistory } from "vue-router"

import LoginPage from "../pages/Login.vue"
import ProductsList from "../pages/ProductsList.vue"
import ProductView from "../pages/ProductView.vue"
import ProductNew from "../pages/ProductNew.vue"
import Dashboard from "../pages/Dashboard.vue"

import Orders from "../pages/Orders.vue"
import Customers from "../pages/Customers.vue"
import Settings from "../pages/Settings.vue"

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/products", name: "ProductsList", component: ProductsList },
  { path: "/products/new", name: "ProductNew", component: ProductNew },

  // Edit route (ProductNew used for editing)
  { path: "/products/edit/:id", name: "ProductEdit", component: ProductNew },

  // Product view (kept as-is)
  { path: "/products/:id", name: "ProductView", component: ProductView },

  // NEW PAGES
  { path: "/orders", name: "Orders", component: Orders },
  { path: "/customers", name: "Customers", component: Customers },
  { path: "/settings", name: "Settings", component: Settings },
]

const router = createRouter({
  history: createWebHistory("/product-management/"),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token")
  if (!isLoggedIn && to.path !== "/") return next("/")
  if (isLoggedIn && to.path === "/") return next("/products")
  next()
})

export default router
