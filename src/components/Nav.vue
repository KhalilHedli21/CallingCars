<template>
  <nav class="nav" :class="{ 'nav-mobile': isMobileMenuOpen }">
    <div class="nav-container">
      <div class="nav-logo">
        <router-link to="/">
          <img src="https://static.vecteezy.com/system/resources/previews/013/923/543/original/blue-car-logo-png.png" alt="Logo Vendeur de Voitures" />
        </router-link>
      </div>
      
      <button class="mobile-menu-button" @click="toggleMobileMenu" aria-label="Basculer le menu">
        <span class="hamburger" :class="{ 'is-active': isMobileMenuOpen }"></span>
      </button>

      <ul class="nav-links" :class="{ 'is-active': isMobileMenuOpen }">
        <li><router-link to="/" @click="closeMobileMenu">Accueil</router-link></li>
        
        <!-- Navigation Admin -->
        <template v-if="userType === 'user' && userRole === 'admin'">
          <li><router-link to="/admin/dashboard" @click="closeMobileMenu">Tableau de bord</router-link></li>
          <li><router-link to="/admin/users" @click="closeMobileMenu">Utilisateurs</router-link></li>
          <li><router-link to="/admin/listings" @click="closeMobileMenu">Annonces</router-link></li>
        </template>
        
        <!-- Navigation Client -->
        <template v-if="userType === 'user' && userRole === 'client'">
          <li><router-link to="/sell" @click="closeMobileMenu">Vendre votre voiture</router-link></li>
          <li><router-link to="/profile" @click="closeMobileMenu">Profil</router-link></li>
        </template>
        
        <li><router-link to="/contact" @click="closeMobileMenu">Contact</router-link></li>
        
        <!-- Navigation Invité -->
        <template v-if="userType === 'guest'">
          <li><router-link to="/login" @click="closeMobileMenu">Se connecter</router-link></li>
          <li><router-link to="/signup" @click="closeMobileMenu" class="signup-button">S'inscrire</router-link></li>
        </template>
        
        <!-- Actions Utilisateur Connecté -->
        <template v-if="userType === 'user'">
          <li><a href="#" @click.prevent="handleLogout" class="logout-button">Se déconnecter</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    userType: {
      type: String,
      required: true,
      validator: (value) => ['guest', 'user'].includes(value)
    },
    userRole: {
      type: String,
      default: null,
      validator: (value) => ['admin', 'client', null].includes(value)
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    handleLogout() {
      this.closeMobileMenu()
      this.$emit('logout')
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    }
  },
  mounted() {
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