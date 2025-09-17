// projetoRenderer.js
import { SwiperGallery } from './swiper-gallery.js';

export class ProjetoRenderer {
  constructor() {
    // Configuração de imagens responsivas e otimizadas
    this.IMAGE_OPTIONS = {
      sizes: [
        { maxWidth: 640, width: 640, quality: 80 },
        { maxWidth: 1024, width: 1024, quality: 85 },
        { width: 1600, quality: 90 },
      ],
      format: 'webp',
      fallbackFormat: 'jpg',
    };
  }

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

    // Renderiza galeria otimizada
    document.querySelector('#projeto-imagens').innerHTML = `
      <div class="swiper js-swiper-gallery">
        <div class="swiper-wrapper">
          ${await this.loadOptimizedImages(galeriaDeImagens, data.includes?.Asset || [], titulo)}
        </div>
        <div class="swiper-pagination"></div>
      </div>
    `;

    this.initSwiper();
    return true;
  }

  async loadOptimizedImages(galeriaDeImagens, assets, defaultAlt) {
    const imagesHtml = await Promise.all(
      galeriaDeImagens.map(async (imgRef) => {
        const asset = assets.find(a => a.sys.id === imgRef.sys.id);
        if (!asset) {
          console.warn('Asset não encontrado para referência:', imgRef);
          return '';
        }

        const url = asset.fields.file.url;
        const alt = asset.fields.title || asset.fields.description || defaultAlt;

        // Cria srcset WebP
        const webpSrcset = this.IMAGE_OPTIONS.sizes.map(size =>
          `https:${url}?w=${size.width}&q=${size.quality}&fm=webp ${size.width}w`
        ).join(', ');

        // Cria srcset JPG fallback
        const jpgSrcset = this.IMAGE_OPTIONS.sizes.map(size =>
          `https:${url}?w=${size.width}&q=${size.quality}&fm=jpg ${size.width}w`
        ).join(', ');

        const fallbackSrc = `https:${url}?w=1200&q=85&fm=${this.IMAGE_OPTIONS.fallbackFormat}`;

        return `
          <div class="swiper-slide">
            <div class="projeto-slide">
              <picture>
                <source srcset="${webpSrcset}" type="image/webp">
                <img
                  src="${fallbackSrc}"
                  srcset="${jpgSrcset}"
                  sizes="100vw"
                  alt="${alt}"
                  loading="lazy"
                  decoding="async"
                  class="projeto-imagem"
                >
              </picture>
              <div class="overlay"></div>
            </div>
          </div>
        `;
      })
    );

    return imagesHtml.join('');
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