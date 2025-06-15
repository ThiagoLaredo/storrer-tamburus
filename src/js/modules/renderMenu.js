import { gsap } from 'gsap';
import { 
  setupFilterAnimations, 
  toggleActiveFilter,
  cleanupFilterAnimations 
} from './animations.js';

// Função para obter o filtro atual

function getCurrentFilter() {
  // Força "todos" na home page
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    return 'todos';
  }
  
  // Mantém o comportamento atual para outras páginas
  if (window.location.pathname.includes('projeto.html')) {
    return localStorage.getItem('lastFilter') || 'todos';
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('filter') || localStorage.getItem('lastFilter') || 'todos';
}

export function renderFiltros(container, tipos, onClickFiltro) {
    cleanupFilterAnimations(container);
    container.innerHTML = '';
    
    const currentFilter = getCurrentFilter();
    
    function criarItemMenu(texto, slug) {
      const li = document.createElement('li');
      const link = document.createElement('a');
  
      link.href = '#';
      link.textContent = texto;
      link.classList.add('filtro-btn', 'menu-item');
      link.setAttribute('data-menu-item', 'true');
      link.setAttribute('role', 'menuitem');
      link.setAttribute('aria-label', `Filtrar por ${texto}`);
      link.setAttribute('data-slug', slug);
      
      // Inicializa propriedades CSS
      link.style.setProperty('--circle-opacity', '0');
      link.style.setProperty('--circle-scale', '0');
      link.style.setProperty('--circle-color', 'var(--amarelo-escuro)');

      // Efeitos de interação
      link.addEventListener('mousedown', () => {
        gsap.to(link, { 
          scale: 0.96, 
          duration: 0.1,
          overwrite: true
        });
      });
      
      link.addEventListener('mouseup', () => {
        gsap.to(link, { 
          scale: 1, 
          duration: 0.3, 
          ease: 'elastic.out(1, 0.5)',
          overwrite: true
        });
      });
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Salva o filtro selecionado
        localStorage.setItem('lastFilter', slug);
        
        const tl = gsap.timeline({
          onComplete: () => {
            marcarAtivo(link);
            onClickFiltro(slug);
          }
        });
        
        tl.to(link, {
          scale: 0.95,
          duration: 0.1,
          overwrite: true
        }).to(link, {
          scale: 1,
          duration: 0.3,
          ease: 'elastic.out(1.5, 0.5)',
          overwrite: true
        });
      });

      li.appendChild(link);
      return li;
    }

    // Adiciona itens
    container.appendChild(criarItemMenu('todos', 'todos'));
    tipos.forEach(tipo => {
      container.appendChild(criarItemMenu(tipo.nome, tipo.slug));
    });

    // Configura animações após renderização
    setTimeout(() => {
      setupFilterAnimations(container);
      
      // Ativa o filtro correto
      const activeLink = container.querySelector(`[data-slug="${currentFilter}"]`) || 
                         container.querySelector('[data-slug="todos"]');
      
      if (activeLink) {
        marcarAtivo(activeLink);
      }
    }, 10);

    function marcarAtivo(linkAtivo) {
      toggleActiveFilter(linkAtivo);
    }
}