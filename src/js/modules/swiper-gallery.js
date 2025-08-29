import { Swiper } from 'swiper';
import { Autoplay, Pagination, Mousewheel, Keyboard} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export class SwiperGallery {
  constructor(containerSelector = '.js-swiper-gallery', options = {}) {
    this.selector = containerSelector;
    this.container = document.querySelector(containerSelector);

    this.defaultOptions = {
      modules: [Autoplay, Pagination, Mousewheel, Keyboard],
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      speed: 700,
      effect: 'fade', // Habilita o efeito de fade
      fadeEffect: {
        crossFade: true // Faz um crossfade suave entre os slides
      },
      speed: 1000, // Controla a duração da transição (em ms)

      // 🖱️ Scroll do mouse
      mousewheel: {
        enabled: true,
        forceToAxis: true,      // só responde no eixo vertical
        releaseOnEdges: false,  // se quiser liberar o scroll da página no início/fim: true + loop:false
        sensitivity: 1.2,       // aumente se estiver “pesado”
        thresholdDelta: 5       // evita pular slides com trackpad muito sensível
      },

      // ⌨️ Setas do teclado (opcional)
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },

      // 🔘 Bullets
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },

      grabCursor: true
    };

    this.options = { ...this.defaultOptions, ...options };
    
  }

  init() {
    if (!this.container) {
      console.warn(`Swiper container not found: ${this.selector}`);
      return null;
    }
    try {
      this.swiper = new Swiper(this.container, this.options);
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

  handleResize() {
    if (this.swiper) this.swiper.update();
  }

  
}
