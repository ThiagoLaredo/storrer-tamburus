// --- Imports de estilos ---
import "../../css/global.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/header.css";
import "../../css/menu-mobile.css";
import "../../css/footer.css";
import "../../css/projeto.css"; 

// --- Imports de módulos ---
import MenuMobile from '../modules/menu-mobile.js';
// import { initPageOpenAnimations } from '../modules/animations.js';
import { fetchEntries } from "../modules/contentfulAPI.js";
import { renderFiltros } from '../modules/filterMenu.js';
import { ProjetoRenderer } from '../modules/projetoRenderer.js';

// --- Funções utilitárias ---

// Normaliza texto em slug amigável
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

// Extrai slug da URL (/projetos/slug ou ?slug=)
function getProjectSlug() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts[0] === 'projetos' && pathParts[1]) {
    return pathParts[1];
  }
  return new URLSearchParams(window.location.search).get('slug');
}

// Obtém slug do tipo do projeto
async function getProjectTypeSlug(projeto, data) {
  if (!projeto.fields.tipoDoProjeto) return 'sem-tipo';

  const tipo = data.includes?.Entry?.find(entry => 
    entry.sys.id === projeto.fields.tipoDoProjeto.sys.id
  );

  return slugify(tipo?.fields?.nome || 'sem-tipo');
}

// Atualiza meta tags SEO e OpenGraph
function updateMetaTags(title, imageUrl) {
  const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
  metaDesc.name = 'description';
  metaDesc.content = title 
    ? `${title} | Projeto de arquitetura da Storrer Tamburus` 
    : 'Projeto de arquitetura da Storrer Tamburus';
  document.head.appendChild(metaDesc);

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

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Menu Mobile
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
    // initPageOpenAnimations();

    // Slug atual
    const slug = getProjectSlug();
    const container = document.querySelector('#projeto-detalhe');
    if (!slug || !container) {
      container.innerHTML = '<p class="error-message">Projeto não encontrado.</p>';
      return;
    }

    // Busca projetos
    const data = await fetchEntries('projeto');

    // Localiza projeto pelo slug (slug ou titulo)
    const projeto = data.items.find(item => {
      const contentfulSlug = item.fields.slug 
        ? slugify(item.fields.slug) 
        : slugify(item.fields.titulo);
      return contentfulSlug === slug;
    });

    if (!projeto) {
      container.innerHTML = '<p class="error-message">Projeto não encontrado.</p>';
      return;
    }

    // Salva tipo do projeto como filtro ativo
    const projectTypeSlug = await getProjectTypeSlug(projeto, data);
    localStorage.setItem('lastFilter', projectTypeSlug);

    // Renderiza menu de filtros
    const filtrosContainer = document.querySelector('[data-menu="list-projetos"]');
    if (filtrosContainer) {
      const tiposData = await fetchEntries('tipoDeProjeto');
      const tiposParaFiltros = tiposData.items.map(tipo => ({
        slug: slugify(tipo.fields.nome || 'sem-tipo'),
        nome: tipo.fields.nome || 'Sem nome'
      }));

      renderFiltros(filtrosContainer, tiposParaFiltros, slug => {
        localStorage.setItem('lastFilter', slug);
      });
    }

    // Renderiza detalhes do projeto
    const projetoRenderer = new ProjetoRenderer();
    await projetoRenderer.renderProjeto(projeto, data);

    // SEO
    document.title = `${projeto.fields.titulo} | Storrer Tamburus`;
    const primeiraImagem = projeto.fields.galeriaDeImagens[0]?.sys?.id
      ? data.includes.Asset.find(a => a.sys.id === projeto.fields.galeriaDeImagens[0].sys.id)?.fields?.file?.url
      : null;
    updateMetaTags(projeto.fields.titulo, primeiraImagem);

    // URL amigável
    const slugAmigavel = projeto.fields.slug 
      ? slugify(projeto.fields.slug) 
      : slugify(projeto.fields.titulo);

    if (window.location.pathname.includes('projeto.html')) {
      window.history.replaceState(null, '', `/projetos/${slugAmigavel}`);
    }

  } catch (error) {
    console.error('Erro na inicialização:', error);
    document.querySelector('#projeto-detalhe').innerHTML = `
      <p class="error-message">Erro ao carregar o projeto. Tente recarregar a página.</p>
    `;
  }
});