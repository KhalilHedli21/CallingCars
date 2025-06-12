<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Welcome, Admin! Here is an overview of the platform's current status.</p>
    <div class="dashboard-stats">
      <div class="stat-card">
        <h2>{{ totalUsers }}</h2>
        <p>Total Users</p>
      </div>
      <div class="stat-card">
        <h2>{{ totalCars }}</h2>
        <p>Total Car Listings</p>
      </div>
      <div class="stat-card">
        <h2>{{ pendingApprovals }}</h2>
        <p>Pending Approvals</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      totalUsers: 0,
      totalCars: 0,
      pendingApprovals: 0
    };
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      try {
        const response = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.totalUsers = response.data.totalUsers;
        this.totalCars = response.data.totalCars;
        this.pendingApprovals = response.data.pendingApprovals;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.dashboard-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>