import "../../css/global.css";
import "../../css/header.css";
import "../../css/footer.css";
import "../../css/menu-mobile.css";
import "../../css/cores.css";
import "../../css/componentes.css";

import MenuMobile from '../modules/menu-mobile.js';
import HeaderScroll from '../modules/header-scroll.js';
import HeaderManager from '../modules/HeaderManager.js'; 
import { initPageOpenAnimations, initScrollAnimations } from '../modules/animations.js';
import { fetchEntries } from "../modules/contentfulAPI.js";

document.addEventListener('DOMContentLoaded', async () => {

  // MENU MOBILE
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
  if (menuMobile) {
    menuMobile.init();
  }

  // HEADER
  const headerManager = new HeaderManager('.header');
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const headerScroll = new HeaderScroll('.header');
    headerScroll.init();
  }

  // Animações de abertura e scroll
  initPageOpenAnimations();
  initScrollAnimations();

  // ----------- CARREGAMENTO DO PROJETO ------------
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const container = document.querySelector('#projeto-detalhe');
  const tituloEl = document.querySelector('#projeto-titulo');
  const textoEl = document.querySelector('#projeto-texto');
  const imagensEl = document.querySelector('#projeto-imagens');

  if (!slug || !container) {
    container.innerHTML = `<p>Projeto não encontrado.</p>`;
    return;
  }

  try {
    const data = await fetchEntries('projeto'); // tipo de conteúdo no Contentful
    const projeto = data.items.find(item => item.fields.slug === slug);

    if (!projeto) {
      container.innerHTML = `<p>Projeto não encontrado.</p>`;
      return;
    }

    const { titulo, descricao, imagens = [] } = projeto.fields;

    // Título
    tituloEl.textContent = titulo;

    // Texto descritivo
    if (typeof descricao === 'string') {
      textoEl.innerHTML = descricao;
    } else if (descricao?.content) {
      // Caso venha como Rich Text do Contentful (não formatado)
      textoEl.innerHTML = '<p>Descrição disponível em breve.</p>';
    }

    // Imagens
    const imagensHtml = imagens.map(img => {
      const asset = data.includes.Asset.find(asset => asset.sys.id === img.sys.id);
      if (!asset) return '';
      const url = asset.fields.file.url;
      const alt = asset.fields.title || titulo;
      return `<img src="https:${url}" alt="${alt}" loading="lazy">`;
    }).join('');

    imagensEl.innerHTML = imagensHtml;

  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Erro ao carregar o projeto.</p>`;
  }

});
