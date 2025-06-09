// Importa os estilos globais e componentes
import "../../css/global.css";
import "../../css/header.css";
import "../../css/footer.css";
import "../../css/menu-mobile.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/home.css"; // Estilo específico para a galeria de projetos

// Importa os módulos existentes
import MenuMobile from '../modules/menu-mobile.js';
import HeaderScroll from '../modules/header-scroll.js';
import HeaderManager from '../modules/HeaderManager.js';
import { initPageOpenAnimations, initGalleryAnimations, initScrollAnimations } from '../modules/animations.js';

// Importa novos módulos da galeria de projetos
import { fetchEntries } from '../modules/contentfulAPI.js';
import { renderFiltros, renderGaleria } from '../modules/renderProjetos.js';

document.addEventListener('DOMContentLoaded', () => {
  // ========== HEADER ==========
  const menuMobile = new MenuMobile(
    '[data-menu="logo"]',
    '[data-menu="button"]',
    '[data-menu="list"]',
    '[data-menu="contato-mobile"]',
    '[data-menu="whatsapp"]',
    '[data-menu="linkedin"]',
    '[data-menu="instagram"]',
    '.header_acoes'
  );
  if (menuMobile) menuMobile.init();

  const headerManager = new HeaderManager('.header');
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const headerScroll = new HeaderScroll('.header');
    headerScroll.init();
  }

  // ========== ANIMAÇÕES ==========
  initPageOpenAnimations();
  initGalleryAnimations()
  initScrollAnimations();

  // ========== GALERIA DE PROJETOS ==========
  const galeria = document.getElementById('galeria');
  const filtros = document.querySelector('[data-menu="list"]');
  let todosProjetos = [];

  function filtrar(slug) {
    const projetosFiltrados = slug === 'todos'
      ? todosProjetos
      : todosProjetos.filter(p => p.tipoSlug === slug);
  
    // Verifica se GSAP está disponível
    if (typeof gsap !== 'undefined') {
      gsap.to('.projeto-item', {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          renderGaleria(galeria, projetosFiltrados);
        }
      });
    } else {
      // Fallback caso GSAP não esteja disponível
      document.querySelectorAll('.projeto-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
      });
      setTimeout(() => {
        renderGaleria(galeria, projetosFiltrados);
      }, 300);
    }
  }

  async function carregarProjetos() {
    try {
      // 1. Carrega dados com include para resolver relacionamentos
      const tiposData = await fetchEntries('tipoDeProjeto');
      const projetosData = await fetchEntries('projeto', { include: 2 });
  
      // 2. Cria mapa de tipos (ID → slug)
      const tiposMap = new Map();
      tiposData.items.forEach(tipo => {
        if (tipo.fields) {
          tiposMap.set(tipo.sys.id, {
            slug: tipo.fields.slug || 'sem-tipo',
            nome: tipo.fields.nome || 'Sem nome'
          });
        }
      });
  
      // 3. Processa cada projeto com os nomes de campos corretos
      todosProjetos = projetosData.items.map(item => {
        // Usa 'titulo' em vez de 'title'
        const title = item.fields?.titulo || 'Sem título';
        
        // Usa 'tipoDoProjeto' em vez de 'tipoProjeto'
        let tipoSlug = 'sem-tipo';
        if (item.fields?.tipoDoProjeto?.sys?.id) {
          const tipoId = item.fields.tipoDoProjeto.sys.id;
          const tipoInfo = tiposMap.get(tipoId);
          if (tipoInfo) {
            tipoSlug = tipoInfo.slug;
          }
        }
  
        // Resolve a URL da capa (mantém o mesmo se o campo for 'capa')
        let capaUrl = '';
        if (item.fields?.capa?.sys?.id) {
          const capaId = item.fields.capa.sys.id;
          const capaAsset = projetosData.includes?.Asset?.find(a => a.sys.id === capaId);
          if (capaAsset?.fields?.file?.url) {
            capaUrl = `https:${capaAsset.fields.file.url}`;
          }
        }
  
        return {
          title: title,
          slug: item.fields?.slug || '',
          tipoSlug: tipoSlug,
          capa: capaUrl
        };
      });
  
      console.log('Projetos processados:', todosProjetos);
  
      // 4. Renderiza
      const tiposParaFiltros = Array.from(tiposMap.values());
      renderFiltros(filtros, tiposParaFiltros, filtrar);
      renderGaleria(galeria, todosProjetos);
  
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }
  

  carregarProjetos();
  // Depois de carregar os projetos
if (todosProjetos.length > 0) {
    console.log('Primeiro projeto detalhado:', todosProjetos[0]._raw);
  }
});
