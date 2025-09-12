import "../../css/global.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/header.css";
import "../../css/menu-mobile.css";
import "../../css/footer.css";
import "../../css/projetos.css"; 

import MenuMobile from '../modules/menu-mobile.js';
import { initPageOpenAnimations, initScrollAnimations } from '../modules/animations.js';

// Importa novos módulos da galeria de projetos
import { fetchEntries } from '../modules/contentfulAPI.js';
import { renderGaleria } from '../modules/renderProjetos.js';
import { renderFiltros } from '../modules/filterMenu.js';
import { getCurrentFilter } from '../modules/filterMenu.js'; // ⬅ precisa exportar


document.addEventListener('DOMContentLoaded', () => {


  // ========== HEADER ==========
  const menuMobile = new MenuMobile(
    '[data-menu="logo"]',
    '[data-menu="button-menu"]',
    '[data-menu="list-projetos"]',
    '[data-menu="contato-mobile"]',
    '[data-menu="whatsapp"]',
    '[data-menu="linkedin"]',
    '[data-menu="instagram"]',
    '.header_acoes'
  );
  if (menuMobile) menuMobile.init();
    
  // ========== ANIMAÇÕES ==========
  initPageOpenAnimations();
  initScrollAnimations();

  // ========== GALERIA DE PROJETOS ==========
  const galeria = document.getElementById('galeria');
  const filtros = document.querySelector('[data-menu="list-projetos"]');
  let todosProjetos = [];

  function filtrar(slug) {
    // Filtra os projetos pelo tipo (não há mais opção "todos")
    const projetosFiltrados = todosProjetos.filter(p => p.tipoSlug === slug);
  
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
      const tiposData = await fetchEntries('tipoDeProjeto');
      const projetosData = await fetchEntries('projeto', { include: 2 });
  
      const tiposMap = new Map();
      tiposData.items.forEach(tipo => {
        if (tipo.fields) {
          tiposMap.set(tipo.sys.id, {
            slug: tipo.fields.slug || 'sem-tipo',
            nome: tipo.fields.nome || 'Sem nome'
          });
        }
      });
  
      todosProjetos = projetosData.items.map(item => {
        const title = item.fields?.titulo || 'Sem título';
  
        let tipoSlug = 'sem-tipo';
        if (item.fields?.tipoDoProjeto?.sys?.id) {
          const tipoId = item.fields.tipoDoProjeto.sys.id;
          const tipoInfo = tiposMap.get(tipoId);
          if (tipoInfo) {
            tipoSlug = tipoInfo.slug;
          }
        }
  
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
  
      const tiposParaFiltros = Array.from(tiposMap.values());
      renderFiltros(filtros, tiposParaFiltros, filtrar);
  
      // Filtro inicial é "comercial" (não mais "todos")
      const filtroInicial = getCurrentFilter();  
      filtrar(filtroInicial);
  
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


// import "../../css/global.css";
// import "../../css/cores.css";
// import "../../css/componentes.css";
// import "../../css/header.css";
// import "../../css/menu-mobile.css";
// import "../../css/footer.css";
// import "../../css/projetos.css"; 

// import MenuMobile from '../modules/menu-mobile.js';
// import { initPageOpenAnimations, initScrollAnimations } from '../modules/animations.js';

// import { fetchEntries } from '../modules/contentfulAPI.js';
// import { renderGaleria } from '../modules/renderProjetos.js';
// import { renderFiltros } from '../modules/filterMenu.js';
// import { getCurrentFilter } from '../modules/filterMenu.js'; 

// document.addEventListener('DOMContentLoaded', () => {

//   // ========== HEADER ==========
//   const menuMobile = new MenuMobile(
//     '[data-menu="logo"]',
//     '[data-menu="button-menu"]',
//     '[data-menu="list-projetos"]',
//     '[data-menu="contato-mobile"]',
//     '[data-menu="whatsapp"]',
//     '[data-menu="linkedin"]',
//     '[data-menu="instagram"]',
//     '.header_acoes'
//   );
//   if (menuMobile) menuMobile.init();
    
//   // ========== ANIMAÇÕES ==========
//   initPageOpenAnimations();
//   initScrollAnimations();

//   // ========== GALERIA DE PROJETOS ==========
//   const galeria = document.getElementById('galeria');
//   const filtros = document.querySelector('[data-menu="list-projetos"]');
//   let todosProjetos = [];

//   function filtrar(slug) {
//     const projetosFiltrados = todosProjetos.filter(p => p.tipoSlug === slug);
  
//     if (typeof gsap !== 'undefined') {
//       gsap.to('.projeto-item', {
//         opacity: 0,
//         y: 20,
//         duration: 0.3,
//         onComplete: () => renderGaleria(galeria, projetosFiltrados)
//       });
//     } else {
//       document.querySelectorAll('.projeto-item').forEach(item => {
//         item.style.opacity = '0';
//         item.style.transform = 'translateY(20px)';
//       });
//       setTimeout(() => renderGaleria(galeria, projetosFiltrados), 300);
//     }
//   }

//   /**
//    * Gera URLs otimizadas do Contentful para horizontal/vertical e breakpoints
//    */
//   function getContentfulImageUrls(url, { horizontal = true, quality = 80, breakpoints = { desktop: 1980, tablet: 1280, mobile: 768 } } = {}) {
//     const urls = {};
//     for (const [key, size] of Object.entries(breakpoints)) {
//       let params = `fm=webp&q=${quality}`;
//       if (horizontal) params += `&w=${size}`;
//       else params += `&h=${size}`;
//       urls[key] = `${url}?${params}`;
//     }
//     return urls;
//   }

//   async function carregarProjetos() {
//     try {
//       const tiposData = await fetchEntries('tipoDeProjeto');
//       const projetosData = await fetchEntries('projeto', { include: 2 });
  
//       const tiposMap = new Map();
//       tiposData.items.forEach(tipo => {
//         if (tipo.fields) {
//           tiposMap.set(tipo.sys.id, {
//             slug: tipo.fields.slug || 'sem-tipo',
//             nome: tipo.fields.nome || 'Sem nome'
//           });
//         }
//       });
  
//       todosProjetos = projetosData.items.map(item => {
//         const title = item.fields?.titulo || 'Sem título';
  
//         let tipoSlug = 'sem-tipo';
//         if (item.fields?.tipoDoProjeto?.sys?.id) {
//           const tipoId = item.fields.tipoDoProjeto.sys.id;
//           const tipoInfo = tiposMap.get(tipoId);
//           if (tipoInfo) tipoSlug = tipoInfo.slug;
//         }
  
//         let capaUrl = '';
//         let capaWidth = 0;
//         let capaHeight = 0;
//         if (item.fields?.capa?.sys?.id) {
//           const capaId = item.fields.capa.sys.id;
//           const capaAsset = projetosData.includes?.Asset?.find(a => a.sys.id === capaId);
//           if (capaAsset?.fields?.file?.url) {
//             capaUrl = `https:${capaAsset.fields.file.url}`;
//             capaWidth = capaAsset.fields.file.details?.image?.width || 0;
//             capaHeight = capaAsset.fields.file.details?.image?.height || 0;
//           }
//         }

//         return {
//           title,
//           slug: item.fields?.slug || '',
//           tipoSlug,
//           capa: capaUrl,
//           width: capaWidth,
//           height: capaHeight,
//           isHorizontal: capaWidth >= capaHeight,
//           getOptimizedUrls() {
//             return getContentfulImageUrls(this.capa, { horizontal: this.isHorizontal });
//           }
//         };
//       });
  
//       const tiposParaFiltros = Array.from(tiposMap.values());
//       renderFiltros(filtros, tiposParaFiltros, filtrar);
  
//       // Filtro inicial
//       const filtroInicial = getCurrentFilter();  
//       filtrar(filtroInicial);
  
//     } catch (error) {
//       console.error("Erro ao carregar projetos:", error);
//     }
//   }

//   carregarProjetos();

//   // Debug opcional
//   if (todosProjetos.length > 0) {
//     console.log('Primeiro projeto detalhado:', todosProjetos[0]);
//   }
// });
