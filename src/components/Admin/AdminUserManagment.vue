<template>
  <div class="admin-user-management">
    <h1>User Management</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(user)">Edit</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    editUser(user) {
      // Placeholder for edit functionality (e.g., modal or page navigation)
      console.log('Edit user:', user);
    },
    async deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await axios.delete(`/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          this.fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.admin-user-management {
  padding: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style>