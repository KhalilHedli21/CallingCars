<template>
  <div class="signup-container">
    <div class="signup-form">
      <h2>Créer un compte</h2>
      <p class="subtitle">Rejoignez notre communauté de passionnés de voitures</p>
      
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="signup-name">Nom complet</label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="signup-name" 
              v-model="name" 
              :class="{ 'error': errors.name }"
              @blur="validateName"
              required
              autocomplete="name"
            >
          </div>
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="signup-email">Email</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input 
              type="email" 
              id="signup-email" 
              v-model="email" 
              :class="{ 'error': errors.email }"
              @blur="validateEmail"
              required
              autocomplete="email"
            >
          </div>
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="signup-password">Mot de passe</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="signup-password" 
              v-model="password" 
              :class="{ 'error': errors.password }"
              @blur="validatePassword"
              required
              autocomplete="new-password"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="togglePassword"
              tabindex="-1"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="signup-confirm-password">Confirmer le mot de passe</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="signup-confirm-password" 
              v-model="confirmPassword" 
              :class="{ 'error': errors.confirmPassword }"
              @blur="validateConfirmPassword"
              required
              autocomplete="new-password"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="toggleConfirmPassword"
              tabindex="-1"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="agreeToTerms"
              :class="{ 'error': errors.terms }"
            >
            <span>J'accepte les <a href="#" @click.prevent="showTerms">Conditions d'utilisation</a> et la <a href="#" @click.prevent="showPrivacy">Politique de confidentialité</a></span>
          </label>
          <span class="error-message" v-if="errors.terms">{{ errors.terms }}</span>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading || !isFormValid"
          class="submit-button"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>Créer un compte</span>
        </button>

        <span class="error-message" v-if="errors.submit">{{ errors.submit }}</span>

        <div class="social-signup">
          <p>Ou inscrivez-vous avec</p>
          <div class="social-buttons">
            <button type="button" class="social-button google" @click="handleSocialSignup('google')">
              <i class="fab fa-google"></i>
              Google
            </button>
            <button type="button" class="social-button facebook" @click="handleSocialSignup('facebook')">
              <i class="fab fa-facebook-f"></i>
              Facebook
            </button>
          </div>
        </div>

        <p class="switch-form">
          Vous avez déjà un compte ? 
          <router-link to="/login" class="signin-link">Se connecter</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default defineComponent({
  name: 'SignupForm',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      errors: {} as FormErrors
    }
  },
  computed: {
    isFormValid(): boolean {
      return !Object.keys(this.errors).length && 
             this.name.length > 0 && 
             this.email.length > 0 && 
             this.password.length > 0 && 
             this.confirmPassword.length > 0 &&
             this.agreeToTerms
    }
  },
  methods: {
    validateName() {
      if (!this.name) {
        this.errors.name = 'Le nom est requis'
      } else if (this.name.length < 2) {
        this.errors.name = 'Le nom doit comporter au moins 2 caractères'
      } else {
        delete this.errors.name
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email) {
        this.errors.email = 'L\'email est requis'
      } else if (!emailRegex.test(this.email)) {
        this.errors.email = 'Veuillez entrer une adresse email valide'
      } else {
        delete this.errors.email
      }
    },
    validatePassword() {
      if (!this.password) {
        this.errors.password = 'Le mot de passe est requis'
      } else if (this.password.length < 8) {
        this.errors.password = 'Le mot de passe doit comporter au moins 8 caractères'
      } else if (!/[A-Z]/.test(this.password)) {
        this.errors.password = 'Le mot de passe doit contenir au moins une lettre majuscule'
      } else if (!/[a-z]/.test(this.password)) {
        this.errors.password = 'Le mot de passe doit contenir au moins une lettre minuscule'
      } else if (!/[0-9]/.test(this.password)) {
        this.errors.password = 'Le mot de passe doit contenir au moins un chiffre'
      } else {
        delete this.errors.password
      }
      this.validateConfirmPassword()
    },
    validateConfirmPassword() {
      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Veuillez confirmer votre mot de passe'
      } else if (this.confirmPassword !== this.password) {
        this.errors.confirmPassword = 'Les mots de passe ne correspondent pas'
      } else {
        delete this.errors.confirmPassword
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    async handleSubmit() {
      this.validateName()
      this.validateEmail()
      this.validatePassword()
      this.validateConfirmPassword()
      
      if (!this.agreeToTerms) {
        this.errors.terms = 'Vous devez accepter les conditions d\'utilisation'
      } else {
        delete this.errors.terms
      }
      
      if (!this.isFormValid) return
      
      try {
        this.isLoading = true
        delete this.errors.submit

        console.log('Sending registration request to:', axios.defaults.baseURL + '/register')
        const response = await axios.post('/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.confirmPassword
        }, {
          withCredentials: true
        })

        console.log('Registration successful:', response.data)
        
        // Show success message or emit success event
        this.$emit('signup-success', {
          message: 'Compte créé avec succès! Veuillez vous connecter.',
          user: response.data.data?.user
        })

        // Navigate to login page
        this.$router.push({
          path: '/login',
          query: { 
            message: 'Compte créé avec succès! Veuillez vous connecter.',
            email: this.email
          }
        })
        
      } catch (error) {
        console.error('Erreur d\'inscription:', error)
        if (error.response) {
          console.log('Error response:', error.response)
          if (error.response.status === 422) {
            // Validation errors
            const validationErrors = error.response.data.errors
            if (validationErrors) {
              if (validationErrors.email) {
                this.errors.email = validationErrors.email[0]
              }
              if (validationErrors.password) {
                this.errors.password = validationErrors.password[0]
              }
              if (validationErrors.name) {
                this.errors.name = validationErrors.name[0]
              }
            }
            this.errors.submit = error.response.data.message || 'Erreur de validation. Veuillez vérifier vos informations.'
          } else if (error.response.status === 409) {
            this.errors.submit = 'Un compte avec cette adresse email existe déjà.'
          } else {
            this.errors.submit = error.response.data.message || 'Échec de l\'inscription. Veuillez réessayer.'
          }
        } else {
          this.errors.submit = 'Erreur réseau. Veuillez vérifier votre connexion.'
        }
      } finally {
        this.isLoading = false
      }
    },
    handleSocialSignup(provider: 'google' | 'facebook') {
      console.log(`Inscription sociale avec ${provider}`)
    },
    showTerms() {
      console.log('Afficher les conditions')
    },
    showPrivacy() {
      console.log('Afficher la politique de confidentialité')
    }
  }
})
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
}

.signup-form {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-form h2 {
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.input-wrapper input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.25rem;
}

.checkbox-label a {
  color: #4CAF50;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.submit-button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.social-signup {
  margin-top: 2rem;
  text-align: center;
}

.social-signup p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  position: relative;
}

.social-signup p::before,
.social-signup p::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: #e5e7eb;
}

.social-signup p::before {
  left: 0;
}

.social-signup p::after {
  right: 0;
}

.social-buttons {
  display: flex;
  gap: 1rem;
}

.social-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.social-button:hover {
  background-color: #f9fafb;
}

.social-button i {
  font-size: 1.25rem;
}

.social-button.google i {
  color: #ea4335;
}

.social-button.facebook i {
  color: #1877f2;
}

.switch-form {
  text-align: center;
  margin-top: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.signin-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.signin-link:hover {
  text-decoration: underline;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .signup-form {
    padding: 1.5rem;
  }

  .social-buttons {
    flex-direction: column;
  }
}
</style>