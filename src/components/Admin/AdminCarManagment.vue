<template>
  <div class="admin-car-management">
    <h1>Car Listings Management</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Make</th>
          <th>Model</th>
          <th>Year</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td>{{ car.id }}</td>
          <td>{{ car.make }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.year }}</td>
          <td>{{ car.status }}</td>
          <td>
            <button @click="approveCar(car.id)" v-if="car.status === 'pending'">Approve</button>
            <button @click="editCar(car)">Edit</button>
            <button @click="deleteCar(car.id)">Delete</button>
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
      cars: []
    };
  },
  mounted() {
    this.fetchCars();
  },
  methods: {
    async fetchCars() {
      try {
        const response = await axios.get('/api/admin/cars', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.cars = response.data;
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    },
    async approveCar(carId) {
      try {
        await axios.put(`/api/admin/cars/${carId}/approve`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchCars();
      } catch (error) {
        console.error('Error approving car:', error);
      }
    },
    editCar(car) {
      // Placeholder for edit functionality (e.g., modal or page navigation)
      console.log('Edit car:', car);
    },
    async deleteCar(carId) {
      if (confirm('Are you sure you want to delete this car listing?')) {
        try {
          await axios.delete(`/api/admin/cars/${carId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          this.fetchCars();
        } catch (error) {
          console.error('Error deleting car:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.admin-car-management {
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