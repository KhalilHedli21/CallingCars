<template>
  <div class="app" role="application">
    <!-- Navigation Bar -->
    <Nav 
      :user-type="userType" 
      @logout="handleLogout" 
      aria-label="Main navigation"
    />

    <!-- Loading Overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay" role="status" aria-live="polite">
        <div class="spinner" aria-label="Loading content"></div>
      </div>
    </transition>

    <!-- Main Content -->
    <main role="main">
      <transition name="slide-fade" mode="out-in">
        <router-view
          :key="$route.fullPath"
          :user-type="userType"
          @login="handleLogin"
          @signup="handleSignup"
          @show-signup="showSignup"
          @explore="exploreAsGuest"
          @error="handleError"
        />
      </transition>
    </main>

    <!-- Error Notification -->
    <transition name="fade">
      <div v-if="errorMessage" class="error-notification" role="alert" aria-live="assertive">
        {{ errorMessage }}
        <button @click="clearError" class="error-close" aria-label="Close error message">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition>

    <!-- Footer -->
    <Footer aria-label="Footer navigation" />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Nav from './components/Nav.vue';
import Footer from './components/Footer.vue';
import Contact from './components/Contact.vue'; // Import Contact.vue

export default {
  components: {
    Nav,
    Footer,
    Contact, // Register Contact
  },
  setup() {
    // State
    const userType = ref('guest');
    const isLoading = ref(false);
    const errorMessage = ref(null);
    const router = useRouter();

    // Methods
    const handleLogin = async (credentials) => {
      try {
        isLoading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        userType.value = 'user';
        router.push('/home');
      } catch (error) {
        handleError('Login failed. Please try again.');
      } finally {
        isLoading.value = false;
      }
    };

    const handleSignup = async (userData) => {
      try {
        isLoading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        userType.value = 'user';
        router.push('/home');
      } catch (error) {
        handleError('Signup failed. Please try again.');
      } finally {
        isLoading.value = false;
      }
    };

    const handleLogout = () => {
      userType.value = 'guest';
      router.push('/');
    };

    const showSignup = () => {
      router.push('/signup');
    };

    const exploreAsGuest = () => {
      router.push('/home');
    };

    const handleError = (message) => {
      errorMessage.value = message;
      setTimeout(() => (errorMessage.value = null), 5000);
    };

    const clearError = () => {
      errorMessage.value = null;
    };

    // Watch route changes to simulate loading
    router.beforeEach((to, from, next) => {
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
        next();
      }, 500);
    });

    return {
      userType,
      isLoading,
      errorMessage,
      handleLogin,
      handleSignup,
      handleLogout,
      showSignup,
      exploreAsGuest,
      handleError,
      clearError,
    };
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
}

main {
  flex: 1;
  position: relative;
  padding: 2rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #4CAF50;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #e53e3e;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10000;
}

.error-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

@media (max-width: 768px) {
  main {
    padding: 1rem;
  }

  .error-notification {
    top: 10px;
    right: 10px;
    left: 10px;
  }
}
</style>
