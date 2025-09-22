// src/js/modules/projetoRenderer.js
import { SwiperGallery } from './swiper-gallery.js';
import { buildResponsiveImage } from './imageUtils.js';
import { animateFirstSlide, animateSlideChange } from './slideAnimations.js';

export class ProjetoRenderer {
  constructor() {}

  async renderProjeto(projeto, data) {
    const { titulo, galeriaDeImagens = [], tipoDoProjeto } = projeto.fields;

    // Salva o tipo do projeto no localStorage para filtro
    if (tipoDoProjeto) {
      const tipo = data.includes?.Entry?.find(entry =>
        entry.sys.id === tipoDoProjeto.sys.id
      );
      if (tipo && tipo.fields) {
        localStorage.setItem('lastFilter', tipo.fields.slug);
      }
    }

    // Atualiza apenas o título
    const tituloElement = document.querySelector('#projeto-titulo');
    const textoElement = tituloElement.querySelector('.texto');
    if (textoElement) {
      textoElement.textContent = titulo;
    } else {
      tituloElement.innerHTML = `<span class="barra"></span><span class="texto">${titulo}</span>`;
    }

    // Renderiza galeria otimizada usando buildResponsiveImage
    const container = document.querySelector('#projeto-imagens');
    if (!container) {
      console.warn('#projeto-imagens não encontrado no DOM');
      return;
    }

    if (galeriaDeImagens.length === 0) {
      container.innerHTML = '<p>Nenhuma imagem disponível.</p>';
    } else {
      container.innerHTML = `
        <div class="swiper js-swiper-gallery">
          <div class="swiper-wrapper">
            ${galeriaDeImagens.map((imgRef, index) => {
              const asset = data.includes?.Asset?.find(a => a.sys.id === imgRef.sys.id);
              if (!asset) {
                console.warn('Asset não encontrado para referência:', imgRef);
                return '';
              }

              const url = `https:${asset.fields.file.url}`;
              const alt = asset.fields.title || asset.fields.description || titulo;

              return `
                <div class="swiper-slide">
                  <div class="projeto-slide">
                    ${buildResponsiveImage(url, alt, { isLCP: index === 0, className: 'projeto-imagem' })}
                    <div class="overlay"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="swiper-pagination"></div>
        </div>
      `;
    }

    // Inicializa Swiper e animações
    this.initSwiper();
    return true;
  }

  initSwiper() {
    const swiperOptions = {
      direction: 'vertical',
      mousewheel: {
        enabled: true,
        forceToAxis: true,
        sensitivity: 1.2,
        thresholdDelta: 5,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      on: {
        init: function () {
          const firstSlide = this.slides[0];
      
          // Seleciona elementos fora do slide (ProjetoRenderer)
          const titulo = document.querySelector('#projeto-titulo');
          const barra = titulo?.querySelector('.barra');
      
          // Passa extras para animar junto com o slide
          animateFirstSlide(firstSlide, { extraElements: [titulo, barra].filter(Boolean) });
        },
        slideChangeTransitionStart: function () {
          const previousSlide = this.slides[this.previousIndex];
          const elements = [
            previousSlide.querySelector('.projetos-titulo'),
            previousSlide.querySelector('.barra'),
            previousSlide.querySelector('.projeto-plus')
          ].filter(Boolean);
      
          if (elements.length) {
            gsap.to(elements, { y: 20, opacity: 0, duration: 0.3, ease: 'power1.in' });
          }
        },
        slideChangeTransitionEnd: function () {
          const activeSlide = this.slides[this.activeIndex];
          animateSlideChange(activeSlide);
        }
      }
      
    };

    const swiperGallery = new SwiperGallery('.js-swiper-gallery', swiperOptions);
    swiperGallery.init();
  }
}
