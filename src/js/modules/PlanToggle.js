export default class PlanToggle {
  constructor() {
    this.toggle = document.querySelector('#planToggle');
    this.prices = document.querySelectorAll('.plan-price');
    this.buttons = document.querySelectorAll('.btn-comprar');

    if (this.toggle && this.prices.length > 0) {
      this.init();
    }
  }

  init() {
    this.updatePrices(); // define o estado inicial
    this.toggle.addEventListener('change', () => this.updatePrices());
  }

  updatePrices() {
    const isAnnual = this.toggle.checked;

    // Atualiza os preços
    this.prices.forEach(price => {
      const rawValue = isAnnual
        ? price.getAttribute('data-annual')
        : price.getAttribute('data-monthly');

      const match = rawValue.match(/^(.+?)(\/.+)$/); // divide o preço

      if (match) {
        const [, amount, suffix] = match;
        price.innerHTML = `${amount}<span class="price-suffix">${suffix}</span>`;
      } else {
        price.textContent = rawValue;
      }
    });

    // Atualiza os links dos botões
    this.buttons.forEach(button => {
      const link = isAnnual
        ? button.getAttribute('data-link-annual')
        : button.getAttribute('data-link-monthly');

      button.setAttribute('href', link);
    });
  }
}
