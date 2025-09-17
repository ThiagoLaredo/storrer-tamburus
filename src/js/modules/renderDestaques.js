import { initHeroSlider } from './heroSlider.js';

export function renderDestaques(container, projetos) {
  if (!container) return;

  container.innerHTML = '';

  if (!projetos || projetos.length === 0) {
    container.innerHTML = '<p class="sem-projetos">Nenhum destaque encontrado</p>';
    return;
  }

  // Cria estrutura das imagens com otimização Contentful
  container.innerHTML = `
    <div class="hero-slideshow">
      ${projetos.map(projeto => `
        <picture>
          <!-- WebP otimizado -->
          <source 
            srcset="
              ${projeto.capa}?w=480&fm=webp&q=85 480w,
              ${projeto.capa}?w=768&fm=webp&q=85 768w,
              ${projeto.capa}?w=1200&fm=webp&q=85 1200w,
              ${projeto.capa}?w=1920&fm=webp&q=85 1920w,
              ${projeto.capa}?w=3840&fm=webp&q=85 3840w
            "
            sizes="100vw"
            type="image/webp"
          >
          <!-- JPEG fallback -->
          <img 
            src="${projeto.capa}?w=1200&fm=jpg&q=85" 
            srcset="
              ${projeto.capa}?w=480&fm=jpg&q=85 480w,
              ${projeto.capa}?w=768&fm=jpg&q=85 768w,
              ${projeto.capa}?w=1200&fm=jpg&q=85 1200w,
              ${projeto.capa}?w=1920&fm=jpg&q=85 1920w,
              ${projeto.capa}?w=3840&fm=jpg&q=85 3840w
            "
            sizes="100vw"
            alt="${projeto.title}" 
            class="destaque-imagem"
            loading="lazy"
          >
        </picture>
      `).join('')}
    </div>
  `;

  initHeroSlider();
}