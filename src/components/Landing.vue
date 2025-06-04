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
        <div v-for="car in featuredCars" :key="car.id" class="car-card">
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
          image: 'https://media.ed.edmunds-media.com/tesla/model-s/2025/oem/2025_tesla_model-s_sedan_plaid_fq_oem_1_1600.jpg'
        },
        {
          id: 2,
          make: 'BMW',
          model: 'i4',
          year: 2025,
          price: 7200000,
          mileage: 2000,
          image: 'https://th.bing.com/th/id/OIP.JW9zqTIFt7_LCR4t0KbRIAHaEL?rs=1&pid=ImgDetMain'
        },
        {
          id: 3,
          make: 'Mercedes-Benz',
          model: 'EQS',
          year: 2025,
          price: 9500000,
          mileage: 1500,
          image: 'https://th.bing.com/th/id/OIP.DIZCLouZUNmSbdpO-PSl7wHaEK?rs=1&pid=ImgDetMain'
        }
      ]
    };
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('fr-DZ', { 
        style: 'currency', 
        currency: 'DZD',
        maximumFractionDigits: 0
      }).format(price);
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
</style>