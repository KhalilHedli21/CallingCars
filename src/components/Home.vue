<template>
  <div class="home container mx-auto px-4">
    <!-- Welcome Message -->
    <div class="welcome-message text-center py-8">
      <h2 class="text-2xl font-bold" v-if="userType === 'guest'">Bienvenue, Invité !</h2>
      <h2 class="text-2xl font-bold" v-else>Bienvenue de retour !</h2>
      <p class="text-sm mt-2" v-if="userType === 'guest'">
        Vous naviguez en tant qu'invité. 
        <a href="#" class="text-blue-500 underline" @click.prevent="showSignup">Inscrivez-vous</a> pour sauvegarder vos préférences.
      </p>
    </div>

    <!-- Car Filters -->
    <div class="car-filters grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center lg:mx-auto lg:w-2/3">
      <input 
        type="text" 
        class="border rounded-lg p-2 w-full" 
        placeholder="Rechercher par marque ou modèle" 
        v-model="searchQuery">
      
      <select 
        v-model="priceRange" 
        class="border rounded-lg p-2 w-full">
        <option value="">Tous les prix</option>
        <option value="0-1000000">Moins de 1.000.000 DA</option>
        <option value="1000000-3000000">1.000.000 DA - 3.000.000 DA</option>
        <option value="3000000-5000000">3.000.000 DA - 5.000.000 DA</option>
        <option value="5000000">Plus de 5.000.000 DA</option>
      </select>
      
      <select 
        v-model="yearRange" 
        class="border rounded-lg p-2 w-full">
        <option value="">Toutes les années</option>
        <option value="2025">2025</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userType: 'guest',
      searchQuery: '',
      priceRange: '',
      yearRange: ''
    };
  },
  methods: {
    showSignup() {
      alert('Redirecting to signup...');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.welcome-message h2 {
  color: #1a202c;
}
.welcome-message p {
  color: #4a5568;
}
.car-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.car-filters select, .car-filters input {
  transition: all 0.3s ease;
}
.car-filters select:hover, .car-filters input:hover {
  border-color: #3182ce;
  box-shadow: 0 0 5px rgba(49, 130, 206, 0.5);
}
</style>
