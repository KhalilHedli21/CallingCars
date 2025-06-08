<template>
  <div class="contact-container">
    <!-- Optional Banner Image -->
    <div class="contact-banner">
      <img src="https://images.unsplash.com/photo-1581091226825-5a89e6d0e488" alt="Car Showroom Banner">
    </div>
    <div class="contact-content">
      <h1>Contact Us</h1>
      <p class="subtitle">Connect with us to buy or sell your car with ease</p>

      <div class="contact-grid">
        <!-- Contact Information -->
        <div class="contact-info">
          <h2>Contact Information</h2>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>+1 (555) 987-6543</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>support@carseller.com</p>
              <p>info@carseller.com</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h3>Address</h3>
              <p>123 Car Street <i class="fas fa-car small-icon"></i></p>
              <p>Automotive City, AC 12345</p>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="social-media">
          <h2>Follow Us</h2>
          <div class="social-icons">
            <a href="https://facebook.com" target="_blank" class="social-icon facebook">
              <i class="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </a>
            <a href="https://twitter.com" target="_blank" class="social-icon twitter">
              <i class="fab fa-twitter"></i>
              <span>Twitter</span>
            </a>
            <a href="https://instagram.com" target="_blank" class="social-icon instagram">
              <i class="fab fa-instagram"></i>
              <span>Instagram</span>
            </a>
            <a href="https://linkedin.com" target="_blank" class="social-icon linkedin">
              <i class="fab fa-linkedin-in"></i>
              <span>LinkedIn</span>
            </a>
            <a href="https://youtube.com" target="_blank" class="social-icon youtube">
              <i class="fab fa-youtube"></i>
              <span>YouTube</span>
            </a>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form">
          <h2>Send us a Message</h2>
          <transition name="fade">
            <div v-if="showSuccess" class="success-message">
              <i class="fas fa-check-circle"></i> Message sent successfully!
            </div>
          </transition>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                required
                placeholder="Your name"
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                placeholder="Your email"
              >
            </div>
            <div class="form-group">
              <label for="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                v-model="form.subject" 
                required
                placeholder="Message subject"
              >
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                required
                placeholder="Your message"
                rows="5"
              ></textarea>
            </div>
            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i></span>
              <span v-else>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isLoading: false,
      showSuccess: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.isLoading = true
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
        this.showSuccess = true
        this.form = { name: '', email: '', subject: '', message: '' }
        setTimeout(() => this.showSuccess = false, 3000)
      } catch (error) {
        console.error('Error sending message:', error)
        alert('Failed to send message. Please try again.')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.contact-container {
  min-height: 100vh;
  padding: 4rem 2rem;
  background-image: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70');
  background-size: cover;
  background-position: center;
  position: relative;
}

.contact-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(248, 249, 250, 0.8);
  z-index: 1;
}

.contact-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.contact-banner {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.contact-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  font-size: 2.5rem;
  color: #1a365d;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 3rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.contact-info, .social-media, .contact-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #1a365d;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.info-item:nth-child(1) { animation-delay: 0.1s; }
.info-item:nth-child(2) { animation-delay: 0.2s; }
.info-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-item i {
  font-size: 1.5rem;
  color: #4CAF50;
  margin-right: 1rem;
  margin-top: 0.25rem;
  transition: transform 0.3s ease;
}

.info-item i:hover {
  transform: scale(1.1);
}

.small-icon {
  font-size: 1rem;
  margin-left: 0.5rem;
}

.info-item h3 {
  color: #4b5563;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.info-item p {
  color: #6b7280;
  margin: 0;
}

.social-icons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.social-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.social-icon i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.social-icon span {
  font-size: 0.875rem;
}

.facebook { background-color: #1877f2; }
.twitter { background-color: #1da1f2; }
.instagram { background-color: #e4405f; }
.linkedin { background-color: #0077b5; }
.youtube { background-color: #ff0000; }

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

button {
  width: 100%;
  padding: 0.875rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .contact-container {
    padding: 2rem 1rem;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .social-icons {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-banner {
    height: 150px;
  }
}
</style>
