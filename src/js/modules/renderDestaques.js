import { initHeroSlider } from './heroSlider.js';

export function renderDestaques(container, projetos) {
  if (!container) return;

  container.innerHTML = '';

  if (!projetos || projetos.length === 0) {
    container.innerHTML = '<p class="sem-projetos">Nenhum destaque encontrado</p>';
    return;
  }

  // Cria estrutura das imagens
  container.innerHTML = `
    <div class="hero-slideshow">
      ${projetos.map(projeto => `
        <img 
          src="${projeto.capa}?w=1900&h=1200&fit=fill" 
          alt="${projeto.title}" 
          class="destaque-imagem"
          width="1900"
          height="1200">
      `).join('')}
    </div>
  `;

  initHeroSlider();
}
