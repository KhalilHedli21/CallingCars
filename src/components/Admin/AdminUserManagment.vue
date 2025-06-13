<template>
  <div class="admin-user-management">
    <header class="header">
      <h1>Gestion des Utilisateurs</h1>
      <div class="actions">
        <router-link to="/admin/users/add" class="add-button">
          <i class="fas fa-plus"></i> Ajouter un Utilisateur
        </router-link>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="searchUsers"
            placeholder="Rechercher par nom, email..."
            aria-label="Rechercher des utilisateurs"
          />
        </div>
      </div>
    </header>

    <div class="filters">
      <div class="filter-group">
        <label for="role-filter">Rôle</label>
        <select id="role-filter" v-model="roleFilter" @change="filterUsers">
          <option value="all">Tous</option>
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="status-filter">Statut</label>
        <select id="status-filter" v-model="statusFilter" @change="filterUsers">
          <option value="all">Tous</option>
          <option value="active">Actif</option>
          <option value="suspended">Suspendu</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Chargement...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="paginatedUsers.length === 0" class="no-results">
      Aucun utilisateur trouvé
    </div>
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="`role-badge ${user.role}`">
                {{ user.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
              </span>
            </td>
            <td>
              <span :class="`status-badge ${user.status}`">
                {{ user.status === 'active' ? 'Actif' : 'Suspendu' }}
              </span>
            </td>
            <td class="actions-cell">
              <router-link 
                :to="`/admin/users/edit/${user.id}`"
                class="action-button edit"
                title="Modifier"
                aria-label="Modifier l'utilisateur"
              >
                <i class="fas fa-edit"></i>
              </router-link>
              <button 
                @click="toggleUserStatus(user)"
                class="action-button status"
                :title="user.status === 'active' ? 'Suspendre' : 'Activer'"
                :aria-label="user.status === 'active' ? 'Suspendre l\'utilisateur' : 'Activer l\'utilisateur'"
              >
                <i :class="user.status === 'active' ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>
              <button 
                @click="confirmDelete(user.id)"
                class="action-button delete"
                title="Supprimer"
                aria-label="Supprimer l'utilisateur"
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
        <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
        <div class="modal-actions">
          <button @click="deleteUser" class="confirm-button">Supprimer</button>
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
      users: [],
      filteredUsers: [],
      searchQuery: '',
      roleFilter: 'all',
      statusFilter: 'all',
      isLoading: false,
      errorMessage: null,
      currentPage: 1,
      itemsPerPage: 10,
      showDeleteModal: false,
      userToDelete: null,
      totalItems: 0,
    };
  },
  computed: {
    paginatedUsers() {
      return this.filteredUsers;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers(page = 1) {
      this.isLoading = true;
      this.errorMessage = null;
      try {
        const response = await axios.get(`/api/admin/users?page=${page}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.users = response.data.data;
        this.totalItems = response.data.total;
        this.filteredUsers = [...this.users];
        this.currentPage = response.data.current_page;
        this.filterUsers();
      } catch (error) {
        this.errorMessage = 'Échec du chargement des utilisateurs. Veuillez réessayer.';
        console.error('Error fetching users:', error);
      } finally {
        this.isLoading = false;
      }
    },
    filterUsers() {
      let filtered = [...this.users];
      
      if (this.roleFilter !== 'all') {
        filtered = filtered.filter(user => user.role === this.roleFilter);
      }
      
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(user => user.status === this.statusFilter);
      }
      
      this.filteredUsers = filtered;
    },
    searchUsers() {
      if (!this.searchQuery) {
        this.filteredUsers = [...this.users];
        this.filterUsers();
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    },
    async toggleUserStatus(user) {
      try {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        await axios.put(`/api/admin/users/${user.id}/status`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert(`Utilisateur ${newStatus === 'active' ? 'activé' : 'suspendu'} avec succès`);
        this.fetchUsers(this.currentPage);
      } catch (error) {
        this.errorMessage = 'Échec de la mise à jour du statut de l\'utilisateur. Veuillez réessayer.';
        console.error('Error toggling user status:', error);
      }
    },
    confirmDelete(userId) {
      this.userToDelete = userId;
      this.showDeleteModal = true;
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.userToDelete = null;
    },
    async deleteUser() {
      try {
        await axios.delete(`/api/admin/users/${this.userToDelete}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Utilisateur supprimé avec succès');
        this.fetchUsers(this.currentPage);
      } catch (error) {
        this.errorMessage = 'Échec de la suppression de l\'utilisateur. Veuillez réessayer.';
        console.error('Error deleting user:', error);
      } finally {
        this.showDeleteModal = false;
        this.userToDelete = null;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.fetchUsers(this.currentPage + 1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.fetchUsers(this.currentPage - 1);
      }
    }
  }
};
</script>

<style scoped>
.admin-user-management {
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

.filter-group select option[value="user"] {
  text-transform: capitalize;
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

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin {
  background-color: #ebf8ff;
  color: #3182ce;
}

.role-badge.user {
  background-color: #f0fff4;
  color: #38a169;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background-color: #f0fff4;
  color: #38a169;
}

.status-badge.suspended {
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

.action-button.edit {
  background-color: #ebf8ff;
  color: #3182ce;
}

.action-button.delete {
  background-color: #fff5f5;
  color: #e53e3e;
}

.action-button.status {
  background-color: #fffaf0;
  color: #dd6b20;
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