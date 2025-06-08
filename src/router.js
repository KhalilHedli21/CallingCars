import { createRouter, createWebHistory } from 'vue-router'
import Landing from './components/Landing.vue'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import UserProfile from './components/UserProfile.vue'
import CarDetails from './components/CarDetails.vue'
import Contact from './components/Contact.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/', 
    name: 'Contact',
    component: Contact
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/cars/:id',
    name: 'CarDetails',
    component: CarDetails,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('isAuthenticated')) {
    next('/login')
  } else {
    next()
  }
})

export default router