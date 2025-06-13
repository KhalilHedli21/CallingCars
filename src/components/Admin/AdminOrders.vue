<template>
  <div class="admin-orders">
    <header class="header">
      <h1>Gestion des Commandes</h1>
      <div class="actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="searchOrders"
            placeholder="Rechercher par client, véhicule..."
            aria-label="Rechercher des commandes"
          />
        </div>
      </div>
    </header>

    <div class="filters">
      <div class="filter-group">
        <label for="status-filter">Statut</label>
        <select id="status-filter" v-model="statusFilter" @change="filterOrders">
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="completed">Complété</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="date-range">Période</label>
        <select id="date-range" v-model="dateRange" @change="filterOrders">
          <option value="all">Toutes les dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Chargement...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="paginatedOrders.length === 0" class="no-results">
      Aucune commande trouvée
    </div>
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Véhicule</th>
            <th>Total</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.user ? order.user.name : 'N/A' }}</td>
            <td>{{ order.car ? `${order.car.make} ${order.car.model}` : 'N/A' }}</td>
            <td>{{ order.total_price }} €</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td>
              <select 
                v-model="order.status"
                @change="updateStatus(order)"
                :disabled="isLoading"
                class="status-select"
              >
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="completed">Complété</option>
                <option value="cancelled">Annulé</option>
              </select>
            </td>
            <td class="actions-cell">
              <router-link 
                :to="`/order/${order.id}`"
                class="action-button view"
                title="Voir"
                aria-label="Voir la commande"
              >
                <i class="fas fa-eye"></i>
              </router-link>
              <button 
                @click="confirmDelete(order.id)"
                class="action-button delete"
                title="Supprimer"
                aria-label="Supprimer la commande"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="pagination-button"
        aria-label="Page précédente"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">Page {{ currentPage }} de {{ totalPages }}</span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="pagination-button"
        aria-label="Page suivante"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer cette commande ?</p>
        <div class="modal-actions">
          <button @click="deleteOrder" class="confirm-button">Supprimer</button>
          <button @click="cancelDelete" class="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      filteredOrders: [],
      searchQuery: '',
      statusFilter: 'all',
      dateRange: 'all',
      isLoading: false,
      errorMessage: null,
      currentPage: 1,
      itemsPerPage: 10,
      showDeleteModal: false,
      orderToDelete: null,
      totalItems: 0,
    };
  },
  computed: {
    paginatedOrders() {
      return this.filteredOrders;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders(page = 1) {
      this.isLoading = true;
      this.errorMessage = null;
      try {
        const response = await axios.get(`/api/admin/orders?page=${page}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.orders = response.data.data;
        this.totalItems = response.data.total;
        this.filteredOrders = [...this.orders];
        this.currentPage = response.data.current_page;
        this.filterOrders();
      } catch (error) {
        this.errorMessage = 'Échec du chargement des commandes. Veuillez réessayer.';
        console.error('Error fetching orders:', error);
      } finally {
        this.isLoading = false;
      }
    },
    filterOrders() {
      let filtered = [...this.orders];
      
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === this.statusFilter);
      }
      
      const now = new Date();
      if (this.dateRange !== 'all') {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.created_at);
          
          switch (this.dateRange) {
            case 'today':
              return orderDate.toDateString() === now.toDateString();
            case 'week':
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              return orderDate >= startOfWeek;
            case 'month':
              return orderDate.getMonth() === now.getMonth() && 
                     orderDate.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        });
      }
      
      this.filteredOrders = filtered;
    },
    searchOrders() {
      if (!this.searchQuery) {
        this.filteredOrders = [...this.orders];
        this.filterOrders();
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredOrders = this.orders.filter(order => 
        (order.user && order.user.name.toLowerCase().includes(query)) || 
        (order.car && `${order.car.make} ${order.car.model}`.toLowerCase().includes(query)) ||
        order.id.toString().includes(query)
      );
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async updateStatus(order) {
      try {
        await axios.put(`/api/admin/orders/${order.id}`, { 
          status: order.status, 
          total_price: order.total_price 
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Statut de la commande mis à jour avec succès');
      } catch (error) {
        this.errorMessage = 'Échec de la mise à jour du statut de la commande. Veuillez réessayer.';
        console.error('Error updating order status:', error);
      }
    },
    confirmDelete(orderId) {
      this.orderToDelete = orderId;
      this.showDeleteModal = true;
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.orderToDelete = null;
    },
    async deleteOrder() {
      try {
        await axios.delete(`/api/admin/orders/${this.orderToDelete}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Commande supprimée avec succès');
        this.fetchOrders(this.currentPage);
      } catch (error) {
        this.errorMessage = 'Échec de la suppression de la commande. Veuillez réessayer.';
        console.error('Error deleting order:', error);
      } finally {
        this.showDeleteModal = false;
        this.orderToDelete = null;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.fetchOrders(this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.fetchOrders(this.currentPage - 1);
      }
    }
  }
};
</script>

<style scoped>
.admin-orders {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d3748;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 0.5rem 1rem 0.5rem 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 200px;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.filters {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  color: #4a5568;
}

.filter-group select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #edf2f7;
}

th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

tr:hover {
  background-color: #f8f9fa;
}

.status-select {
  padding: 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
}

.actions-cell {
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

.action-button.view {
  background-color: #ebf8ff;
  color: #3182ce;
}

.action-button.delete {
  background-color: #fff5f5;
  color: #e53e3e;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-button {
  background-color: #edf2f7;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #4a5568;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.error {
  color: #e53e3e;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
}

.modal h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.modal p {
  margin-bottom: 1.5rem;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.confirm-button {
  background-color: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.cancel-button {
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .search-box input {
    width: 100%;
  }

  .actions-cell {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>