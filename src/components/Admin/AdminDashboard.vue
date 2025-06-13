<template>
  <div class="admin-dashboard">
    <h1>Tableau de bord Administrateur</h1>
    <p>Bienvenue sur le tableau de bord. Voici un aperçu des statistiques :</p>
    <ul>
      <li>Utilisateurs totaux : 150</li>
      <li>Annonces actives : 45</li>
      <li>Commandes en attente : 12</li>
    </ul>
    <!-- Add actual data fetching or components here -->
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  mounted() {
    // Placeholder for API call (e.g., /api/admin/stats)
    // Replace with actual implementation
    console.log('Admin Dashboard mounted');
    // Example: fetch data
    // async fetchStats() {
    //   try {
    //     const response = await axios.get('/api/admin/stats');
    //     this.stats = response.data;
    //   } catch (error) {
    //     console.error('Error fetching stats:', error);
    //   }
    // }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-dashboard h1 {
  color: #1a365d;
  margin-bottom: 1.5rem;
}

.admin-dashboard ul {
  list-style-type: none;
  padding: 0;
}

.admin-dashboard li {
  background: #f8fafc;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  color: #1e293b;
}
</style>