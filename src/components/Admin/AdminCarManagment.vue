<template>
  <div class="car-management">
    <h2>Car Management</h2>
    <div class="controls">
      <input v-model="searchTerm" placeholder="Search cars..." aria-label="Search cars" />
      <button @click="openAddModal" class="add-button">Add New Car</button>
    </div>
    <table v-if="filteredCars.length" class="car-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Make</th>
          <th>Model</th>
          <th>Owner</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in filteredCars" :key="car.id">
          <td>{{ car.id }}</td>
          <td>{{ car.make }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.owner }}</td>
          <td>{{ car.status }}</td>
          <td>
            <button v-if="car.status === 'pending'" @click="approveCar(car.id)" class="action-button approve">Approve</button>
            <button v-if="car.status === 'pending'" @click="rejectCar(car.id)" class="action-button reject">Reject</button>
            <button @click="editCar(car)" class="action-button edit">Edit</button>
            <button @click="deleteCar(car.id)" class="action-button delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No car listings found.</p>
    <!-- Add Car Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New Car</h3>
        <form @submit.prevent="addCar">
          <div class="form-group">
            <label for="make">Make</label>
            <input id="make" v-model="newCar.make" placeholder="Enter make" required />
          </div>
          <div class="form-group">
            <label for="model">Model</label>
            <input id="model" v-model="newCar.model" placeholder="Enter model" required />
          </div>
          <div class="form-group">
            <label for="owner">Owner</label>
            <input id="owner" v-model="newCar.owner" placeholder="Enter owner" required />
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="newCar.status">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">Add Car</button>
            <button type="button" @click="showAddModal = false" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Edit Car Modal (assumed to exist, updated to use API) -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Car</h3>
        <form @submit.prevent="saveCar">
          <div class="form-group">
            <label for="edit-make">Make</label>
            <input id="edit-make" v-model="selectedCar.make" placeholder="Enter make" required />
          </div>
          <div class="form-group">
            <label for="edit-model">Model</label>
            <input id="edit-model" v-model="selectedCar.model" placeholder="Enter model" required />
          </div>
          <div class="form-group">
            <label for="edit-owner">Owner</label>
            <input id="edit-owner" v-model="selectedCar.owner" placeholder="Enter owner" required />
          </div>
          <div class="form-group">
            <label for="edit-status">Status</label>
            <select id="edit-status" v-model="selectedCar.status">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">Save</button>
            <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
          </div>
        </form>
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
      searchTerm: '',
      newCar: { make: '', model: '', owner: '', status: 'pending' },
      showAddModal: false,
      showEditModal: false,
      selectedCar: null,
      isLoading: false,
      errorMessage: null
    };
  },
  computed: {
    filteredCars() {
      return this.cars.filter(car =>
        car.make.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.owner.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchCars();
  },
  methods: {
    fetchCars() {
      this.isLoading = true;
      axios.get('/api/cars')
        .then(response => {
          this.cars = response.data;
        })
        .catch(error => {
          this.errorMessage = 'Failed to fetch cars. Please try again.';
          console.error('Error fetching cars:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    approveCar(id) {
      this.isLoading = true;
      axios.put(`/api/cars/${id}`, { status: 'approved' })
        .then(() => this.fetchCars())
        .catch(error => {
          this.errorMessage = 'Failed to approve car.';
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    rejectCar(id) {
      this.isLoading = true;
      axios.put(`/api/cars/${id}`, { status: 'rejected' })
        .then(() => this.fetchCars())
        .catch(error => {
          this.errorMessage = 'Failed to reject car.';
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    editCar(car) {
      this.selectedCar = { ...car };
      this.showEditModal = true;
    },
    saveCar() {
      this.isLoading = true;
      axios.put(`/api/cars/${this.selectedCar.id}`, this.selectedCar)
        .then(() => {
          this.fetchCars();
          this.showEditModal = false;
          this.selectedCar = null;
        })
        .catch(error => {
          this.errorMessage = 'Failed to save car.';
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    deleteCar(id) {
      if (confirm('Are you sure you want to delete this car?')) {
        this.isLoading = true;
        axios.delete(`/api/cars/${id}`)
          .then(() => this.fetchCars())
          .catch(error => {
            this.errorMessage = 'Failed to delete car.';
            console.error(error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    openAddModal() {
      this.newCar = { make: '', model: '', owner: '', status: 'pending' };
      this.showAddModal = true;
    },
    addCar() {
      this.isLoading = true;
      axios.post('/api/cars', this.newCar)
        .then(response => {
          this.cars.push(response.data);
          this.showAddModal = false;
          this.newCar = { make: '', model: '', owner: '', status: 'pending' };
        })
        .catch(error => {
          this.errorMessage = 'Failed to add car.';
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.car-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #218838;
}

.car-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.car-table th, .car-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.car-table th {
  background-color: #f4f4f4;
}

.action-button {
  padding: 6px 12px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.approve {
  background-color: #28a745;
  color: white;
}

.reject {
  background-color: #dc3545;
  color: white;
}

.edit {
  background-color: #007bff;
  color: white;
}

.delete {
  background-color: #6c757d;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.submit-button {
  background-color: #28a745;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>