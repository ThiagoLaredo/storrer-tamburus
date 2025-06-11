import { initGalleryAnimations } from './animations.js';

  // export function renderFiltros(container, tipos, onClickFiltro) {
  // container.innerHTML = ''; // Limpa o conteúdo anterior

  // // Função que cria um item de menu com link
  // function criarItemMenu(texto, slug) {
  //   const li = document.createElement('li');
  //   const link = document.createElement('a');

  //   link.href = '#'; // Mantém o comportamento de link
  //   link.textContent = texto;
  //   link.classList.add('filtro-btn', 'menu-item');
  //   // Adicione um data-attribute específico
  //   link.setAttribute('data-menu-item', 'true');
  //   link.setAttribute('role', 'menuitem');
  //   link.setAttribute('aria-label', `Filtrar por ${texto}`);

  //   link.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     marcarAtivo(link);
  //     onClickFiltro(slug);
  //   });

  //   li.appendChild(link);
  //   return li;
  // }

  // // Adiciona "Todos" no início
  // container.appendChild(criarItemMenu('todos', 'todos'));

  // // Adiciona os demais tipos
  // tipos.forEach(tipo => {
  //   container.appendChild(criarItemMenu(tipo.nome, tipo.slug));
  // });

  // // Controla a classe ativa
  // function marcarAtivo(linkAtivo) {
  //   const links = container.querySelectorAll('.filtro-btn');
  //   links.forEach(link => link.classList.remove('ativo'));
  //   linkAtivo.classList.add('ativo');
  // }
  // }

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
  