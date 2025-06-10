<template>
  <div class="car-details">
    <h1>{{ car.make }} {{ car.model }}</h1>
    <img :src="car.image || '/toyota.jpg'" :alt="car.make + ' ' + car.model" class="car-image">
    <p><strong>Year:</strong> {{ car.year }}</p>
    <p><strong>Price:</strong> {{ formatPrice(car.price) }}</p>
    <p><strong>Mileage:</strong> {{ car.mileage.toLocaleString() }} km</p>
    <p><strong>Fuel Type:</strong> {{ car.fuelType }}</p>
    <p><strong>Transmission:</strong> {{ car.transmission }}</p>
    <p><strong>Description:</strong> {{ car.description }}</p>
    
    <div class="comment-section">
      <label for="comment"><strong>Add a comment:</strong></label>
      <textarea 
        id="comment"
        v-model="comment" 
        placeholder="Write your comment about this car..."
        rows="4"
        class="comment-textarea"
      ></textarea>
      <button @click="saveComment" class="save-comment-btn">Save Comment</button>
    </div>
    
    <button @click="showDetailsModal = true" class="show-details-btn">Show Details</button>

    <!-- Modal for additional details -->
    <CarDetailsModal 
      v-if="showDetailsModal" 
      :car="car" 
      @close="showDetailsModal = false"
    />
  </div>
</template>

<script>
import CarDetailsModal from './CarDetailsModal.vue';

export default {
  components: { CarDetailsModal },
  props: ['car'],
  data() {
    return {
      comment: '',
      showDetailsModal: false
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('fr-DZ', { 
        style: 'currency', 
        currency: 'DZD',
        maximumFractionDigits: 0
      }).format(price || 0);
    },
    saveComment() {
      if (this.comment.trim()) {
        this.$emit('comment-saved', { carId: this.car.id, comment: this.comment });
        alert('Comment saved!');
        this.comment = ''; // Clear comment after saving
      }
    }
  }
}
</script>

<style scoped>
.car-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.car-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.comment-section {
  margin: 1.5rem 0;
}

.comment-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.save-comment-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.save-comment-btn:hover {
  background-color: #45a049;
}

.show-details-btn {
  background-color: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.show-details-btn:hover {
  background-color: #1e88e5;
}
</style>