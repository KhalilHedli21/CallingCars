<template>
  <div class="admin-orders">
    <h1 class="orders-title">Orders Management</h1>
    <div class="order-actions">
      <input
        v-model="search"
        type="text"
        placeholder="Search orders by user or car..."
        class="search-input"
      />
    </div>
    <table class="order-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Car</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id" class="table-row">
          <td>{{ order.id }}</td>
          <td>{{ order.user }}</td>
          <td>{{ order.car }}</td>
          <td>{{ order.date }}</td>
          <td>
            <select v-model="order.status" @change="updateStatus(order)" class="status-select">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
          <td>
            <button @click="deleteOrder(order)" class="delete-button">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="filteredOrders.length === 0">
          <td colspan="6" class="no-results">No orders found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminOrders',
  data() {
    return {
      search: '',
      orders: [
        { id: 1, user: 'Alice Smith', car: 'Toyota Corolla', date: '2024-05-01', status: 'pending' },
        { id: 2, user: 'Bob Johnson', car: 'Honda Civic', date: '2024-05-02', status: 'processing' },
        { id: 3, user: 'Charlie Lee', car: 'Ford Focus', date: '2024-05-03', status: 'completed' },
        { id: 4, user: 'Diana King', car: 'BMW 320i', date: '2024-05-04', status: 'cancelled' },
      ],
    };
  },
  computed: {
    filteredOrders() {
      if (!this.search) return this.orders;
      const s = this.search.toLowerCase();
      return this.orders.filter(o =>
        o.user.toLowerCase().includes(s) || o.car.toLowerCase().includes(s)
      );
    },
  },
  methods: {
    updateStatus(order) {
      // Placeholder for backend update
    },
    deleteOrder(order) {
      if (confirm(`Are you sure you want to delete order #${order.id}?`)) {
        this.orders = this.orders.filter(o => o.id !== order.id);
      }
    },
  },
});
</script>

<style scoped>
.admin-orders {
  padding: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}
.orders-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
}
.order-actions {
  display: flex;
  justify-content: flex-end;
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
.order-table {
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}
.order-table thead {
  background-color: #f3f4f6;
}
.order-table th {
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
.status-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}
.delete-button {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1rem;
}
.delete-button:hover {
  color: #dc2626;
}
.no-results {
  text-align: center;
  padding: 0.75rem;
  color: #6b7280;
}
</style>