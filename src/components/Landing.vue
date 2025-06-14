<template>
  <div class="landing">
    <section class="hero">
      <div class="hero-content">
        <h1>Trouvez Votre Voiture Idéale</h1>
        <p>Parcourez des milliers d'annonces de vendeurs fiables</p>
        <div class="hero-buttons">
          <router-link to="/home" class="primary">Explorer en tant qu'invité</router-link>
          <router-link to="/signup" class="secondary">Créer un compte</router-link>
        </div>
      </div>
    </section>

    <section class="featured-cars">
      <h2>Annonces en Vedette</h2>
      <div class="car-grid">
        <div v-for="car in featuredCars" :key="car.id" class="car-card" @click="handleCarClick(car)">
          <div class="car-image-container">
            <img :src="car.image" :alt="car.make + ' ' + car.model" class="car-image">
            <span class="car-year">{{ car.year }}</span>
          </div>
          <div class="car-details">
            <h3>{{ car.make }} {{ car.model }}</h3>
            <p class="car-price">{{ formatPrice(car.price) }}</p>
            <p class="car-mileage">{{ car.mileage.toLocaleString('fr-FR') }} km</p>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits">
      <h2>Pourquoi Nous Choisir ?</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon">🚗</div>
          <h3>Large Sélection</h3>
          <p>Des milliers de voitures de vendeurs fiables</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">💰</div>
          <h3>Meilleurs Prix</h3>
          <p>Prix compétitifs garantis</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">🔍</div>
          <h3>Recherche Facile</h3>
          <p>Trouvez exactement ce que vous cherchez</p>
        </div>
      </div>
    </section>

    <!-- Add this modal component -->
    <div v-if="showAuthModal" class="modal-overlay">
      <div class="modal">
        <h2>Bienvenue sur notre plateforme</h2>
        <p>Pour explorer nos voitures en détail, vous pouvez :</p>
        <div class="modal-actions">
          <router-link to="/signup" class="action-button primary">
            <i class="fas fa-user-plus"></i>
            Créer un compte
          </router-link>
          <router-link to="/login" class="action-button secondary">
            <i class="fas fa-sign-in-alt"></i>
            Se connecter
          </router-link>
          <button @click="continueAsGuest" class="action-button guest">
            <i class="fas fa-user"></i>
            Explorer en tant qu'invité
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  data() {
    return {
      featuredCars: [
        {
          id: 1,
          make: 'Tesla',
          model: 'Model S',
          year: 2025,
          price: 10500000,
          mileage: 1000,
          image: 'https://media.ed.edmunds-media.com/tesla/model-s/2025/oem/2025_tesla_model-s_sedan_plaid_fq_oem_1_1600.jpg',
          fuelType: 'Electric',
          transmission: 'Automatic',
          description: 'Luxury electric sedan with impressive range and performance.',
          engineSize: null,
          horsepower: 1020,
          color: 'Red',
          topSpeed: 322,
          acceleration: 1.99
        },
        {
          id: 2,
          make: 'BMW',
          model: 'i4',
          year: 2025,
          price: 7200000,
          mileage: 2000,
          image: 'https://th.bing.com/th/id/OIP.JW9zqTIFt7_LCR4t0KbRIAHaEL?rs=1&pid=ImgDetMain',
          fuelType: 'Electric',
          transmission: 'Automatic',
          description: 'Sporty electric sedan with sleek design.',
          engineSize: null,
          horsepower: 536,
          color: 'Blue',
          topSpeed: 225,
          acceleration: 3.9
        },
        {
          id: 3,
          make: 'Mercedes-Benz',
          model: 'EQS',
          year: 2025,
          price: 9500000,
          mileage: 1500,
          image: 'https://th.bing.com/th/id/OIP.DIZCLouZUNmSbdpO-PSl7wHaEK?rs=1&pid=ImgDetMain',
          fuelType: 'Electric',
          transmission: 'Automatic',
          description: 'Premium electric SUV with advanced technology.',
          engineSize: null,
          horsepower: 658,
          color: 'Black',
          topSpeed: 210,
          acceleration: 4.1
        },
        {
          id: 4,
          make: 'Toyota',
          model: 'Corolla',
          year: 2024,
          price: 3500000,
          mileage: 5000,
          image: 'https://th.bing.com/th/id/OIP.QI00zXvsyyKUw1YO4iReGgHaEn?rs=1&pid=ImgDetMain',
          fuelType: 'Petrol',
          transmission: 'Manual',
          description: 'Reliable compact sedan with excellent fuel efficiency.',
          engineSize: 1.8,
          horsepower: 139,
          color: 'Silver',
          topSpeed: 190,
          acceleration: 9.1
        },
        {
          id: 5,
          make: 'Hyundai',
          model: 'Tucson',
          year: 2024,
          price: 4800000,
          mileage: 3000,
          image: 'https://th.bing.com/th/id/R.5f4d56188f67694f39e956821344b6f4?rik=KTdp7JfYtbxLEw&pid=ImgRaw&r=0',
          fuelType: 'Hybrid',
          transmission: 'Automatic',
          description: 'Modern SUV with hybrid efficiency and bold styling.',
          engineSize: 1.6,
          horsepower: 230,
          color: 'White',
          topSpeed: 193,
          acceleration: 8.0
        },
        {
          id: 6,
          make: 'Audi',
          model: 'Q5',
          year: 2025,
          price: 6500000,
          mileage: 1200,
          image: 'https://media.ed.edmunds-media.com/audi/q5/2025/oem/2025_audi_q5_4dr-suv_prestige-s-line_fq_oem_1_1600.jpg',
          fuelType: 'Petrol',
          transmission: 'Automatic',
          description: 'Luxury compact SUV with refined performance.',
          engineSize: 2.0,
          horsepower: 261,
          color: 'Grey',
          topSpeed: 210,
          acceleration: 5.7
        },
        {
          id: 7,
          make: 'Volkswagen',
          model: 'Golf',
          year: 2024,
          price: 4200000,
          mileage: 4000,
          image: 'https://th.bing.com/th/id/OIP.B7uSn6-mEKNRJ4MQQup3TgHaFj?rs=1&pid=ImgDetMain',
          fuelType: 'Petrol',
          transmission: 'Manual',
          description: 'Iconic hatchback with sporty handling.',
          engineSize: 2.0,
          horsepower: 241,
          color: 'Red',
          topSpeed: 250,
          acceleration: 6.2
        }
      ],
      showAuthModal: false,
      selectedCar: null
    };
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('fr-DZ', { 
        style: 'currency', 
        currency: 'DZD',
        maximumFractionDigits: 0
      }).format(price);
    },
    handleCarClick(car) {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        this.selectedCar = car;
        this.showAuthModal = true;
      } else {
        // If logged in, proceed to car details
        this.$router.push(`/car/${car.id}`);
      }
    },
    continueAsGuest() {
      this.showAuthModal = false;
      // Navigate to Home.vue instead of car details
      this.$router.push('/home');
    }
  }
};
</script>

<style scoped>
.landing {
  padding: 2rem 0;
}

.hero {
  background: linear-gradient(135deg, #1a365d, #4299e1);
  color: white;
  padding: 4rem 1rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.hero-buttons .primary,
.hero-buttons .secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-block;
  text-decoration: none;
  color: inherit;
}

.hero-buttons .primary {
  background-color: white;
  color: #1a365d;
}

.hero-buttons .primary:hover {
  background-color: #e2e8f0;
}

.hero-buttons .secondary {
  background-color: transparent;
  color: white;
  border: 1px solid white;
}

.hero-buttons .secondary:hover {
  background-color: rgba(255,255,255,0.1);
}

.featured-cars {
  margin-bottom: 3rem;
}

.featured-cars h2,
.benefits h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #1a365d;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.car-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.car-card:hover {
  transform: translateY(-5px);
}

.car-image-container {
  position: relative;
  height: 200px;
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-year {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.car-details {
  padding: 1.5rem;
}

.car-details h3 {
  margin-bottom: 0.5rem;
  color: #1a365d;
}

.car-price {
  font-weight: bold;
  color: #2b6cb0;
  margin-bottom: 0.5rem;
}

.car-mileage {
  color: #718096;
  font-size: 0.875rem;
}

.benefits {
  margin-bottom: 3rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.benefit-card {
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.benefit-card h3 {
  margin-bottom: 0.5rem;
  color: #1a365d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.modal h2 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal p {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.action-button.primary {
  background-color: #4CAF50;
  color: white;
}

.action-button.primary:hover {
  background-color: #3e8e41;
}

.action-button.secondary {
  background-color: #3182ce;
  color: white;
}

.action-button.secondary:hover {
  background-color: #2c5282;
}

.action-button.guest {
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  cursor: pointer;
}

.action-button.guest:hover {
  background-color: #cbd5e0;
}
</style>