<template>
  <div class="order-form">
    <h2>Commander la voiture: {{ make }} {{ model }}</h2>
    <form @submit.prevent="submitOrder">
      <div>
        <label for="fullname">Nom complet:</label>
        <input type="text" id="fullname" v-model="fullname" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="phone">Numéro de téléphone:</label>
        <input type="tel" id="phone" v-model="phone" required>
      </div>
      <button type="submit">Soumettre la commande</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['carId', 'make', 'model'],
  data() {
    return {
      fullname: '',
      email: '',
      phone: ''
    };
  },
  methods: {
    async submitOrder() {
      try {
        const orderData = {
          carId: this.carId,
          fullname: this.fullname,
          email: this.email,
          phone: this.phone
        };
        await axios.post('http://localhost:8000/api/orders', orderData);
        alert('Commande soumise avec succès');
        this.$router.push('/');
      } catch (error) {
        alert('Erreur lors de la soumission de la commande');
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.order-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-form h2 {
  color: #1a365d;
  margin-bottom: 1.5rem;
}

.order-form div {
  margin-bottom: 1rem;
}

.order-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.order-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.order-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.order-form button:hover {
  background-color: #3182ce;
}
</style>