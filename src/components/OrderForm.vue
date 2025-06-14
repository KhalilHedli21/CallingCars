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
  props: {
    carId: {
      type: [String, Number],
      required: true
    },
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fullname: '',
      email: '',
      phone: ''
    };
  },
  created() {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.fullname = user.name || '';
        this.email = user.email || '';
        this.phone = user.phone || '';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  },
  methods: {
    async submitOrder() {
      try {
        // Validate required fields
        if (!this.carId) {
          alert('Erreur: ID de la voiture manquant');
          return;
        }

        if (!this.fullname || !this.email || !this.phone) {
          alert('Veuillez remplir tous les champs requis');
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          alert('Veuillez entrer une adresse email valide');
          return;
        }

        // Validate phone format (basic validation for French numbers)
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!phoneRegex.test(this.phone)) {
          alert('Veuillez entrer un numéro de téléphone valide');
          return;
        }

        const orderData = {
          car_id: this.carId, // Changed from carId to car_id to match backend
          fullname: this.fullname,
          email: this.email,
          phone: this.phone
        };

        // Debug logs
        console.log('carId:', this.carId);
        console.log('fullname:', this.fullname);
        console.log('email:', this.email);
        console.log('phone:', this.phone);
        console.log('Complete order data:', orderData);

        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('Vous devez être connecté pour passer une commande');
          this.$router.push('/login');
          return;
        }

        const response = await axios.post('http://localhost:8000/api/orders', orderData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          alert('Commande soumise avec succès');
          this.$router.push('/profile');
        }
      } catch (error) {
        console.error('Full error object:', error);
        
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          
          if (error.response.status === 401) {
            alert('Session expirée. Veuillez vous reconnecter.');
            this.$router.push('/login');
          } else if (error.response.status === 422) {
            const errors = error.response.data.errors;
            if (errors) {
              const errorMessages = Object.entries(errors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('\n');
              alert(`Erreurs de validation:\n${errorMessages}`);
            } else {
              alert('Erreur de validation: ' + JSON.stringify(error.response.data));
            }
          } else {
            alert(`Erreur serveur: ${error.response.data.message || JSON.stringify(error.response.data)}`);
          }
        } else if (error.request) {
          console.error('Error request:', error.request);
          alert('Pas de réponse du serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
        } else {
          console.error('Error message:', error.message);
          alert('Erreur lors de la configuration de la requête');
        }
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