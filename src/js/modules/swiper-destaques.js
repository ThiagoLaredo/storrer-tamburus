import { Swiper } from 'swiper';
import 'swiper/css';

export class SwiperDestaques {
  constructor(containerSelector = '.swiper-destaques', options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
  
      ...options
    };
  }

  init() {
    if (!this.container) {
      console.error('Container do Swiper não encontrado:', this.container);
      return;
    }

    this.swiper = new Swiper(this.container, this.options);
    return this.swiper;
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}