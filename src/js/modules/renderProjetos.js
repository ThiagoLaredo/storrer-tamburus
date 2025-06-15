import { initGalleryAnimations } from './animations.js';


  export function renderGaleria(container, projetos) {
    if (!projetos || projetos.length === 0) {
      container.innerHTML = '<p class="sem-projetos">Nenhum projeto encontrado.</p>';
      return;
    }
  
    container.innerHTML = projetos.map(projeto => `
      <div class="projeto-item">
        <a href="/projeto.html?slug=${projeto.slug}">
          <img 
            src="${projeto.capa}?w=800&fm=webp&q=85" 
            srcset="${projeto.capa}?w=400&fm=webp&q=85 400w,
                    ${projeto.capa}?w=800&fm=webp&q=85 800w,
                    ${projeto.capa}?w=1200&fm=webp&q=85 1200w"
            sizes="(max-width: 600px) 400px, 800px"
            alt="${projeto.title}"
            loading="lazy"
            width="800"
            height="450">
          <div class="projeto-overlay"></div>
          <h3 class="projeto-titulo">${projeto.title}</h3>
        </a>
      </div>
    `).join('');
  
    // Inicia a animação após renderizar
    initGalleryAnimations();
  }
  