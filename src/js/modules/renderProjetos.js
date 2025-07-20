// import { initGalleryAnimations } from './animations.js';


// export function renderGaleria(container, projetos) {
//   if (!projetos || projetos.length === 0) {
//     container.innerHTML = '<p class="sem-projetos">Nenhum projeto encontrado.</p>';
//     return;
//   }

//   container.innerHTML = projetos.map(projeto => `
//     <div class="projeto-item">
//       <a href="/projetos/${projeto.slug}">
//         <img 
//           src="${projeto.capa}?w=800&fm=webp&q=85" 
//           srcset="${projeto.capa}?w=400&fm=webp&q=85 400w,
//                   ${projeto.capa}?w=800&fm=webp&q=85 800w,
//                   ${projeto.capa}?w=1200&fm=webp&q=85 1200w"
//           sizes="(max-width: 600px) 400px, 800px"
//           alt="${projeto.title}"
//           loading="lazy"
//           width="800"
//           height="450">
//         <div class="projeto-overlay"></div>
//         <h3 class="projeto-titulo">${projeto.title}</h3>
//       </a>
//     </div>
//   `).join('');

//   // Inicia a animação após renderizar
//   initGalleryAnimations();
// }
  
import { SwiperGallery } from './swiper-gallery.js';

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
        ${projetos.map(projeto => `
          <div class="swiper-slide">
            <div class="projeto-slide">
              <a href="/projetos/${projeto.slug}" class="projeto-link">
                ${projeto.capa ? `
                  <img 
                    src="${projeto.capa}?w=300&h=400&fit=fill" 
                    alt="${projeto.title}" 
                    class="projeto-imagem"
                    loading="lazy"
                    width="300"
                    height="400">
                ` : `
                  <div class="projeto-imagem placeholder"></div>
                `}
                <h3 class="projeto-titulo">${projeto.title}</h3>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Inicializa o Swiper
  const swiper = new SwiperGallery('.swiper', {
    // Opções personalizadas podem vir aqui
  });
  swiper.init();
}