import "../../css/global.css";
import "../../css/recursos.css";
import "../../css/header.css";
import "../../css/footer.css";
import "../../css/menu-mobile.css";
import "../../css/cores.css";
import "../../css/componentes.css";
import "../../css/formulario-contato.css";
import "../../css/creators.css";

import MenuMobile from '../modules/menu-mobile.js';
import HeaderScroll from '../modules/header-scroll.js';
import HeaderManager from '../modules/HeaderManager.js';
import FormHandler from '../modules/formHandler.js';
import { initPageOpenAnimations, initScrollAnimations } from '../modules/animations.js';
import { SwiperDepoimentos } from '../modules/SwiperDepoimentos.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado.");

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
        console.log('MenuMobile initialized successfully');
        menuMobile.init();
    } else {
        console.error('MenuMobile failed to initialize');
    }
    
    // 1. INICIALIZE O HEADER MANAGER PRIMEIRO (novo código)
    const headerManager = new HeaderManager('.header');

    // 2. DEPOIS INICIALIZE O HEADER SCROLL (código existente)
    const headerEl = document.querySelector('.header');
    if (headerEl) {
        const headerScroll = new HeaderScroll('.header');
        headerScroll.init();
    }

    // Animações de abertura e scroll
    initPageOpenAnimations();
    initScrollAnimations();

    // Inicializa a classe
    new FormHandler('.contact-form');

    // Verifica se estamos na página de creators
    if (document.querySelector('.page-creators')) {
        // Inicializa o Swiper apenas se o elemento existir
        const swiperContainer = document.querySelector('.swiper-depoimentos');
        if (swiperContainer) {
            new SwiperDepoimentos();
        } else {
            console.warn('Container do Swiper não encontrado na página creators');
        }
    }
});