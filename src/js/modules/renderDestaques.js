import { SwiperGallery } from './swiper-gallery.js';

export function renderDestaques(container, projetos) {
  if (!container) return;

  // Limpa o container
  container.innerHTML = '';

  if (!projetos || projetos.length === 0) {
    container.innerHTML = '<p class="sem-projetos">Nenhum destaque encontrado</p>';
    return;
  }

  // Cria a estrutura do Swiper (igual ao renderProjetos mas com classes específicas)
  container.innerHTML = `
    <div class="swiper swiper-destaques">
      <div class="swiper-wrapper">
        ${projetos.map(projeto => `
          <div class="swiper-slide">
            <div class="destaque-slide">
              <a href="/projetos/${projeto.slug}" class="destaque-link">
                ${projeto.capa ? `
                  <img 
                    src="${projeto.capa}?w=1900&h=1200&fit=fill" 
                    alt="${projeto.title}" 
                    class="destaque-imagem"
                    loading="lazy"
                    width="1900"
                    height="1200">
                ` : `
                  <div class="destaque-imagem placeholder"></div>
                `}
                <div class="container">
                  <h3 class="destaque-titulo">${projeto.title}</h3>
                </div>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Inicializa o Swiper com as mesmas opções
  const swiper = new SwiperGallery('.swiper-destaques', {
    // Opções adicionais podem vir aqui
    slidesPerView: 'auto',
    spaceBetween: 20,
    centeredSlides: true
  });
  swiper.init();
}