import { Swiper } from 'swiper';
import { Autoplay, FreeMode, Scrollbar } from 'swiper/modules'; // Removi o Touch
import 'swiper/css';
import 'swiper/css/scrollbar';

export class SwiperGallery {
  constructor(containerSelector = '.swiper-galeria', options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      modules: [Autoplay, FreeMode, Scrollbar], // Removi o Touch
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 1000,
        disableOnInteraction: false,
      },
      speed: 800,
      freeMode: true,
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      watchSlidesProgress: true,
      // Configurações de toque (opcional)
      touchEventsTarget: 'container', // Garante que o toque funcione no container
      grabCursor: true, // Muda o cursor para "mão" quando arrastável
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