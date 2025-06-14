<template>
  <div class="admin-dashboard">
    <h1>Tableau de bord</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>Utilisateurs</h3>
          <p class="stat-value">{{ stats.totalUsers }}</p>
          <p class="stat-change" :class="{ 'positive': stats.newUsers > 0 }">
            +{{ stats.newUsers }} ce mois
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-car"></i>
        </div>
        <div class="stat-content">
          <h3>Voitures</h3>
          <p class="stat-value">{{ stats.totalCars }}</p>
          <p class="stat-change" :class="{ 'positive': stats.newCars > 0 }">
            +{{ stats.newCars }} ce mois
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="stat-content">
          <h3>Commandes</h3>
          <p class="stat-value">{{ stats.totalOrders }}</p>
          <p class="stat-change" :class="{ 'positive': stats.newOrders > 0 }">
            +{{ stats.newOrders }} ce mois
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-euro-sign"></i>
        </div>
        <div class="stat-content">
          <h3>Revenus</h3>
          <p class="stat-value">{{ formatPrice(stats.totalRevenue) }}</p>
          <p class="stat-change" :class="{ 'positive': stats.monthlyRevenue > 0 }">
            +{{ formatPrice(stats.monthlyRevenue) }} ce mois
          </p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="recent-orders">
        <h2>Commandes récentes</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Voiture</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ order.user.name }}</td>
                <td>{{ order.car.make }} {{ order.car.model }}</td>
                <td>{{ formatPrice(order.total_price) }}</td>
                <td>
                  <span :class="['status-badge', order.status]">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ formatDate(order.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="pending-approvals">
        <h2>Annonces en attente</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Marque</th>
                <th>Modèle</th>
                <th>Prix</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="car in pendingCars" :key="car.id">
                <td>{{ car.make }}</td>
                <td>{{ car.model }}</td>
                <td>{{ formatPrice(car.price) }}</td>
                <td>{{ formatDate(car.created_at) }}</td>
                <td class="actions">
                  <button @click="approveCar(car.id)" class="action-button approve">
                    <i class="fas fa-check"></i>
                  </button>
                  <button @click="rejectCar(car.id)" class="action-button reject">
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        totalUsers: 0,
        newUsers: 0,
        totalCars: 0,
        newCars: 0,
        totalOrders: 0,
        newOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
      },
      recentOrders: [],
      pendingCars: [],
      isLoading: false,
      errorMessage: null
    };
  },
  methods: {
    async fetchDashboardData() {
      this.isLoading = true;
      try {
        const [usersResponse, ordersResponse, carsResponse] = await Promise.all([
          axios.get('/admin/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/admin/orders', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/admin/cars/pending', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        console.log('Users Response:', usersResponse.data);
        console.log('Orders Response:', ordersResponse.data);
        
        // Get total users from the users list response
        const totalUsers = usersResponse.data.total || 0;
        
        // Get orders data
        const orders = ordersResponse.data || [];
        const totalOrders = orders.length;
        
        // Calculate revenue and count orders by status
        const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        
        this.stats = {
          totalUsers: totalUsers,
          newUsers: 0,
          totalCars: 0,
          newCars: 0,
          totalOrders: totalOrders,
          newOrders: pendingOrders,
          totalRevenue: totalRevenue,
          monthlyRevenue: 0
        };
        this.recentOrders = orders.slice(0, 5); // Show only 5 most recent orders
        this.pendingCars = carsResponse.data;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
      } finally {
        this.isLoading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    async approveCar(carId) {
      try {
        await axios.put(`/admin/cars/${carId}/approve`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchDashboardData();
      } catch (error) {
        console.error('Error approving car:', error);
        alert('Erreur lors de l\'approbation de l\'annonce');
      }
    },
    async rejectCar(carId) {
      try {
        await axios.put(`/admin/cars/${carId}/reject`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchDashboardData();
      } catch (error) {
        console.error('Error rejecting car:', error);
        alert('Erreur lors du rejet de l\'annonce');
      }
    }
  },
  mounted() {
    this.fetchDashboardData();
    // Refresh data every 5 minutes
    setInterval(this.fetchDashboardData, 300000);
  }
};
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  background: #ebf8ff;
  color: #3182ce;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content h3 {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  color: #e53e3e;
}

.stat-change.positive {
  color: #38a169;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.recent-orders, .pending-approvals {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #edf2f7;
}

th {
  font-weight: 600;
  color: #4a5568;
  background: #f7fafc;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  transform: scale(1.1);
}

.action-button.approve {
  background: #d1fae5;
  color: #065f46;
}

.action-button.reject {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>