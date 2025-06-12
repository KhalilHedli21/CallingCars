<!-- CarCard.vue -->
<template>
  <div class="car-card">
    <div class="image-container">
      <img 
        :src="car.image" 
        :alt="car.make + ' ' + car.model" 
        class="car-image"
        loading="lazy"
      >
      <div class="car-badge">{{ car.year }}</div>
      <button class="favorite-button" @click="$emit('toggle-favorite', car)">
        {{ isFavorite ? '❤️' : '🤍' }}
      </button>
    </div>
    <div class="car-details">
      <h3 class="car-title">{{ car.make }} {{ car.model }}</h3>
      <div class="price-container">
        <span class="car-price">{{ formatPrice(car.price) }}</span>
        <span class="car-mileage">{{ car.mileage.toLocaleString('fr-FR') }} km</span>
      </div>
      <div class="car-info">
        <span><strong>Carburant :</strong> {{ car.fuelType }}</span>
        <span><strong>Transmission :</strong> {{ car.transmission }}</span>
      </div>
      <p class="car-description">{{ car.description || 'Aucune description disponible' }}</p>
      <div class="car-actions">
        <button class="order-button" @click="$emit('order-car', car)">Commander voiture</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    car: {
      type: Object,
      required: true
    },
    isFavorite: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('fr-DZ', { 
        style: 'currency', 
        currency: 'DZD',
        maximumFractionDigits: 0
      }).format(price || 0);
    }
  }
}
</script>

<style scoped>
.car-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.car-card:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
  height: 200px;
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.favorite-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  cursor: pointer;
}

.car-details {
  padding: 1.5rem;
}

.car-title {
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.price-container {
  display: flex;
  justify-content: heterod;
  align-items: center;
  margin: 1rem 0;
}

.car-price {
  color: #2b6cb0;
  font-weight: 700;
  font-size: 1.25rem;
}

.car-mileage {
  color: #718096;
  font-size: 0.875rem;
}

.car-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.car-description {
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.car-actions {
  display: flex;
  gap: 0.5rem;
}

.order-button {
  flex: 1;
  padding: 0.75rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.order-button:hover {
  background-color: #3182ce;
}
</style>