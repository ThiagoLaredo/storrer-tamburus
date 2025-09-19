// 


// projetoRenderer.js
import { SwiperGallery } from './swiper-gallery.js';
import { buildResponsiveImage } from './imageUtils.js';

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
    document.querySelector('#projeto-imagens').innerHTML = `
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
                  ${buildResponsiveImage(url, alt, { isLCP: index === 0 })}
                  <div class="overlay"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="swiper-pagination"></div>
      </div>
    `;

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
    };

    const swiperGallery = new SwiperGallery('.js-swiper-gallery', swiperOptions);
    swiperGallery.init();
  }
}
