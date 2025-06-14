<template>
  <div class="edit-profile-container">
    <h2>Modifier le profil</h2>
    <form @submit.prevent="updateProfile" class="edit-profile-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          :disabled="true"
          class="form-control"
        >
        <small class="form-text">L'email ne peut pas être modifié</small>
      </div>

      <div class="form-group">
        <label for="name">Nom complet:</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          required 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="phone">Téléphone:</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="phone" 
          required 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="currentPassword">Mot de passe actuel:</label>
        <input 
          type="password" 
          id="currentPassword" 
          v-model="currentPassword" 
          required 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="newPassword">Nouveau mot de passe (optionnel):</label>
        <input 
          type="password" 
          id="newPassword" 
          v-model="newPassword" 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmer le nouveau mot de passe:</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          class="form-control"
          :required="!!newPassword"
        >
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Enregistrer les modifications</button>
        <button type="button" @click="$router.back()" class="btn-secondary">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditProfile',
  data() {
    return {
      email: '',
      name: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  async created() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = response.data;
      this.email = userData.email;
      this.name = userData.name;
      this.phone = userData.phone;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      alert('Erreur lors du chargement du profil');
    }
  },
  methods: {
    async updateProfile() {
      try {
        if (this.newPassword && this.newPassword !== this.confirmPassword) {
          alert('Les mots de passe ne correspondent pas');
          return;
        }

        const token = localStorage.getItem('token');
        const updateData = {
          name: this.name,
          phone: this.phone,
          current_password: this.currentPassword,
          new_password: this.newPassword
        };

        await axios.put('http://localhost:8000/api/user/profile', updateData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Update local storage with new user data
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.name = this.name;
        userData.phone = this.phone;
        localStorage.setItem('user', JSON.stringify(userData));

        alert('Profil mis à jour avec succès');
        this.$router.push('/profile');
      } catch (error) {
        console.error('Error updating profile:', error);
        if (error.response?.status === 422) {
          alert('Erreur de validation: ' + JSON.stringify(error.response.data.errors));
        } else {
          alert('Erreur lors de la mise à jour du profil');
        }
      }
    }
  }
};
</script>

<style scoped>
.edit-profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #4a5568;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-control:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

.form-text {
  color: #718096;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #3182ce;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}
</style> 