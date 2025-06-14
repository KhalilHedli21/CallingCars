<template>
  <div class="admin-car-form">
    <h1>{{ carId ? 'Modifier l\'annonce' : 'Ajouter une nouvelle annonce' }}</h1>
    <form @submit.prevent="handleSubmit" class="car-form">
      <div class="form-group">
        <label for="brand">Marque:</label>
        <input type="text" id="brand" v-model="car.brand" required aria-required="true">
      </div>
      <div class="form-group">
        <label for="model">Modèle:</label>
        <input type="text" id="model" v-model="car.model" required aria-required="true">
      </div>
      <div class="form-group">
        <label for="year">Année:</label>
        <input type="number" id="year" v-model.number="car.year" required aria-required="true">
      </div>
      <div class="form-group">
        <label for="price">Prix:</label>
        <input type="number" id="price" v-model.number="car.price" required aria-required="true">
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="car.description" rows="5"></textarea>
      </div>
      <div class="form-group">
        <label for="mileage">Kilométrage:</label>
        <input type="number" id="mileage" v-model.number="car.mileage">
      </div>
      <div class="form-group">
        <label for="fuel_type">Type de carburant:</label>
        <select id="fuel_type" v-model="car.fuel_type" required>
          <option value="">Sélectionnez un type</option>
          <option value="essence">Essence</option>
          <option value="diesel">Diesel</option>
          <option value="hybride">Hybride</option>
          <option value="electrique">Électrique</option>
        </select>
      </div>
      <div class="form-group">
        <label for="transmission">Transmission:</label>
        <select id="transmission" v-model="car.transmission" required>
          <option value="">Sélectionnez un type</option>
          <option value="automatic">Automatique</option>
          <option value="manual">Manuelle</option>
        </select>
      </div>
      <div class="form-group">
        <label for="engine_size">Taille du moteur:</label>
        <input type="text" id="engine_size" v-model="car.engine_size">
      </div>
      <div class="form-group">
        <label for="power">Puissance (CV):</label>
        <input type="number" id="power" v-model.number="car.power">
      </div>
      <div class="form-group">
        <label for="color">Couleur:</label>
        <input type="text" id="color" v-model="car.color">
      </div>
      <div class="form-group">
        <label for="seats">Nombre de sièges:</label>
        <input type="number" id="seats" v-model.number="car.seats">
      </div>
      <div class="form-group">
        <label for="doors">Nombre de portes:</label>
        <input type="number" id="doors" v-model.number="car.doors">
      </div>
      <div class="form-group">
        <label for="location">Localisation:</label>
        <input type="text" id="location" v-model="car.location" required>
      </div>
      <div class="form-group">
        <label for="condition">État du véhicule:</label>
        <select id="condition" v-model="car.condition" required>
          <option value="">Sélectionnez un état</option>
          <option value="new">Neuf</option>
          <option value="used">Occasion</option>
        </select>
      </div>
      <div class="form-group">
        <label for="status">Statut:</label>
        <select id="status" v-model="car.status" required>
          <option value="available">Disponible</option>
          <option value="pending">En attente</option>
          <option value="sold">Vendu</option>
        </select>
      </div>
      <div class="form-group">
        <label for="image_url">URL de l'image (principale):</label>
        <input type="url" id="image_url" v-model="car.image_url">
      </div>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <button type="submit" class="submit-button" :disabled="isLoading">
        {{ isLoading ? 'Envoi...' : (carId ? 'Modifier l\'annonce' : 'Ajouter l\'annonce') }}
      </button>
      <button type="button" class="cancel-button" @click="$router.back()">Annuler</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminCarForm',
  props: {
    carId: { // This prop will be passed from the router for editing
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      car: {
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        mileage: 0,
        fuel_type: '',
        transmission: '',
        engine_size: '',
        power: 0,
        color: '',
        seats: 4,
        doors: 4,
        location: '',
        condition: '',
        status: 'available',
        image_url: '', // Simplified for now
      },
      isLoading: false,
      errorMessage: null,
      successMessage: null,
    };
  },
  async created() {
    if (this.carId) {
      await this.fetchCarForEdit();
    }
  },
  methods: {
    async fetchCarForEdit() {
      this.isLoading = true;
      this.errorMessage = null;
      try {
        const response = await axios.get(`/admin/cars/${this.carId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Map the response data to match our form structure
        const carData = response.data;
        this.car = {
          brand: carData.make || carData.brand, // Handle both make and brand
          model: carData.model,
          year: carData.year,
          price: carData.price,
          description: carData.description,
          mileage: carData.mileage,
          fuel_type: carData.fuel_type,
          transmission: carData.transmission,
        };
      } catch (error) {
        this.errorMessage = 'Échec du chargement des données de la voiture pour modification.';
        console.error('Error fetching car for edit:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.errorMessage = 'Vous n\'êtes pas authentifié.';
          return;
        }

        // Validate required fields
        if (!this.car.brand || !this.car.model || !this.car.year || !this.car.price || 
            !this.car.fuel_type || !this.car.transmission) {
          this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
          return;
        }

        // Prepare the data to match the backend's expected format
        const carData = {
          brand: this.car.brand,
          model: this.car.model,
          year: this.car.year,
          price: this.car.price,
          description: this.car.description,
          mileage: this.car.mileage,
          fuel_type: this.car.fuel_type,
          transmission: this.car.transmission,
          engine_size: this.car.engine_size,
          power: this.car.power,
          color: this.car.color,
          seats: this.car.seats,
          doors: this.car.doors,
          location: this.car.location,
          condition: this.car.condition,
          status: this.car.status,
          image_url: this.car.image_url
        };

        let response;
        if (this.carId) {
          // Update existing car
          response = await axios.put(`/admin/cars/${this.carId}`, carData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.successMessage = 'Annonce mise à jour avec succès !';
        } else {
          // Create new car
          response = await axios.post('/admin/cars', carData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.successMessage = 'Annonce ajoutée avec succès !';
          // Reset form after successful submission
          this.car = this.$options.data.apply(this).car;
        }

        // Redirect back to car management list after success
        setTimeout(() => {
          this.$router.push('/admin/listings');
        }, 1500);

      } catch (error) {
        console.error('Error submitting car form:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 422) {
            // Validation errors
            const errors = error.response.data.errors;
            if (errors) {
              // Format validation errors into a readable message
              const errorMessages = Object.entries(errors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('\n');
              this.errorMessage = `Erreurs de validation:\n${errorMessages}`;
            } else {
              this.errorMessage = error.response.data.message || 'Erreur de validation des données.';
            }
          } else {
            this.errorMessage = error.response.data.message || 'Une erreur est survenue lors de l\'opération.';
          }
        } else if (error.request) {
          // The request was made but no response was received
          this.errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.';
        } else {
          // Something happened in setting up the request that triggered an Error
          this.errorMessage = 'Une erreur est survenue lors de la préparation de la requête.';
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.admin-car-form {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.admin-car-form h1 {
  color: #1a365d;
  margin-bottom: 2rem;
  text-align: center;
}

.car-form .form-group {
  margin-bottom: 1.5rem;
}

.car-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-weight: 600;
}

.car-form input[type="text"],
.car-form input[type="number"],
.car-form input[type="url"],
.car-form textarea,
.car-form select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #4a5568;
  box-sizing: border-box; /* Ensures padding doesn't increase width */
}

.car-form textarea {
  resize: vertical;
  min-height: 100px;
}

.car-form input[type="text"]:focus,
.car-form input[type="number"]:focus,
.car-form input[type="url"]:focus,
.car-form textarea:focus,
.car-form select:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.submit-button,
.cancel-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button {
  background-color: #2563eb;
  color: #ffffff;
  margin-right: 1rem;
}

.submit-button:hover {
  background-color: #1a4ed8;
}

.submit-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #e2e8f0;
  color: #2d3748;
}

.cancel-button:hover {
  background-color: #cbd5e0;
}

.error-message {
  color: #e53e3e;
  background-color: #fed7d7;
  border: 1px solid #fc8181;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.success-message {
  color: #2f855a;
  background-color: #c6f6d5;
  border: 1px solid #68d391;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}
</style> 