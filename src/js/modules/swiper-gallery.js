import { Swiper } from 'swiper';
import { Autoplay, FreeMode, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

export class SwiperGallery {
  constructor(containerSelector = '.js-swiper-gallery', options = {}) {
    this.container = document.querySelector(containerSelector);
    this.defaultOptions = {
      modules: [Autoplay, FreeMode, Scrollbar, A11y],
      slidesPerView: 1.2, // Default mobile com peek
      spaceBetween: 16,
      loop: true,
      autoplay: {
        delay: 3000, // Mais tempo para mobile
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      speed: 600, // Mais suave para mobile
      freeMode: {
        enabled: true,
        momentum: true,
        sticky: true
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        dragSize: 'auto',
        hide: false
      },
      watchSlidesProgress: true,
      touchEventsTarget: 'container',
      grabCursor: true,
      a11y: {
        enabled: true,
        prevSlideMessage: 'Slide anterior',
        nextSlideMessage: 'Próximo slide',
        scrollbarDragMessage: 'Arraste para navegar'
      },
      breakpoints: {
        480: {
          slidesPerView: 1.5,
          spaceBetween: 16
        },
        640: {
          slidesPerView: 2.2,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 'auto',
          spaceBetween: 24,
          freeMode: {
            enabled: false // Desativa free mode em desktop
          }
        }
      }
    };
    this.options = { ...this.defaultOptions, ...options };
  }

  init() {
    if (!this.container) {
      console.warn(`Swiper container not found: ${this.containerSelector}`);
      return null;
    }

    try {
      // Verifica se é mobile e ajusta configurações
      if (window.innerWidth < 768) {
        this.options.autoplay.delay = 4000; // Mais tempo em mobile
        this.options.speed = 500; // Mais lento para melhor percepção
      }

      this.swiper = new Swiper(this.container, this.options);
      
      // Adiciona classe para estilização específica
      this.container.classList.add('swiper-initialized');
      
      return this.swiper;
    } catch (error) {
      console.error('Swiper initialization error:', error);
      return null;
    }
  }

  destroy() {
    if (this.swiper) {
      try {
        this.swiper.destroy(true, true);
        if (this.container) {
          this.container.classList.remove('swiper-initialized');
        }
        this.swiper = null;
      } catch (error) {
        console.error('Swiper destruction error:', error);
      }
    }
  }

  // Método para atualizar quando a janela é redimensionada
  handleResize() {
    if (this.swiper) {
      this.swiper.update();
    }
  }
}