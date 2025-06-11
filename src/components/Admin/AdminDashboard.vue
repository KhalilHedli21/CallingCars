<template>
  <div class="admin-dashboard">
    <h1 class="dashboard-title">Admin Dashboard</h1>
    <h2 class="welcome-message">Welcome, Admin!</h2>
    <div v-if="isLoading" class="loading">Loading stats...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #d1fae5;">
          <i class="fas fa-users" style="color: #10b981;"></i>
        </div>
        <div class="stat-info">
          <h2 class="stat-value">{{ stats.users }}</h2>
          <p class="stat-label">Users</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #dbeafe;">
          <i class="fas fa-car" style="color: #3b82f6;"></i>
        </div>
        <div class="stat-info">
          <h2 class="stat-value">{{ stats.cars }}</h2>
          <p class="stat-label">Car Listings</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #fefcbf;">
          <i class="fas fa-shopping-cart" style="color: #f59e0b;"></i>
        </div>
        <div class="stat-info">
          <h2 class="stat-value">{{ stats.orders }}</h2>
          <p class="stat-label">Orders</p>
        </div>
      </div>
    </div>
    <div class="dashboard-links">
      <router-link to="/admin/users" class="dashboard-link">Manage Users</router-link>
      <router-link to="/admin/listings" class="dashboard-link">Manage Car Listings</router-link>
      <router-link to="/admin/orders" class="dashboard-link">Manage Orders</router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        users: 0,
        cars: 0,
        orders: 0,
      },
      isLoading: false,
      errorMessage: null,
    };
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.stats = response.data; // Expect { users: number, cars: number, orders: number }
      } catch (error) {
        this.errorMessage = 'Failed to fetch stats.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style scoped>
.admin-dashboard {
  padding: 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
}
.dashboard-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
}
.welcome-message {
  text-align: center;
  color: #4b5563;
  margin-bottom: 1rem;
}
.loading,
.error {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1rem;
}
.error {
  color: #ef4444;
}
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .dashboard-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}
.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
}
.stat-icon {
  padding: 0.75rem;
  border-radius: 50%;
}
.stat-info {
  flex-grow: 1;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}
.stat-label {
  color: #6b7280;
}
.dashboard-links {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}
@media (min-width: 768px) {
  .dashboard-links {
    grid-template-columns: repeat(3, 1fr);
  }
}
.dashboard-link {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1f2937;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
}
.dashboard-link:hover {
  background-color: #111827;
}
</style>