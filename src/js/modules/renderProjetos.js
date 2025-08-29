import { SwiperGallery } from './swiper-gallery.js';
import { gsap } from 'gsap';

export function renderGaleria(container, projetos) {
  if (!container) return;

  // Limpa o container
  container.innerHTML = '';

  if (!projetos || projetos.length === 0) { 
    container.innerHTML = '<p class="sem-projetos">Nenhum projeto encontrado</p>';
    return;
  }

  // Cria a estrutura do Swiper
  container.innerHTML = `
    <div class="swiper">
      <div class="swiper-wrapper">
        ${projetos.map((projeto, index) => `
          <div class="swiper-slide">
            <div class="projeto-slide">
                ${projeto.capa ? `
                  <img 
                    src="${projeto.capa}?w=1920&h=1080&fit=fill" 
                    alt="${projeto.title}" 
                    class="projeto-imagem"
                    loading="lazy">
                ` : `
                  <div class="projeto-imagem placeholder"></div>
                `}
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
      <!-- Bullets -->
      <div class="swiper-pagination"></div>
    </div>
  `;

  // Inicializa o Swiper com callbacks para animação
 // Inicializa o Swiper com callbacks para animação
 const swiperOptions = {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  on: {
    init: function() {
      animateTitleOnSlideChange(this.activeIndex);
    },
    slideChangeTransitionStart: function() {
      // Pré-animação: esconde o título e ícone atuais
      const currentTitle = document.querySelector('.swiper-slide-active .projetos-titulo');
      const currentIcon = document.querySelector('.swiper-slide-active .projeto-plus');
      
      if (currentTitle && currentIcon) {
        gsap.to([currentTitle, currentIcon], {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: 'power1.in'
        });
      }
    },
    slideChangeTransitionEnd: function() {
      // Animação do novo título e ícone
      animateTitleOnSlideChange(this.activeIndex);
    }
  }
};

const swiper = new SwiperGallery('.swiper', swiperOptions);
swiper.init();
}
// Função para animar tanto o título quanto o ícone
function animateTitleOnSlideChange(slideIndex) {
  const activeSlide = document.querySelector('.swiper-slide-active');
  if (!activeSlide) return;
  
  const title = activeSlide.querySelector('.projetos-titulo');
  const plusIcon = activeSlide.querySelector('.projeto-plus');

  if (!title || !plusIcon) return;

  // Configuração inicial
  gsap.set([title, plusIcon], {
    y: -15,
    opacity: 0,
  });

  // Timeline com animação rápida e sincronizada
  const tl = gsap.timeline();

  // Animação principal quase simultânea
  tl.to(title, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, 0)
  .to(plusIcon, {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out',
    // Não controla a propriedade transform completamente
    // para permitir que o hover funcione
    onComplete: function() {
      // Remove qualquer controle do GSAP sobre a propriedade transform
      // exceto para a posição Y que já foi animada
      gsap.set(plusIcon, {clearProps: "transform"});
    }
  }, 0.05);

  return tl;
}