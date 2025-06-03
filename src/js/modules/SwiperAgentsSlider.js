import Swiper from 'swiper';
import { Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/scrollbar';

export default class SwiperAgentsSlider {
  constructor() {
    this.init();
  }

  init() {
    const swiperEl = document.querySelector('.agents-swiper');
    if (!swiperEl) return;

    new Swiper(swiperEl, {
      modules: [Scrollbar],
      slidesPerView: 6.5,
      spaceBetween: 10,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true
      },
      breakpoints: {
        0: { slidesPerView: 1.5 },
        576: { slidesPerView: 4.5 },
        768: { slidesPerView: 4.5 },
        1024: { slidesPerView: 6.5 }
      }
    });
  }
}
