import "../../css/global.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/header.css";
import "../../css/menu-mobile.css";
import "../../css/footer.css";
import "../../css/projeto.css"; 

import MenuMobile from '../modules/menu-mobile.js';
import HeaderScroll from '../modules/header-scroll.js';
import HeaderManager from '../modules/HeaderManager.js'; 
import { initPageOpenAnimations, initScrollAnimations } from '../modules/animations.js';
import { fetchEntries } from "../modules/contentfulAPI.js";
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { renderFiltros } from '../modules/renderMenu.js'; // Importe a função do novo arquivo

// Configuração de otimização de imagens
const IMAGE_OPTIONS = {
  sizes: [
    { maxWidth: 640, width: 640, quality: 80 },
    { maxWidth: 1024, width: 1024, quality: 85 },
    { width: 1600, quality: 90 }
  ],
  format: 'webp',
  fallbackFormat: 'jpg'
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Inicializações de componentes
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
    menuMobile?.init();

    // Header
    const headerEl = document.querySelector('.header');
    if (headerEl) {
      const headerScroll = new HeaderScroll('.header');
      headerScroll.init();
      new HeaderManager('.header');
    }

    // Animações
    initPageOpenAnimations();
    initScrollAnimations();

    // ----------- CARREGAMENTO DO MENU DE FILTROS ------------
    const filtrosContainer = document.querySelector('[data-menu="list"]');
    if (filtrosContainer) {
      // Carrega os tipos de projeto para o menu
      const tiposData = await fetchEntries('tipoDeProjeto');
      const tiposParaFiltros = tiposData.items.map(tipo => ({
        slug: tipo.fields.slug || 'sem-tipo',
        nome: tipo.fields.nome || 'Sem nome'
      }));
      
      // Função de callback quando um filtro é selecionado
      // Como esta é uma página de projeto individual, podemos redirecionar para a home com o filtro
      function handleFiltroClick(slug) {
        if (slug === 'todos') {
          window.location.href = '/';
        } else {
          window.location.href = `/?filter=${slug}`;
        }
      }
      
      // Renderiza os filtros no menu
      renderFiltros(filtrosContainer, tiposParaFiltros, handleFiltroClick);
    }

    // ----------- CARREGAMENTO DO PROJETO ------------
    const slug = new URLSearchParams(window.location.search).get('slug');
    const container = document.querySelector('#projeto-detalhe');
    
    if (!slug || !container) {
      container.innerHTML = `<p class="error-message">Projeto não encontrado.</p>`;
      return;
    }

    // Carrega dados do projeto
    const data = await fetchEntries('projeto');
    const projeto = data.items.find(item => item.fields.slug === slug);
    
    if (!projeto) {
      container.innerHTML = `<p class="error-message">Projeto não encontrado.</p>`;
      return;
    }

    // Usando os field IDs corretos do Contentful
    const { 
      titulo, 
      descricao, 
      galeriaDeImagens = [],
      local,
      ano,
      area
    } = projeto.fields;

    // DEBUG: Verifique os dados no console
    console.log('Dados do projeto:', {
      titulo,
      descricao,
      galeriaDeImagens,
      includes: data.includes?.Asset || []
    });

    // Atualiza SEO
    document.title = `${titulo} | Storrer Tamburus`;
    updateMetaTags(
      titulo, 
      descricao, 
      galeriaDeImagens[0]?.sys?.id 
        ? data.includes.Asset.find(a => a.sys.id === galeriaDeImagens[0].sys.id)?.fields?.file?.url 
        : null
    );

    // Preenche conteúdo
    document.querySelector('#projeto-titulo').textContent = titulo;
    
    // Preenche os novos campos
    if (local) document.querySelector('#projeto-local').textContent = local;
    if (ano) document.querySelector('#projeto-ano').textContent = ano;
    if (area) document.querySelector('#projeto-area').textContent = area;
    
    document.querySelector('#projeto-texto').innerHTML = await formatDescription(descricao);
    
    // Otimiza e carrega imagens
    if (galeriaDeImagens.length > 0) {
      const imagensHtml = await loadOptimizedImages(galeriaDeImagens, data.includes?.Asset || [], titulo);
      document.querySelector('#projeto-imagens').innerHTML = imagensHtml;
    } else {
      console.warn('Nenhuma imagem encontrada na galeria');
      document.querySelector('#projeto-imagens').innerHTML = '<p>Galeria de imagens não disponível</p>';
    }

  } catch (error) {
    console.error('Erro na inicialização:', error);
    document.querySelector('#projeto-detalhe').innerHTML = `
      <p class="error-message">Erro ao carregar o projeto. Tente recarregar a página.</p>
    `;
  }
});

// Funções auxiliares
async function formatDescription(descricao) {
  if (!descricao) return '<p>Descrição não disponível</p>';
  
  if (typeof descricao === 'string') {
    return descricao;
  }
  
  // Se for Rich Text do Contentful
  if (descricao?.nodeType === 'document' || descricao?.content) {
    try {
      return documentToHtmlString(descricao);
    } catch (e) {
      console.error('Erro ao converter rich text:', e);
      return richTextFallback(descricao);
    }
  }
  
  return '<p>Descrição em formato não suportado</p>';
}

function richTextFallback(richText) {
  // Fallback manual para Rich Text
  if (richText?.content) {
    return richText.content
      .filter(item => item.nodeType === 'paragraph')
      .map(para => 
        `<p>${
          para.content
            .filter(text => text.nodeType === 'text')
            .map(text => text.value)
            .join('')
        }</p>`
      )
      .join('');
  }
  return '<p>Erro ao carregar descrição</p>';
}

async function loadOptimizedImages(galeriaDeImagens, assets, defaultAlt) {
  return Promise.all(galeriaDeImagens.map(async (imgRef) => {
    const asset = assets.find(a => a.sys.id === imgRef.sys.id);
    if (!asset) {
      console.warn('Asset não encontrado para referência:', imgRef);
      return '';
    }
    
    const url = asset.fields.file.url;
    const alt = asset.fields.title || asset.fields.description || defaultAlt;
    
    // Gera srcset otimizado
    const srcset = IMAGE_OPTIONS.sizes.map(size => {
      const params = `?w=${size.width}&q=${size.quality}&fm=${IMAGE_OPTIONS.format}`;
      return `https:${url}${params} ${size.width}w`;
    }).join(', ');
    
    // Fallback para JPG
    const fallbackSrc = `https:${url}?w=800&q=85&fm=${IMAGE_OPTIONS.fallbackFormat}`;
    
    return `
      <div class="galeria-item">
        <picture>
          <source srcset="${srcset}" type="image/webp">
          <img src="${fallbackSrc}" 
               alt="${alt}" 
               loading="lazy" 
               decoding="async"
               width="1600"
               height="900">
        </picture>
      </div>
    `;
  })).then(html => html.join(''));
}

function updateMetaTags(title, description, imageUrl) {
  // Converte description para string se não for
  const descText = typeof description === 'string' 
    ? description 
    : description?.content 
      ? richTextToString(description) 
      : '';

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
  metaDesc.name = 'description';
  metaDesc.content = descText.substring(0, 160) || 'Projeto de arquitetura da Storrer Tamburus';
  document.head.appendChild(metaDesc);

  // Open Graph
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: descText.substring(0, 160) || '' },
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

function richTextToString(richText) {
  try {
    if (richText?.content) {
      return richText.content
        .filter(item => item.nodeType === 'paragraph')
        .map(para => 
          para.content
            .filter(text => text.nodeType === 'text')
            .map(text => text.value)
            .join('')
        )
        .join('\n');
    }
    return JSON.stringify(richText);
  } catch (e) {
    console.warn('Erro ao converter rich text:', e);
    return '';
  }
}