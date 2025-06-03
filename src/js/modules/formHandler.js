export default class FormHandler {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.feedbackElement = document.createElement('div');
    this.feedbackElement.className = 'form-feedback';
    this.form.parentNode.insertBefore(this.feedbackElement, this.form.nextSibling);
    this.init();
  }

  init() {
    // Removemos o listener do modal
    // Mantemos apenas o listener do formulário
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.clearFeedback();

    if (this.validateForm()) {
      try {
        // Simulação de envio (substitua por fetch/axios real)
        await this.sendFormData();
        this.showFeedback('success', 'Formulário enviado com sucesso!');
        this.form.reset();
      } catch (error) {
        this.showFeedback('error', 'Erro ao enviar formulário. Tente novamente.');
      }
    }
  }

  async sendFormData() {
    // Simula delay de rede
    return new Promise(resolve => setTimeout(resolve, 1000));
    
    // Implementação real seria algo como:
    // const formData = new FormData(this.form);
    // return fetch('sua-url', { method: 'POST', body: formData });
  }

  validateForm() {
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('[required]');
  
    // RegEx para validação
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const celularRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.showError(field.id, 'Este campo é obrigatório');
        isValid = false;
      } else {
        this.clearError(field.id);
      }
    });

    // Validação de e-mail
    const emailField = this.form.querySelector('#email');
    if (emailField && !emailRegex.test(emailField.value.trim())) {
      this.showError('email', 'E-mail inválido.');
      isValid = false;
    } else {
      this.clearError('email');
    }

    // Validação de celular
    const celularField = this.form.querySelector('#celular');
    if (celularField && !celularRegex.test(celularField.value.trim())) {
      this.showError('celular', 'Celular inválido. Ex: (11) 91234-5678');
      isValid = false;
    } else {
      this.clearError('celular');
    }

    if (!document.getElementById('termos').checked) {
      this.showError('termos', 'Você deve aceitar os termos');
      isValid = false;
    }

    return isValid;
  }

  showError(fieldId, message) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    if (errorElement) errorElement.textContent = message;
  }

  clearError(fieldId) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    if (errorElement) errorElement.textContent = '';
  }

  showFeedback(type, message) {
    this.feedbackElement.innerHTML = '';
    
    if (type === 'success') {
      this.feedbackElement.innerHTML = `
        <svg viewBox="0 0 24 24" width="64" height="64" class="success-icon">
          <path fill="var(--primary)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <h3 style="color: var(--primary); margin: 15px 0 10px;">Inscrição confirmada!</h3>
        <p style="font-size: 1.1rem; max-width: 80%; margin: 0 auto;">Agora você receberá nossas melhores novidades e conteúdos exclusivos diretamente no seu e-mail.</p>
        <p style="font-style: italic; margin-top: 15px;">Obrigado por se juntar à nossa comunidade!</p>
      `;
    } else {
      this.feedbackElement.innerHTML = `
        <svg viewBox="0 0 24 24" width="64" height="64" class="error-icon">
          <path fill="#e74c3c" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h3 style="color: #e74c3c; margin: 15px 0 10px;">Ocorreu um erro</h3>
        <p style="font-size: 1.1rem;">${message}</p>
      `;
    }
    
    this.feedbackElement.className = `form-feedback ${type}`;
    this.feedbackElement.style.display = 'flex';
    this.feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (type === 'success') {
      this.autoCloseTimeout = setTimeout(() => {
        this.clearFeedback();
      }, 8000);
    }
  } 

  clearFeedback() {
    this.feedbackElement.classList.add('hiding');
    setTimeout(() => {
      this.feedbackElement.style.display = 'none';
      this.feedbackElement.classList.remove('hiding');
    }, 500);
  }
}