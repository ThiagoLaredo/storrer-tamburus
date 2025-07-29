import { Swiper } from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export class SwiperDestaques {
  constructor(containerSelector = '.swiper-destaques', options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      modules: [Navigation, Pagination, Scrollbar],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
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