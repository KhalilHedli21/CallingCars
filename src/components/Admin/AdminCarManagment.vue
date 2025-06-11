<template>
  <div class="car-management">
    <h2 class="management-title">Car Management</h2>
    <div v-if="isLoading" class="loading">Loading cars...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <div class="controls">
        <input
          v-model="searchTerm"
          @input="debouncedSearch"
          placeholder="Search cars..."
          class="search-input"
        />
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
          <tr v-for="car in filteredCars" :key="car.id" class="table-row">
            <td>{{ car.id }}</td>
            <td>{{ car.make }}</td>
            <td>{{ car.model }}</td>
            <td>{{ car.owner }}</td>
            <td>{{ car.status }}</td>
            <td class="actions">
              <button
                v-if="car.status === 'pending'"
                @click="approveCar(car.id)"
                class="action-button approve"
              >
                Approve
              </button>
              <button
                v-if="car.status === 'pending'"
                @click="rejectCar(car.id)"
                class="action-button reject"
              >
                Reject
              </button>
              <button
                @click="editCar(car)"
                class="action-button edit"
              >
                Edit
              </button>
              <button
                @click="deleteCar(car.id)"
                class="action-button delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-results">No car listings found.</p>
    </div>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New Car</h3>
        <form @submit.prevent="addCar" class="modal-form">
          <div class="form-group">
            <label>Image</label>
            <input type="file" @change="handleImageUpload" accept="image/*" />
            <img v-if="previewImage" :src="previewImage" class="preview-image" />
          </div>
          <div class="form-group">
            <label>Make</label>
            <input v-model="newCar.make" required />
          </div>
          <div class="form-group">
            <label>Model</label>
            <input v-model="newCar.model" required />
          </div>
          <div class="form-group">
            <label>Owner</label>
            <input v-model="newCar.owner" required />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="newCar.status">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit">Add Car</button>
            <button @click="showAddModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Car</h3>
        <form @submit.prevent="saveCar" class="modal-form">
          <div class="form-group">
            <label>Make</label>
            <input v-model="selectedCar.make" required />
          </div>
          <div class="form-group">
            <label>Model</label>
            <input v-model="selectedCar.model" required />
          </div>
          <div class="form-group">
            <label>Owner</label>
            <input v-model="selectedCar.owner" required />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="selectedCar.status">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit">Save</button>
            <button @click="showEditModal = false">Cancel</button>
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
  name: 'AdminCarManagement',
  data() {
    return {
      cars: [],
      searchTerm: '',
      newCar: { make: '', model: '', owner: '', status: 'pending', image: null },
      showAddModal: false,
      showEditModal: false,
      selectedCar: null,
      previewImage: null,
      isLoading: false,
      errorMessage: null,
      debounceTimeout: null,
    };
  },
  computed: {
    filteredCars() {
      if (!this.searchTerm) return this.cars;
      const term = this.searchTerm.toLowerCase();
      return this.cars.filter(car =>
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.owner.toLowerCase().includes(term)
      );
    },
  },
  mounted() {
    this.fetchCars();
  },
  methods: {
    async fetchCars() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/cars', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.cars = response.data;
      } catch (error) {
        this.errorMessage = 'Failed to fetch cars.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/') && file.size < 5000000) {
        this.newCar.image = file;
        this.previewImage = URL.createObjectURL(file);
      } else {
        alert('Please upload a valid image (max 5MB)');
      }
    },
    async approveCar(id) {
      this.isLoading = true;
      try {
        await axios.put(`/api/cars/${id}`, { status: 'approved' }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.fetchCars();
      } catch (error) {
        this.errorMessage = 'Failed to approve car.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async rejectCar(id) {
      this.isLoading = true;
      try {
        await axios.put(`/api/cars/${id}`, { status: 'rejected' }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.fetchCars();
      } catch (error) {
        this.errorMessage = 'Failed to reject car.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    editCar(car) {
      this.selectedCar = { ...car };
      this.showEditModal = true;
    },
    async saveCar() {
      this.isLoading = true;
      try {
        await axios.put(`/api/cars/${this.selectedCar.id}`, this.selectedCar, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.fetchCars();
        this.showEditModal = false;
        this.selectedCar = null;
      } catch (error) {
        this.errorMessage = 'Failed to save car.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteCar(id) {
      if (confirm('Are you sure you want to delete this car?')) {
        this.isLoading = true;
        try {
          await axios.delete(`/api/cars/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          this.fetchCars();
        } catch (error) {
          this.errorMessage = 'Failed to delete car.';
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    openAddModal() {
      this.newCar = { make: '', model: '', owner: '', status: 'pending', image: null };
      this.previewImage = null;
      this.showAddModal = true;
    },
    async addCar() {
      this.isLoading = true;
      try {
        const formData = new FormData();
        for (let key in this.newCar) {
          if (this.newCar[key]) formData.append(key, this.newCar[key]);
        }
        await axios.post('/api/cars', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.fetchCars();
        this.showAddModal = false;
        this.newCar = { make: '', model: '', owner: '', status: 'pending', image: null };
        this.previewImage = null;
      } catch (error) {
        this.errorMessage = 'Failed to add car.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    debouncedSearch() {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(() => {
        this.fetchCars();
      }, 300);
    },
  },
});
</script>

<style scoped>
.car-management {
  padding: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}
.management-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
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
.controls {
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
.car-table {
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}
.car-table thead {
  background-color: #f3f4f6;
}
.car-table th {
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
.actions {
  display: flex;
  gap: 0.5rem;
}
.action-button {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}
.approve {
  background-color: #3b82f6;
  color: white;
}
.approve:hover {
  background-color: #2563eb;
}
.reject {
  background-color: #ef4444;
  color: white;
}
.reject:hover {
  background-color: #dc2626;
}
.edit {
  background-color: #f59e0b;
  color: white;
}
.edit:hover {
  background-color: #d97706;
}
.delete {
  background-color: #6b7280;
  color: white;
}
.delete:hover {
  background-color: #4b5563;
}
.no-results {
  text-align: center;
  padding: 1rem;
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
.preview-image {
  max-width: 200px;
  margin-top: 0.5rem;
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
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 1rem;
  }
  .search-input {
    width: 100%;
  }
  .modal-content {
    width: 90%;
  }
}
</style>