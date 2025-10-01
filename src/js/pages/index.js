import "../../css/global.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/header.css";
import "../../css/menu-mobile.css";
import "../../css/home.css";

import MenuMobile from '../modules/menu-mobile.js';
import { fetchEntries } from '../modules/contentfulAPI.js';
import { renderDestaques } from '../modules/renderDestaques.js';
import { renderFiltros } from '../modules/filterMenu.js';

document.addEventListener('DOMContentLoaded', async () => {

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

  // ========== CARREGAMENTO DOS DESTAQUES ==========

  try {
    // 1. Busca APENAS projetos marcados como destaque
    const response = await fetchEntries('projeto', { 'fields.destaque': true, limit: 8 });

    console.log('Resposta filtrada por destaque:', {
      total: response.total,
      items: response.items.map(i => i.fields.titulo)
    });

    // 2. Processamento seguro das imagens
    const destaques = response.items.map(item => {
      let capaUrl = '';
      if (item.fields.capa?.sys?.id) {
        const capaId = item.fields.capa.sys.id;
        const capaAsset = response.includes?.Asset?.find(a => a.sys.id === capaId);
        if (capaAsset?.fields?.file?.url) {
          capaUrl = `https:${capaAsset.fields.file.url}`;
        }
      }

      return {
        title: item.fields.titulo,
        slug: item.fields.slug,
        capa: capaUrl,
        isDestaque: item.fields.destaque // Para debug
      };
    });

    console.log('Destaques processados:', destaques);

    // 3. Renderização condicional
    if (destaques.length > 0) {
      renderDestaques(document.getElementById('destaques'), destaques);
    } else {
      console.error('Nenhum destaque encontrado após filtro');
      // Fallback opcional aqui
    }

  } catch (error) {
    console.error("Erro ao carregar destaques:", error);
  }
});