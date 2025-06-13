<template>
  <div class="admin-car-management">
    <header class="header">
      <h1>Gestion des annonces</h1>
      <div class="actions">
        <router-link to="/admin/listings/add" class="add-button">
          <i class="fas fa-plus"></i> Ajouter une annonce
        </router-link>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="searchCars"
            placeholder="Rechercher une annonce..."
            aria-label="Rechercher une annonce"
          />
        </div>
      </div>
    </header>

    <div class="filters">
      <div class="filter-group">
        <label for="status-filter">Statut</label>
        <select id="status-filter" v-model="statusFilter" @change="filterCars">
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvé</option>
          <option value="rejected">Rejeté</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="sort-by">Trier par</label>
        <select id="sort-by" v-model="sortBy" @change="sortCars">
          <option value="newest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
          <option value="price-high">Prix décroissant</option>
          <option value="price-low">Prix croissant</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table v-if="paginatedCars.length" role="grid">
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Année</th>
            <th>Prix</th>
            <th>Propriétaire</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="car in paginatedCars" :key="car.id">
            <td>{{ car.make }}</td>
            <td>{{ car.model }}</td>
            <td>{{ car.year }}</td>
            <td>{{ car.price }} €</td>
            <td>{{ car.user ? car.user.name : 'N/A' }}</td>
            <td>
              <span :class="getStatusClass(car.status)">
                {{ car.status }}
              </span>
            </td>
            <td class="actions-cell">
              <button 
                v-if="car.status === 'pending'" 
                class="action-button approve"
                @click="approveCar(car.id)"
                title="Approuver"
              >
                <i class="fas fa-check"></i>
              </button>
              <button 
                v-if="car.status === 'pending'" 
                class="action-button reject"
                @click="rejectCar(car.id)"
                title="Rejeter"
              >
                <i class="fas fa-times"></i>
              </button>
              <button 
                class="action-button edit"
                @click="editCar(car.id)"
                title="Modifier"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="action-button delete"
                @click="confirmDelete(car.id)"
                title="Supprimer"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else-if="isLoading" class="loading">
        Chargement des annonces...
      </div>
      <div v-else class="no-results">
        Aucune annonce trouvée.
      </div>
    </div>

    <div v-if="errorMessage" class="error" role="alert">
      {{ errorMessage }}
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="pagination-button" 
        :disabled="currentPage === 1"
        @click="prevPage"
        aria-label="Page précédente"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">
        Page {{ currentPage }} sur {{ totalPages }}
      </span>
      <button 
        class="pagination-button" 
        :disabled="currentPage === totalPages"
        @click="nextPage"
        aria-label="Page suivante"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer cette annonce ?</p>
        <div class="modal-actions">
          <button class="confirm-button" @click="deleteCar">Supprimer</button>
          <button class="cancel-button" @click="cancelDelete">Annuler</button>
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
      cars: [],
      filteredCars: [],
      searchQuery: '',
      statusFilter: 'all',
      sortBy: 'newest',
      isLoading: false,
      errorMessage: null,
      currentPage: 1,
      itemsPerPage: 10,
      showDeleteModal: false,
      carToDelete: null,
      totalItems: 0,
    };
  },
  computed: {
    paginatedCars() {
      return this.filteredCars;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchCars();
  },
  methods: {
    async fetchCars(page = 1) {
      this.isLoading = true;
      this.errorMessage = null;
      try {
        const response = await axios.get(`/api/admin/cars?page=${page}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.cars = response.data.data;
        this.totalItems = response.data.total;
        this.filteredCars = [...this.cars];
        this.currentPage = response.data.current_page;
        this.filterCars();
      } catch (error) {
        this.errorMessage = 'Échec du chargement des annonces. Veuillez réessayer.';
        console.error('Error fetching cars:', error);
      } finally {
        this.isLoading = false;
      }
    },
    filterCars() {
      if (this.statusFilter === 'all') {
        this.filteredCars = [...this.cars];
      } else {
        this.filteredCars = this.cars.filter(car => car.status === this.statusFilter);
      }
      this.sortCars();
    },
    sortCars() {
      switch (this.sortBy) {
        case 'newest':
          this.filteredCars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'oldest':
          this.filteredCars.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        case 'price-high':
          this.filteredCars.sort((a, b) => b.price - a.price);
          break;
        case 'price-low':
          this.filteredCars.sort((a, b) => a.price - b.price);
          break;
      }
    },
    searchCars() {
      if (!this.searchQuery) {
        this.filteredCars = [...this.cars];
        this.filterCars();
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredCars = this.cars.filter(car => 
        (car.make?.toLowerCase().includes(query) || '') || 
        car.model.toLowerCase().includes(query) ||
        car.year.toString().includes(query) ||
        car.price.toString().includes(query)
      );
      this.sortCars();
    },
    async approveCar(carId) {
      try {
        await axios.put(`/api/admin/cars/${carId}/approve`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Car approved successfully');
        this.fetchCars(this.currentPage);
      } catch (error) {
        this.errorMessage = 'Échec de l\'approbation de l\'annonce. Veuillez réessayer.';
        console.error('Error approving car:', error);
      }
    },
    async rejectCar(carId) {
      try {
        await axios.put(`/api/admin/cars/${carId}/reject`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Car rejected successfully');
        this.fetchCars(this.currentPage);
      } catch (error) {
        this.errorMessage = 'Échec du rejet de l\'annonce. Veuillez réessayer.';
        console.error('Error rejecting car:', error);
      }
    },
    editCar(carId) {
      this.$router.push(`/admin/listings/edit/${carId}`);
    },
    confirmDelete(carId) {
      this.carToDelete = carId;
      this.showDeleteModal = true;
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.carToDelete = null;
    },
    async deleteCar() {
      try {
        await axios.delete(`/api/admin/cars/${this.carToDelete}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Car deleted successfully');
        this.fetchCars(this.currentPage);
      } catch (error) {
        this.errorMessage = 'Échec de la suppression de l\'annonce. Veuillez réessayer.';
        console.error('Error deleting car:', error);
      } finally {
        this.showDeleteModal = false;
        this.carToDelete = null;
      }
    },
    getStatusClass(status) {
      return {
        'status-badge': true,
        'pending': status === 'pending',
        'approved': status === 'approved',
        'rejected': status === 'rejected'
      };
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.fetchCars(this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.fetchCars(this.currentPage - 1);
      }
    }
  }
};
</script>

<style scoped>
.admin-car-management {
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

.add-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #3e8e41;
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

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fefcbf;
  color: #b7791f;
}

.status-badge.approved {
  background-color: #f0fff4;
  color: #38a169;
}

.status-badge.rejected {
  background-color: #fff5f5;
  color: #e53e3e;
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

.action-button.approve {
  background-color: #f0fff4;
  color: #38a169;
}

.action-button.reject {
  background-color: #fff5f5;
  color: #e53e3e;
}

.action-button.edit {
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

.no-results, .loading, .error {
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

  .filters {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>