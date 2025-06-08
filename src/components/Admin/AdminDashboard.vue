<template>
  <div class="admin-dashboard">
    <h1 class="dashboard-title">Admin Dashboard</h1>
    <div class="dashboard-stats">
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

export default defineComponent({
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        users: 120,
        cars: 45,
        orders: 32,
      },
    };
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
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
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
.dashboard-link i {
  margin-right: 0.5rem;
}
</style>