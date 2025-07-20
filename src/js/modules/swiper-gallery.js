import { Swiper } from 'swiper';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

export class SwiperGallery {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      modules: [Autoplay, FreeMode], // Removido Loop dos módulos
      slidesPerView: 'auto',
      spaceBetween: 20,
      // loop: true,
      // autoplay: {
      //   delay: 1000,
      //   disableOnInteraction: false,
      // },
      speed: 800,
      freeMode: true,
      watchSlidesProgress: true,
      ...options
    };
  }

  init() {
    if (!this.container) return;

    this.swiper = new Swiper(this.container, this.options);
    return this.swiper;
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}