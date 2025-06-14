<template>
  <nav class="nav" :class="{ 'nav-mobile': isMobileMenuOpen }">
    <div class="nav-container">
      <div class="nav-logo">
        <a href="#" @click.prevent="refreshPage">
          <img src="https://static.vecteezy.com/system/resources/previews/013/923/543/original/blue-car-logo-png.png" alt="Logo Vendeur de Voitures" />
        </a>
      </div>
      
      <button class="mobile-menu-button" @click="toggleMobileMenu" aria-label="Basculer le menu">
        <span class="hamburger" :class="{ 'is-active': isMobileMenuOpen }"></span>
      </button>

      <ul class="nav-links" :class="{ 'is-active': isMobileMenuOpen }">
        <!-- Navigation Invité (non-logged-in users) -->
        <template v-if="!isLoggedIn">
          <li><router-link to="/" @click="closeMobileMenu">Accueil</router-link></li>
          <li><router-link to="/contact" @click="closeMobileMenu">Contact</router-link></li>
          <li><router-link to="/login" @click="closeMobileMenu">Se connecter</router-link></li>
          <li><router-link to="/signup" @click="closeMobileMenu" class="signup-button">S'inscrire</router-link></li>
        </template>
        
        <!-- Navigation Admin -->
        <template v-if="isLoggedIn && currentUserRole === 'admin'">
          <li><router-link to="/admin/dashboard" @click="closeMobileMenu">Tableau de bord</router-link></li>
          <li><router-link to="/admin/users" @click="closeMobileMenu">Utilisateurs</router-link></li>
          <li><router-link to="/admin/listings" @click="closeMobileMenu">Annonces</router-link></li>
          <li><router-link to="/admin/orders" @click="closeMobileMenu">Commandes</router-link></li>
          <li><a href="#" @click.prevent="handleLogout" class="logout-button">Se déconnecter</a></li>
        </template>
        
        <!-- Navigation Client -->
        <template v-if="isLoggedIn && currentUserRole === 'user'">
          <li><router-link to="/home" @click="closeMobileMenu">Commander une voiture</router-link></li>
          <li><router-link to="/profile" @click="closeMobileMenu">Profil</router-link></li>
          <li><a href="#" @click.prevent="handleLogout" class="logout-button">Se déconnecter</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'
export default {
  name: 'NavBar',
  data() {
    return {
      isMobileMenuOpen: false,
      currentUser: null
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.currentUser && !!localStorage.getItem('token')
    },
    currentUserRole() {
      return this.currentUser?.role || null
    }
  },
  methods: {
    refreshPage() {
      window.location.reload();
    },
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          this.currentUser = JSON.parse(userData)
          if (!axios.defaults.headers.common['Authorization']) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
          this.clearUserData()
        }
      } else {
        this.currentUser = null
      }
    },
    clearUserData() {
      this.currentUser = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },
    async handleLogout() {
      this.closeMobileMenu()
      try {
        await axios.post('/api/logout')
        this.clearUserData()
        this.$router.push('/login')
        this.$emit('logout-success')
      } catch (error) {
        console.error('Logout error:', error)
        this.clearUserData()
        this.$router.push('/login')
        this.$emit('logout-success')
      }
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    }
  },
  mounted() {
    this.checkLoginStatus()
    document.addEventListener('click', (e) => {
      const target = e.target
      if (!target.closest('.nav') && this.isMobileMenuOpen) {
        this.closeMobileMenu()
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMobileMenu)
  }
}
</script>

<style scoped>
.nav {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  color: #1e293b;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.nav-logo img {
  height: 48px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav-logo img:hover {
  transform: scale(1.08);
  opacity: 0.9;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #1e293b;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  background: #e2e8f0;
  color: #2563eb;
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background: #2563eb;
  transition: width 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

.signup-button {
  background: #2563eb;
  color: #ffffff !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.signup-button:hover {
  background: #1d4ed8 !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.logout-button {
  color: #dc2626 !important;
}

.logout-button:hover {
  background: #fef2f2 !important;
  color: #dc2626 !important;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  display: block;
  width: 28px;
  height: 3px;
  background: #1e293b;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 28px;
  height: 3px;
  background: #1e293b;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger::before {
  top: -9px;
}

.hamburger::after {
  bottom: -9px;
}

.hamburger.is-active {
  background: transparent;
}

.hamburger.is-active::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.is-active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

@media (max-width: 768px) {
  .mobile-menu-button {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.25rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-in-out;
  }

  .nav-links.is-active {
    display: flex;
  }

  .nav-links a {
    padding: 1rem;
    text-align: center;
    font-size: 1.1rem;
    border-radius: 6px;
  }

  .nav-links a:hover {
    background: #f1f5f9;
    color: #2563eb;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>