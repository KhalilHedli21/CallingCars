<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-avatar">
        <button class="edit-avatar" @click="handleEditAvatar">
          <i class="fas fa-camera"></i>
        </button>
      </div>
      <div class="profile-info">
        <h1>{{ user.name }}</h1>
        <p class="user-email">{{ user.email }}</p>
        <div class="profile-stats">
          <div class="stat">
            <span class="stat-value">{{ orders.length }}</span>
            <span class="stat-label">Commandes</span>
          </div>
        </div>
      </div>
      <button class="edit-profile-btn" @click="handleEditProfile">
        <i class="fas fa-edit"></i>
        Modifier le profil
      </button>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <div class="section-header">
          <h2>Mes commandes</h2>
        </div>
        <div class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-info">
              <h3>{{ order.car.make }} {{ order.car.model }}</h3>
              <p class="order-date">Commande du: {{ formatDate(order.created_at) }}</p>
              <div class="order-status" :class="order.status">
                {{ order.status }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
}

interface Listing extends Car {
  status: 'active' | 'pending' | 'sold';
}

interface Review {
  id: number;
  carName: string;
  carImage: string;
  rating: number;
  text: string;
  date: string;
}

interface Order {
  id: number;
  car: Car;
  status: string;
  created_at: string;
}

export default defineComponent({
  name: 'UserProfile',
  data() {
    return {
      user: {
        name: '',
        email: '',
      },
      orders: [] as Order[]
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.$router.push('/login')
          return
        }

        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        this.user = response.data
        await this.fetchUserOrders()
      } catch (error) {
        console.error('Error fetching user profile:', error)
        alert('Erreur lors du chargement du profil')
      }
    },
    async fetchUserOrders() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        this.orders = response.data
      } catch (error) {
        console.error('Error fetching user orders:', error)
      }
    },
    handleEditAvatar() {
      // Implement avatar edit functionality
      console.log('Edit avatar')
    },
    handleEditProfile() {
      this.$router.push('/edit-profile')
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  async mounted() {
    this.fetchUserProfile()
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.edit-avatar:hover {
  background: #45a049;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.user-email {
  color: #6b7280;
  margin-bottom: 1rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.edit-profile-btn {
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.edit-profile-btn:hover {
  background: #45a049;
}

.profile-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a365d;
}

.orders-list {
  display: grid;
  gap: 1rem;
}

.order-card {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.order-date {
  color: #718096;
  margin: 0;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.order-status.pending {
  background-color: #FEF3C7;
  color: #92400E;
}

.order-status.confirmed {
  background-color: #D1FAE5;
  color: #065F46;
}

.order-status.cancelled {
  background-color: #FEE2E2;
  color: #991B1B;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-stats {
    justify-content: center;
  }

  .edit-profile-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>