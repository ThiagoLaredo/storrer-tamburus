import "../../css/global.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/header.css";
import "../../css/menu-mobile.css";
import "../../css/footer.css";
import "../../css/contato.css";

import MenuMobile from '../modules/menu-mobile.js';
import HeaderScroll from '../modules/header-scroll.js';
import HeaderManager from '../modules/HeaderManager.js';
import { initPageOpenAnimations, initScrollAnimations } from '../modules/animations.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ========== COMPORTAMENTO DO LOGO ==========
  document.querySelectorAll('.home-link, [data-menu="logo"]').forEach(link => {
    link.addEventListener('click', () => {
      localStorage.removeItem('lastFilter');
    });
  });

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

  

  const headerManager = new HeaderManager('.header');
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const headerScroll = new HeaderScroll('.header');
    headerScroll.init();
  }
  
  
  // ========== ANIMAÇÕES ==========
  initPageOpenAnimations();
  initScrollAnimations();
  

  });