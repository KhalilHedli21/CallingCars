<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>{{ car.make }} {{ car.model }} - Additional Details</h2>
      <p><strong>Engine Size:</strong> {{ car.engineSize || 'N/A' }} L</p>
      <p><strong>Horsepower:</strong> {{ car.horsepower || 'N/A' }} hp</p>
      <p><strong>Color:</strong> {{ car.color || 'N/A' }}</p>
      <p><strong>Top Speed:</strong> {{ car.topSpeed || 'N/A' }} km/h</p>
      <p><strong>0-100 km/h:</strong> {{ car.acceleration || 'N/A' }} seconds</p>
      <button @click="$emit('close')" class="close-btn">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['car']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.close-btn:hover {
  background-color: #d32f2f;
}
</style>