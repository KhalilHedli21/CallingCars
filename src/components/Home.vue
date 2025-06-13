<!-- Home.vue -->
<template>
  <div class="home">
    <div class="welcome-message">
      <h2 v-if="userType === 'guest'">Bienvenue, Invité !</h2>
      <h2 v-else>Bienvenue de retour !</h2>
    </div>

    <div class="car-filters">
      <input type="text" placeholder="Rechercher par marque ou modèle" v-model="searchQuery">
      <select v-model="priceRange">
        <option value="">Tous les prix</option>
        <option value="0-1000000">Moins de 1.000.000 DA</option>
        <option value="1000000-3000000">1.000.000 DA - 3.000.000 DA</option>
        <option value="3000000-5000000">3.000.000 DA - 5.000.000 DA</option>
        <option value="5000000">Plus de 5.000.000 DA</option>
      </select>
      <select v-model="yearRange">
        <option value="">Toutes les années</option>
        <option value="2025-2025">2025</option>
        <option value="2024-2024">2024</option>
      </select>
    </div>

    <div class="loading-spinner" v-if="loading">
      <div class="spinner"></div>
    </div>

    <div class="error-message" v-if="error">
      {{ error }}
    </div>

    <div class="car-grid" v-else>
      <CarCard
        v-for="car in currentCars"
        :key="car.id"
        :car="car"
        :is-favorite="isFavorite(car)"
        @toggle-favorite="toggleFavorite"
        @order-car="orderCar"
      />
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage">Précédent</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Suivant</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CarCard from './CarCard.vue';

export default {
  props: {
    userType: {
      type: String,
      default: 'guest'
    }
  },
  components: {
    CarCard
  },
  data() {
    return {
      cars: [
        {
          id: 1,
          make: 'Tesla',
          model: 'Model S',
          year: 2025,
          price: 10500000,
          mileage: 1000,
          image: 'https://media.ed.edmunds-media.com/tesla/model-s/2025/oem/2025_tesla_model-s_sedan_plaid_fq_oem_1_1600.jpg',
          fuelType: 'Électrique',
          transmission: 'Automatique',
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
          fuelType: 'Électrique',
          transmission: 'Automatique',
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
          fuelType: 'Électrique',
          transmission: 'Automatique',
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
          fuelType: 'Essence',
          transmission: 'Manuelle',
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
          image: 'https://th.bing.com/th/id/R.5f4d56188f67694f39e956821344b6f4?rik=KTdp7JfYjbxLEw&pid=ImgRaw&r=0',
          fuelType: 'Hybride',
          transmission: 'Automatique',
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
          fuelType: 'Essence',
          transmission: 'Automatique',
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
          fuelType: 'Essence',
          transmission: 'Manuelle',
          description: 'Iconic hatchback with sporty handling.',
          engineSize: 2.0,
          horsepower: 241,
          color: 'Red',
          topSpeed: 250,
          acceleration: 6.2
        },
        {
          id: 8,
          make: 'Ford',
          model: 'Mustang',
          year: 2025,
          price: 7800000,
          mileage: 800,
          image: 'https://th.bing.com/th/id/R.6502189fb59dc2b9f9540a9c2a34bfd7?rik=%2f9cuVVceenPzsA&pid=ImgRaw&r=0',
          fuelType: 'Essence',
          transmission: 'Manuelle',
          description: 'Classic American muscle car with bold performance.',
          engineSize: 5.0,
          horsepower: 480,
          color: 'Blue',
          topSpeed: 260,
          acceleration: 4.3
        },
        {
          id: 9,
          make: 'Renault',
          model: 'Captur',
          year: 2024,
          price: 3900000,
          mileage: 2500,
          image: 'https://mediacloud.carbuyer.co.uk/image/private/s--lLyQAnAp--/v1579606440/carbuyer/renault-captur-signature-front-static_0.jpg',
          fuelType: 'Hybride',
          transmission: 'Automatique',
          description: 'Compact crossover with modern design and efficiency.',
          engineSize: 1.6,
          horsepower: 158,
          color: 'Orange',
          topSpeed: 170,
          acceleration: 10.6
        },
        {
          id: 10,
          make: 'Kia',
          model: 'Sportage',
          year: 2024,
          price: 4600000,
          mileage: 3500,
          image: 'https://th.bing.com/th/id/R.9cd54ed4bdb586377fba36b6e7fb7e5b?rik=6dTtA0NIGBozwg&riu=http%3a%2f%2fwww.automobilesreview.com%2fgallery%2fkia-sportage-kx-4%2fkia-sportage-kx-4-01.jpg&ehk=mD1A%2buETViAL5v%2fXYFvkHVvIMra9fMrupnyqlhw2DaI%3d&risl=&pid=ImgRaw&r=0',
          fuelType: 'Essence',
          transmission: 'Automatique',
          description: 'Versatile SUV with modern features and comfort.',
          engineSize: 2.5,
          horsepower: 187,
          color: 'Green',
          topSpeed: 190,
          acceleration: 8.5
        },
        {
          id: 11,
          make: 'Porsche',
          model: 'Cayenne',
          year: 2025,
          price: 12000000,
          mileage: 500,
          image: 'https://th.bing.com/th/id/OIP.qo22rbwwocXxX83CgC30igHaD4?rs=1&pid=ImgDetMain',
          fuelType: 'Essence',
          transmission: 'Automatique',
          description: 'High-performance luxury SUV with dynamic handling.',
          engineSize: 4.0,
          horsepower: 468,
          color: 'Black',
          topSpeed: 270,
          acceleration: 4.7
        },
        {
          id: 12,
          make: 'Nissan',
          model: 'Qashqai',
          year: 2024,
          price: 4300000,
          mileage: 2800,
          image: 'https://th.bing.com/th/id/OIP.Uof2bpyxrjNco5VcX9QZnQHaE8?rs=1&pid=ImgDetMain',
          fuelType: 'Hybride',
          transmission: 'Automatique',
          description: 'Stylish crossover with efficient hybrid powertrain.',
          engineSize: 1.5,
          horsepower: 190,
          color: 'Grey',
          topSpeed: 170,
          acceleration: 7.9
        }
      ],
      favorites: [],
      loading: false,
      error: null,
      searchQuery: '',
      priceRange: '',
      yearRange: '',
      currentPage: 1,
      carsPerPage: 6
    }
  },
  computed: {
    filteredCars() {
      let filtered = this.cars;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(car => 
          car.make.toLowerCase().includes(query) || 
          car.model.toLowerCase().includes(query)
        );
      }
      
      if (this.priceRange) {
        if (this.priceRange === '5000000') {
          filtered = filtered.filter(car => car.price > 5000000);
        } else {
          const [min, max] = this.priceRange.split('-').map(Number);
          filtered = filtered.filter(car => car.price >= min && car.price <= max);
        }
      }
      
      if (this.yearRange) {
        const [min, max] = this.yearRange.split('-').map(Number);
        filtered = filtered.filter(car => car.year >= min && car.year <= max);
      }
      
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredCars.length / this.carsPerPage);
    },
    currentCars() {
      const start = (this.currentPage - 1) * this.carsPerPage;
      const end = start + this.carsPerPage;
      return this.filteredCars.slice(start, end);
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
    toggleFavorite(car) {
      if (this.userType === 'guest') {
        alert('Veuillez vous inscrire pour sauvegarder des favoris');
        return;
      }
      
      const index = this.favorites.findIndex(f => f.id === car.id);
      if (index >= 0) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(car);
      }
    },
    isFavorite(car) {
      return this.favorites.some(f => f.id === car.id);
    },
    showSignup() {
      this.$emit('show-signup');
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    orderCar(car) {
      if (this.userType === 'guest') {
        alert('Veuillez vous connecter pour commander une voiture');
        this.$router.push('/login');
        return;
      }
      this.$router.push({ 
        name: 'OrderForm', 
        params: { 
          carId: car.id, 
          make: car.make, 
          model: car.model 
        } 
      });
    }
  }
}
</script>

<style scoped>
.home {
  padding: 1rem;
}

.welcome-message {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f0f7ff;
  border-radius: 8px;
}

.welcome-message h2 {
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.welcome-message a {
  color: #4299e1;
  text-decoration: none;
}

.welcome-message a:hover {
  text-decoration: underline;
}

.car-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.car-filters input,
.car-filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
}

.car-filters input {
  flex: 1;
  max-width: 400px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e53e3e;
  padding: 1rem;
  background: #fff5f5;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 4px;
  background: #4299e1;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>