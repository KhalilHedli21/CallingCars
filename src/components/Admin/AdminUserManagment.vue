<template>
  <div class="admin-users">
    <h1 class="users-title">User Management</h1>
    <div v-if="isLoading" class="loading">Loading users...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <div class="user-actions">
        <input v-model="search" type="text" placeholder="Search users by name or email..." class="search-input" />
        <button @click="openAddModal" class="add-button">Add New User</button>
      </div>
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="table-row">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span :class="['status-badge', user.status === 'active' ? 'active' : 'inactive']">
                {{ user.status }}
              </span>
            </td>
            <td class="actions">
              <button @click="editUser(user)" class="action-button edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteUser(user)" class="action-button delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="no-results">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New User</h3>
        <form @submit.prevent="addUser" class="modal-form">
          <div class="form-group">
            <label>Name</label>
            <input v-model="newUser.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="newUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="newUser.password" type="password" required />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="newUser.role">
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="newUser.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit">Add User</button>
            <button type="button" @click="showAddModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h2>Edit User</h2>
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label>Name</label>
            <input v-model="editUserData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="editUserData.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="editUserData.role">
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="editUserData.status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AdminUserManagement',
  data() {
    return {
      search: '',
      users: [],
      showEditModal: false,
      showAddModal: false,
      editUserData: { id: null, name: '', email: '', role: 'client', status: 'active' },
      newUser: { name: '', email: '', password: '', role: 'client', status: 'active' },
      isLoading: false,
      errorMessage: null,
    };
  },
  computed: {
    filteredUsers() {
      if (!this.search) return this.users;
      const s = this.search.toLowerCase();
      return this.users.filter(u =>
        u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
      );
    },
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.users = response.data;
      } catch (error) {
        this.errorMessage = 'Failed to fetch users.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    openAddModal() {
      this.newUser = { name: '', email: '', password: '', role: 'client', status: 'active' };
      this.showAddModal = true;
    },
    async addUser() {
      this.isLoading = true;
      try {
        const response = await axios.post('/api/users', this.newUser, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.users.push(response.data);
        this.showAddModal = false;
      } catch (error) {
        this.errorMessage = 'Failed to add user.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    editUser(user) {
      this.editUserData = { ...user };
      this.showEditModal = true;
    },
    async saveUser() {
      this.isLoading = true;
      try {
        await axios.put(`/api/users/${this.editUserData.id}`, this.editUserData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.fetchUsers();
        this.closeEditModal();
      } catch (error) {
        this.errorMessage = 'Failed to save user.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        this.isLoading = true;
        try {
          await axios.delete(`/api/users/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          this.fetchUsers();
        } catch (error) {
          this.errorMessage = 'Failed to delete user.';
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    closeEditModal() {
      this.showEditModal = false;
    },
  },
});
</script>

<style scoped>
.admin-users {
  padding: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}
.users-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
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
.user-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.search-input {
  width: 33.333%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}
.search-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
}
.add-button {
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}
.add-button:hover {
  background-color: #047857;
}
.user-table {
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}
.user-table thead {
  background-color: #f3f4f6;
}
.user-table th {
  padding: 0.75rem;
  text-align: left;
  color: #4b5563;
  font-weight: 600;
}
.table-row {
  border-bottom: 1px solid #e5e7eb;
}
.table-row:hover {
  background-color: #f9fafb;
}
.table-row td {
  padding: 0.75rem;
}
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  color: white;
}
.active {
  background-color: #10b981;
}
.inactive {
  background-color: #6b7280;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.action-button {
  background: none;
  border: none;
  color: #1f2937;
  cursor: pointer;
  font-size: 1rem;
}
.edit {
  color: #3b82f6;
}
.edit:hover {
  color: #2563eb;
}
.delete {
  color: #ef4444;
}
.delete:hover {
  color: #dc2626;
}
.no-results {
  text-align: center;
  padding: 0.75rem;
  color: #6b7280;
}
.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 50%;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: #1f2937;
}
.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.modal-buttons button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}
.modal-buttons button:first-child {
  background-color: #10b981;
  color: white;
}
.modal-buttons button:first-child:hover {
  background-color: #047857;
}
.modal-buttons button:last-child {
  background-color: #6b7280;
  color: white;
}
.modal-buttons button:last-child:hover {
  background-color: #4b5563;
}
</style>