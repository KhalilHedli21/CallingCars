import { createRouter, createWebHistory } from 'vue-router';
import Landing from './components/Landing.vue';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import UserProfile from './components/UserProfile.vue';
import CarDetails from './components/CarDetails.vue';
import Contact from './components/Contact.vue';
import AdminDashboard from './components/Admin/AdminDashboard.vue';
import AdminUserManagement from './components/Admin/AdminUserManagment.vue';
import AdminCarManagement from './components/Admin/AdminCarManagment.vue';
import AdminOrders from './components/Admin/AdminOrders.vue';
import OrderForm from './components/OrderForm.vue';
import axios from 'axios';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/order',
    name: 'OrderForm',
    component: OrderForm,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/cars/:id',
    name: 'CarDetails',
    component: CarDetails,
    props: true,
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: { template: '<router-view></router-view>' },
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'users',
        name: 'AdminUserManagement',
        component: AdminUserManagement,
      },
      {
        path: 'listings',
        name: 'AdminCarManagement',
        component: AdminCarManagement,
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  let user = JSON.parse(localStorage.getItem('user'));

  // Fetch user data if token exists but user is missing
  if (token && !user) {
    try {
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return next('/login');
    }
  }

  // Check for routes requiring authentication
  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  // Check for admin routes
  if (to.meta.requiresAdmin) {
    if (!user || user.role !== 'admin') {
      return next('/home');
    }
  }

  next();
});

export default router;