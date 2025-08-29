import "../../css/global.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/header.css";
import "../../css/menu-mobile.css";
import "../../css/footer.css";
import "../../css/projeto.css"; 

import MenuMobile from '../modules/menu-mobile.js';
import { 
  initPageOpenAnimations, 
  initScrollAnimations,
} from '../modules/animations.js';
import { fetchEntries } from "../modules/contentfulAPI.js";
import { renderFiltros } from '../modules/filterMenu.js';
import { ProjetoRenderer } from '../modules/projetoRenderer.js';

const getProjectSlug = () => {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts[0] === 'projetos' && pathParts[1]) {
    return pathParts[1];
  }
  return new URLSearchParams(window.location.search).get('slug');
};

// Função para obter o slug do tipo do projeto
async function getProjectTypeSlug(projeto, data) {
  if (!projeto.fields.tipoDoProjeto) return 'comercial';
  
  const tipo = data.includes?.Entry?.find(entry => 
    entry.sys.id === projeto.fields.tipoDoProjeto.sys.id
  );
  
  return tipo?.fields?.slug || 'comercial';
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Inicializações de componentes
    const menuMobile = new MenuMobile(
      '[data-menu="logo"]',
      '[data-menu="button-menu"]',
      '[data-menu="list-projetos"]',
      '[data-menu="contato-mobile"]',
      '[data-menu="whatsapp"]',
      '[data-menu="linkedin"]',
      '[data-menu="instagram"]',
      '.header-top'
    );
    menuMobile?.init();

    // Animações
    initPageOpenAnimations();
    initScrollAnimations();

    // ----------- CARREGAMENTO DO PROJETO PRIMEIRO ------------
    const slug = getProjectSlug();
    const container = document.querySelector('#projeto-detalhe');

    if (!slug || !container) {
      container.innerHTML = '<p class="error-message">Projeto não encontrado.</p>';
      return;
    }

    // Carrega dados do projeto
    const data = await fetchEntries('projeto');
    const projeto = data.items.find(item => item.fields.slug === slug);
    
    if (!projeto) {
      container.innerHTML = `<p class="error-message">Projeto não encontrado.</p>`;
      return;
    }

    // Obtém o tipo do projeto e salva como filtro ativo
    const projectTypeSlug = await getProjectTypeSlug(projeto, data);
    localStorage.setItem('lastFilter', projectTypeSlug);

    // ----------- CARREGAMENTO DO MENU DE FILTROS ------------
    const filtrosContainer = document.querySelector('[data-menu="list-projetos"]');
    if (filtrosContainer) {
      // Carrega os tipos de projeto para o menu
      const tiposData = await fetchEntries('tipoDeProjeto');
      const tiposParaFiltros = tiposData.items.map(tipo => ({
        slug: tipo.fields.slug || 'sem-tipo',
        nome: tipo.fields.nome || 'Sem nome'
      }));
      
      // Função de callback quando um filtro é selecionado
      function handleFiltroClick(slug) {
        localStorage.setItem('lastFilter', slug);
      }
      
      // Renderiza os filtros no menu com o tipo correto já selecionado
      renderFiltros(filtrosContainer, tiposParaFiltros, handleFiltroClick);
    }

    // Usando o novo renderizador
    const projetoRenderer = new ProjetoRenderer();
    await projetoRenderer.renderProjeto(projeto, data);

    // Atualiza SEO
    document.title = `${projeto.fields.titulo} | Storrer Tamburus`;
    updateMetaTags(
      projeto.fields.titulo, 
      projeto.fields.galeriaDeImagens[0]?.sys?.id 
        ? data.includes.Asset.find(a => a.sys.id === projeto.fields.galeriaDeImagens[0].sys.id)?.fields?.file?.url 
        : null
    );

    // Atualiza a URL para a versão amigável se veio de projeto.html
    if (window.location.pathname.includes('projeto.html')) {
      window.history.replaceState(null, '', `/projetos/${slug}`);
    }

  } catch (error) {
    console.error('Erro na inicialização:', error);
    document.querySelector('#projeto-detalhe').innerHTML = `
      <p class="error-message">Erro ao carregar o projeto. Tente recarregar a página.</p>
    `;
  }
});

function updateMetaTags(title, imageUrl) {
  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
  metaDesc.name = 'description';
  metaDesc.content = title ? `${title} | Projeto de arquitetura da Storrer Tamburus` : 'Projeto de arquitetura da Storrer Tamburus';
  document.head.appendChild(metaDesc);

  // Open Graph
  const ogTags = [
    { property: 'og:title', content: title || 'Storrer Tamburus Arquitetura' },
    { property: 'og:description', content: title ? `${title} | Projeto de arquitetura` : 'Projeto de arquitetura' },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: window.location.href }
  ];

  if (imageUrl) {
    ogTags.push(
      { property: 'og:image', content: `https:${imageUrl}?w=1200&h=630&fit=fill&q=85` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' }
    );
  }

  ogTags.forEach(tag => {
    const el = document.querySelector(`meta[property="${tag.property}"]`) || document.createElement('meta');
    el.setAttribute('property', tag.property);
    el.content = tag.content;
    document.head.appendChild(el);
  });
}
