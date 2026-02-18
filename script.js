const mobileNav = document.querySelector(".hamburger");
const navbar = document.querySelector(".menubar");

/* Responsive Navbar */ 
const toggleNav = () => {
  navbar.classList.toggle("active");
  mobileNav.classList.toggle("hamburger-active");
};
mobileNav.addEventListener("click", () => toggleNav());

/* Language Switcher */
let currentLang = 'fr';

const toggleLanguage = () => {
  const elements = document.querySelectorAll('[data-fr][data-en]');
  const langToggle = document.getElementById('lang-toggle');
  const langToggleMobile = document.getElementById('lang-toggle-mobile');
  
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  
  elements.forEach(element => {
    const text = currentLang === 'fr' ? element.getAttribute('data-fr') : element.getAttribute('data-en');
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = text;
    } else {
      element.textContent = text;
    }
  });
  
  // Update button text
  if (langToggle) langToggle.textContent = currentLang === 'fr' ? 'EN' : 'FR';
  if (langToggleMobile) langToggleMobile.textContent = currentLang === 'fr' ? 'EN' : 'FR';
  
  // Save preference
  localStorage.setItem('preferred-language', currentLang);
};

// Initialize language from localStorage or default to French
const savedLang = localStorage.getItem('preferred-language') || 'fr';
if (savedLang !== 'fr') {
  toggleLanguage();
}

// Add event listeners
const langToggle = document.getElementById('lang-toggle');
const langToggleMobile = document.getElementById('lang-toggle-mobile');

if (langToggle) langToggle.addEventListener('click', toggleLanguage);
if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);

/* Netlify Form Handling */
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form[data-netlify="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = currentLang === 'fr' ? 'Envoi...' : 'Sending...';
      submitButton.disabled = true;
      
      // Create form data
      const formData = new FormData(form);
      
      // Check if we're on Netlify or localhost
      const isNetlify = window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'localhost';
      
      if (isNetlify) {
        // Submit to Netlify
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        })
        .then(response => {
          if (response.ok) {
            showSuccess();
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(error => {
          showError();
        })
        .finally(() => {
          resetButton();
        });
      } else {
        // Local development - simulate success
        console.log('Local development - form submission simulated');
        showSuccess();
        resetButton();
      }
      
      function showSuccess() {
        const successMessage = currentLang === 'fr' 
          ? 'Merci pour votre message! Nous vous contacterons bientôt.' 
          : 'Thank you for your message! We will contact you soon.';
        
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #4CAF50;
          color: white;
          padding: 15px 20px;
          border-radius: 5px;
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        alertDiv.textContent = successMessage;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
          alertDiv.remove();
        }, 5000);
        
        form.reset();
      }
      
      function showError() {
        const errorMessage = currentLang === 'fr' 
          ? 'Erreur lors de l\'envoi. Veuillez réessayer.' 
          : 'Error sending message. Please try again.';
        
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #f44336;
          color: white;
          padding: 15px 20px;
          border-radius: 5px;
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        alertDiv.textContent = errorMessage;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
          alertDiv.remove();
        }, 5000);
      }
      
      function resetButton() {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    });
  });
});
