import "../../css/global.css";
import "../../css/terms-page.css";
import "../../css/header.css";
import "../../css/footer.css";
import "../../css/menu-mobile.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/formulario-contato.css";

import MenuMobile from '../modules/menu-mobile.js';
import HeaderScroll from '../modules/header-scroll.js';
import HeaderManager from '../modules/HeaderManager.js';
import FormHandler from '../modules/formHandler.js';
import { initPageOpenAnimations, initScrollAnimations } from '../modules/animations.js';

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa o menu mobile com submenu integrado, caso os elementos existam
    const menuMobile = new MenuMobile(
        '[data-menu="logo"]',
        '[data-menu="button"]',
        '[data-menu="list"]',
        '[data-menu="contato-mobile"]',
        '[data-menu="whatsapp"]',
        '[data-menu="linkedin"]',
        '[data-menu="instagram"]',
        '.header_acoes' // Novo parâmetro
    );
    if (menuMobile) {
        menuMobile.init();
    } else {
    }

    // 1. INICIALIZE O HEADER MANAGER PRIMEIRO (novo código)
    const headerManager = new HeaderManager('.header');

    // 2. DEPOIS INICIALIZE O HEADER SCROLL (código existente)
    const headerEl = document.querySelector('.header');
    if (headerEl) {
        const headerScroll = new HeaderScroll('.header');
        headerScroll.init();
    }

    const thumbnailEl = document.querySelector('#videoThumbnail');
    if (thumbnailEl) {
      const videoPopup = new VideoPopup(
        '#videoThumbnail',
        '#videoPopup',
        '#videoElement', 
        '#closePopup',
        '../videos/lancamento.mp4'
      );
      videoPopup.init();
    }

    // Animações de abertura e scroll
    initPageOpenAnimations();
    initScrollAnimations();

    // Inicializa a classe
    new FormHandler('.contact-form');
});