<template>
  <div class="contact-container">
    <!-- Bannière optionnelle -->
    <div class="contact-banner">
      <img src="https://th.bing.com/th/id/OIP.KfnpT7fe7FMfeTmmPKvg5wHaEK?rs=1&pid=ImgDetMain" alt="Bannière de concessionnaire automobile">
    </div>
    <div class="contact-content">
      <h1>Nous Contacter</h1>
      <p class="subtitle">Connectez-vous avec nous pour acheter ou vendre votre voiture en toute simplicité</p>

      <div class="contact-grid">
        <!-- Informations de contact -->
        <div class="contact-info">
          <h2><i class="fas fa-info-circle"></i> Informations</h2>
          <div class="info-item">
            <i class="fas fa-phone-alt"></i>
            <div>
              <h3>Téléphone</h3>
              <p>+213 723-567</p>
              <p>+213 555 987 654</p>
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
              <h3>Adresse</h3>
              <p>123 Rue des Voitures <i class="fas fa-car small-icon"></i></p>
              <p>Ville Automobile, AC 12345</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-clock"></i>
            <div>
              <h3>Horaires</h3>
              <p>Lun-Ven: 9h-18h</p>
              <p>Sam: 10h-16h</p>
            </div>
          </div>
        </div>

        <!-- Réseaux sociaux -->
        <div class="social-media">
          <h2><i class="fas fa-hashtag"></i> Réseaux Sociaux</h2>
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
            <a href="https://tiktok.com" target="_blank" class="social-icon tiktok">
              <i class="fab fa-tiktok"></i>
              <span>TikTok</span>
            </a>
          </div>
        </div>

        <!-- Formulaire de contact -->
        <div class="contact-form">
          <h2><i class="fas fa-paper-plane"></i> Envoyez-nous un Message</h2>
          <transition name="fade">
            <div v-if="showSuccess" class="success-message">
              <i class="fas fa-check-circle"></i> Message envoyé avec succès !
            </div>
          </transition>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Nom</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                required
                placeholder="Votre nom"
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                placeholder="Votre email"
              >
            </div>
            <div class="form-group">
              <label for="subject">Sujet</label>
              <input 
                type="text" 
                id="subject" 
                v-model="form.subject" 
                required
                placeholder="Sujet du message"
              >
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                required
                placeholder="Votre message"
                rows="5"
              ></textarea>
            </div>
            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> Envoi en cours...</span>
              <span v-else><i class="fas fa-paper-plane"></i> Envoyer</span>
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
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation d'appel API
        this.showSuccess = true
        this.form = { name: '', email: '', subject: '', message: '' }
        setTimeout(() => this.showSuccess = false, 3000)
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error)
        alert('Échec de l\'envoi du message. Veuillez réessayer.')
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
  background-color: #f8f9fa;
  position: relative;
}

.contact-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.contact-banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.contact-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

h1 {
  font-size: 2.8rem;
  color: #1a365d;
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #1a365d, #4CAF50);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 3rem;
  font-size: 1.2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.contact-info, .social-media, .contact-form {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-info:hover, .social-media:hover, .contact-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #1a365d;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.info-item:hover {
  background-color: rgba(76, 175, 80, 0.05);
}

.info-item:nth-child(1) { animation-delay: 0.1s; }
.info-item:nth-child(2) { animation-delay: 0.2s; }
.info-item:nth-child(3) { animation-delay: 0.3s; }
.info-item:nth-child(4) { animation-delay: 0.4s; }

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
  font-weight: 600;
}

.info-item p {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
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
  padding: 1.5rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.social-icon i {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.social-icon span {
  font-size: 0.9rem;
  font-weight: 500;
}

.facebook { background-color: #1877f2; }
.twitter { background-color: #1da1f2; }
.instagram { background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d); }
.linkedin { background-color: #0077b5; }
.youtube { background-color: #ff0000; }
.tiktok { background-color: #000000; }

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
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f9fafb;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background-color: white;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}

button:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
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

  .contact-banner {
    height: 200px;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .social-icons {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .social-icons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>