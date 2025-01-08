import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '../components/Login.vue'
import Product from '../components/ProductManager.vue'
import Register from '../components/Register.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import ResetPassword from '../components/ResetPassword.vue'
import Wishlist from '../components/Wishlist.vue'
import AuthSuccess from '../views/AuthSuccess.vue'
import Orders from '../components/Orders.vue'
import AdminOrders from '../components/AdminOrders.vue'
import SalesAnalytics from '../components/SalesAnalytics.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Products',
    name: 'ProductManager',
    component: Product
  },
  {
    path: '/register',
    name: 'RegisterForm',
    component: Register
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist
  },
  {
    path: '/auth/success',
    name: 'AuthSuccess',
    component: AuthSuccess
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/admin-orders',
    name: 'AdminOrders',
    component: AdminOrders
  },
  {
    path: '/analytics',
    name: 'SalesAnalytics',
    component: SalesAnalytics
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router