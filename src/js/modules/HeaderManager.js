export default class HeaderManager {
  constructor(headerSelector, cssVarName = '--header-height') {
    this.header = document.querySelector(headerSelector);
    this.cssVarName = cssVarName;
    this.lastHeight = null;

    if (!this.header) {
      console.warn(`Header não encontrado: ${headerSelector}`);
      return;
    }

    this.init();
  }

  init() {
    this.updateHeight();

    this.resizeObserver = new ResizeObserver(this.debounce(() => {
      this.updateHeight();
    }, 100));
    this.resizeObserver.observe(this.header);

    window.addEventListener('load', () => this.updateHeight());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.updateHeight(), 100);
    });
  }

  updateHeight() {
    const height = this.header.offsetHeight;

    if (height !== this.lastHeight) {
      this.lastHeight = height;
      document.documentElement.style.setProperty(this.cssVarName, `${height}px`);
    }

    return height;
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}