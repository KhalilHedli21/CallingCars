import { createRouter, createWebHistory } from 'vue-router';
import Landing from './components/Landing.vue';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import UserProfile from './components/UserProfile.vue';
import CarDetails from './components/CarDetails.vue';
import AdminDashboard from './components/Admin/AdminDashboard.vue';
import AdminUserManagment from './components/Admin/AdminUserManagment.vue';
import AdminCarManagment from './components/Admin/AdminCarManagment.vue';
import AdminOrders from './components/Admin/AdminOrders.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
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
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/car/:id',
    name: 'CarDetails',
    component: CarDetails
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUserManagment,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/cars',
    name: 'AdminCars',
    component: AdminCarManagment,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: { requiresAuth: true, adminOnly: true }
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const adminOnly = to.matched.some(record => record.meta.adminOnly);
  const user = JSON.parse(localStorage.getItem('user'));
  if (requiresAuth && !user) {
    next('/login');
  } else if (adminOnly && (!user || user.role !== 'admin')) {
    next('./Admin/AdminDashboard.vue');
  } else {
    next();
  }
});

export default router;