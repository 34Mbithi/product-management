import { createRouter, createWebHistory } from "vue-router"


import LoginPage from "../pages/Login.vue"
import ProductsList from "../pages/ProductsList.vue"
import ProductView from "../pages/ProductView.vue"
import ProductNew from "../pages/ProductNew.vue"
import Dashboard from "../pages/Dashboard.vue"


const routes = [
{ path: "/", name: "Login", component: LoginPage },
{ path: "/dashboard", name: "Dashboard", component: Dashboard },
{ path: "/products", name: "ProductsList", component: ProductsList },
{ path: "/products/new", name: "ProductNew", component: ProductNew },
{ path: "/products/:id", name: "ProductView", component: ProductView },
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