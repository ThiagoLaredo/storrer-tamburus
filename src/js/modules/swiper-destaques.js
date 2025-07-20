import { Swiper } from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


export class SwiperDestaques {
  constructor(containerSelector, options = {}) {
    this.options = {
      modules: [Navigation, Pagination, Scrollbar],
      slidesPerView: 3,
      // spaceBetween: 20,
      loop: false, // loop desativado para scrollbar funcionar corretamente
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      },
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