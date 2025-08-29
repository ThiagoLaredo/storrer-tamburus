import { gsap } from 'gsap';
import { 
  setupFilterAnimations, 
  toggleActiveFilter,
  cleanupFilterAnimations 
} from './animations.js';

// Função para obter o filtro atual (SEM "todos")
export function getCurrentFilter() {
    // Verifica se estamos em uma página de projeto individual
    const isProjectPage = window.location.pathname.includes('projeto.html') || 
                         window.location.pathname.includes('/projeto/') ||
                         window.location.pathname.includes('/projetos/');
    
    if (isProjectPage) {
      // Em páginas de projeto, usa o lastFilter salvo ou mantém o padrão
      return localStorage.getItem('lastFilter') || 'comercial';
    }
    
    // Em páginas de listagem, usa o parâmetro da URL ou o último filtro
    if (window.location.pathname.includes('projetos.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('filter') || localStorage.getItem('lastFilter') || 'comercial';
    }
    
    return 'comercial';
  }

// Função para navegar para a página correta com o filtro
function navigateToFilterPage(slug) {
  const path = window.location.pathname;

  // Caso: estou em um projeto específico
  if (path.includes('/projetos/') || path.includes('projeto.html')) {
    window.location.href = `${window.location.origin}/projetos.html?filter=${slug}`;
    return true;
  }

  // Caso: já estou em /projetos.html
  if (path.includes('projetos.html')) {
    return false; // aplica só o filtro local
  }

  // Caso: qualquer outra página
  window.location.href = `/projetos.html?filter=${slug}`;
  return true;
}

export function renderFiltros(container, tipos, onClickFiltro) {
  // Só renderiza filtros se estivermos na página correta
  if (!container) return;
  
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
      
      // Verifica se precisa redirecionar para outra página
      const redirected = navigateToFilterPage(slug);
      
      // Se não houve redirecionamento, aplica o filtro localmente
      if (!redirected && onClickFiltro) {
        const tl = gsap.timeline({
          onComplete: () => {
            marcarAtivo(link);
            onClickFiltro(slug);

            // Atualiza a URL sem recarregar a página
            const url = new URL(window.location);
            url.searchParams.set("filter", slug);
            window.history.pushState({}, "", url);
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
      }
    });

    li.appendChild(link);
    return li;
  }

  // Adiciona apenas os tipos de projeto (REMOVE "todos")
  tipos.forEach(tipo => {
    container.appendChild(criarItemMenu(tipo.nome, tipo.slug));
  });

  // Configura animações após renderização
  setTimeout(() => {
    setupFilterAnimations(container);
    
    // Ativa o filtro correto (busca pelo currentFilter ou usa o primeiro disponível)
    const activeLink = container.querySelector(`[data-slug="${currentFilter}"]`) || 
                       container.querySelector('[data-slug]');
    
    if (activeLink) {
      marcarAtivo(activeLink);
    }
  }, 10);

  function marcarAtivo(linkAtivo) {
    toggleActiveFilter(linkAtivo);
  }
}