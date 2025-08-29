// projetoRenderer.js
import { SwiperGallery } from './swiper-gallery.js';

export class ProjetoRenderer {
  constructor() {
    this.IMAGE_OPTIONS = {
      sizes: [
        { maxWidth: 640, width: 640, quality: 80 },
        { maxWidth: 1024, width: 1024, quality: 85 },
        { width: 1600, quality: 90 }
      ],
      format: 'webp',
      fallbackFormat: 'jpg'
    };
  }

  async renderProjeto(projeto, data) {
    const { titulo, galeriaDeImagens = [], tipoDoProjeto } = projeto.fields;
    
    // Salva o tipo do projeto no localStorage para o filtro correto
    if (tipoDoProjeto) {
      // Encontra o tipo do projeto nos includes
      const tipo = data.includes?.Entry?.find(entry => 
        entry.sys.id === tipoDoProjeto.sys.id
      );
      
      if (tipo && tipo.fields) {
        localStorage.setItem('lastFilter', tipo.fields.slug);
      }
    }
    
    // Atualiza apenas o texto do título, mantendo a estrutura HTML
    const tituloElement = document.querySelector('#projeto-titulo');
    const textoElement = tituloElement.querySelector('.texto');
    if (textoElement) {
      textoElement.textContent = titulo;
    } else {
      // Fallback caso a estrutura não exista
      tituloElement.innerHTML = `<span class="barra"></span><span class="texto">${titulo}</span>`;
    }
    
    // Cria a estrutura do Swiper
    document.querySelector('#projeto-imagens').innerHTML = `
      <div class="swiper js-swiper-gallery">
        <div class="swiper-wrapper">
          ${await this.loadOptimizedImages(galeriaDeImagens, data.includes?.Asset || [], titulo)}
        </div>
        <div class="swiper-pagination"></div>
      </div>
    `;

    // Inicializa o Swiper
    this.initSwiper();
    
    return true;
  }

  async loadOptimizedImages(galeriaDeImagens, assets, defaultAlt) {
    const imagesHtml = await Promise.all(galeriaDeImagens.map(async (imgRef) => {
      const asset = assets.find(a => a.sys.id === imgRef.sys.id);
      if (!asset) {
        console.warn('Asset não encontrado para referência:', imgRef);
        return '';
      }
      
      const url = asset.fields.file.url;
      const alt = asset.fields.title || asset.fields.description || defaultAlt;
      
      // Gera srcset otimizado
      const srcset = this.IMAGE_OPTIONS.sizes.map(size => {
        const params = `?w=${size.width}&q=${size.quality}&fm=${this.IMAGE_OPTIONS.format}`;
        return `https:${url}${params} ${size.width}w`;
      }).join(', ');
      
      // Fallback para JPG
      const fallbackSrc = `https:${url}?w=800&q=85&fm=${this.IMAGE_OPTIONS.fallbackFormat}`;
      
      return `
        <div class="swiper-slide">
          <div class="projeto-slide">
            <picture>
              <source srcset="${srcset}" type="image/webp">
              <img src="${fallbackSrc}" 
                  alt="${alt}" 
                  loading="lazy" 
                  decoding="async"
                  width="1600"
                  height="900"
                  class="projeto-imagem">
            </picture>
            <div class="overlay"></div>
          </div>
        </div>
      `;
    }));
    
    return imagesHtml.join('');
  }

  initSwiper() {
    // Configuração para galeria horizontal (diferente da vertical da página de projetos)
    const swiperOptions = {
      direction: 'vertical',
      mousewheel: {
        enabled: true,
        forceToAxis: true,
        sensitivity: 1.2,
        thresholdDelta: 5
      }
    };

    const swiperGallery = new SwiperGallery('.js-swiper-gallery', swiperOptions);
    swiperGallery.init();
  }
}

