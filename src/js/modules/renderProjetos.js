// src/js/modules/renderProjetos.js
import { SwiperGallery } from './swiper-gallery.js';
import { gsap } from 'gsap';
import { buildResponsiveImage } from './imageUtils.js';
import { animateFirstSlide, animateSlideChange } from "../modules/slideAnimations.js";

export function renderGaleria(container, projetos, options = {}) {
  if (!container) return;

  const { isDestaque = false } = options; // Detecta se é destaque/projetoRenderer

  container.innerHTML = '';

  if (!projetos || projetos.length === 0) {
    container.innerHTML = '<p class="sem-projetos">Nenhum projeto encontrado</p>';
    return;
  }

  container.innerHTML = `
    <div class="${isDestaque ? 'destaque-wrapper' : 'swiper'}">
      <div class="${isDestaque ? 'destaque-container' : 'swiper-wrapper'}">
        ${projetos.map((projeto, index) => `
          <div class="${isDestaque ? 'destaque-slide' : 'swiper-slide'}">
            <div class="projeto-slide">
              ${projeto.capa
                ? buildResponsiveImage(projeto.capa, projeto.title, { 
                    isLCP: index === 0,
                    className: 'projeto-imagem'
                  })
                : '<div class="projeto-imagem placeholder"></div>'
              }
              <div class="overlay"></div>

              <div class="container">
                <a href="/projetos/${projeto.slug}" class="projeto-link">
                  <h3 class="projetos-titulo" data-slide-index="${index}">${projeto.title}</h3>
                  <span class="projeto-plus">
                    <i class="fa-solid fa-chevron-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ${!isDestaque ? '<div class="swiper-pagination"></div>' : ''}
    </div>
  `;

  // Só inicializa Swiper se não for destaque
  if (!isDestaque) {
    const swiper = new SwiperGallery('.swiper', {
      pagination: { el: '.swiper-pagination', clickable: true },
      on: {
        init() {
          const firstSlide = this.el.querySelector('.swiper-slide-active');
          animateFirstSlide(firstSlide);
        },
        slideChangeTransitionStart() {
          const activeSlide = this.el.querySelector('.swiper-slide-active');
          if (!activeSlide) return;
          const title = activeSlide.querySelector('.projetos-titulo');
          const plusIcon = activeSlide.querySelector('.projeto-plus');
          if (title && plusIcon) {
            gsap.to([title, plusIcon], {
              y: 20,
              opacity: 0,
              duration: 0.3,
              ease: 'power1.in',
            });
          }
        },
        slideChangeTransitionEnd() {
          const activeSlide = this.el.querySelector('.swiper-slide-active');
          animateSlideChange(activeSlide);
        }
      }
    });
    
    swiper.init();
  } else {
    // Para Destaques/ProjetoRenderer: anima o primeiro slide apenas
    const firstSlide = container.querySelector('.destaque-slide');
    animateFirstSlide(firstSlide);
  }
}
