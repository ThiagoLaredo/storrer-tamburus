import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export const initPageOpenAnimations = () => {
  // 1. Remova a classe preload imediatamente
  document.body.classList.remove("preload");
  
  // 2. Adicione classe de controle no body
  document.body.classList.add('menu-animating');

  // 3. Configuração inicial - apenas para elementos não-dinâmicos
  gsap.set("[data-menu='logo'], [data-menu='button'], .header_acoes a", {
    opacity: 0
  });

  // 4. Timeline principal
  const tl = gsap.timeline({ 
    defaults: { ease: "power3.out" },
    onComplete: () => {
      document.body.classList.remove('menu-animating');
      document.body.classList.add('menu-visible');
    }
  });

  // Logo
  tl.to("[data-menu='logo']", {
    opacity: 1,
    duration: 0.8
  });

  // Botão Menu
  tl.to("[data-menu='button']", {
    opacity: 1,
    duration: 0.6
  }, 0.2);

  // Itens do Menu - abordagem robusta
  const animateMenuItems = () => {
    // Força reset da opacidade antes de animar
    gsap.set("#menu > li > a", { opacity: 0 });
    
    tl.to("#menu > li > a", {
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      onStart: () => {
        // Garante que o CSS não vai interferir
        document.body.classList.add('menu-animating');
      }
    }, 0.3);
  };

  // Verifica se os itens já existem
  if (document.querySelectorAll('#menu > li > a').length > 0) {
    animateMenuItems();
  } else {
    // Observador para quando os itens forem adicionados
    const observer = new MutationObserver((mutations) => {
      if (document.querySelectorAll('#menu > li > a').length > 0) {
        animateMenuItems();
        observer.disconnect();
      }
    });
    
    observer.observe(document.getElementById('menu'), {
      childList: true,
      subtree: true
    });
  }

  // Restante das suas animações originais...
  // Botões Ação com stagger
  tl.to(".header_acoes a", {
    opacity: 1,
    stagger: 0.15,
    duration: 0.5
  }, 0.5);

  // Animação dos elementos .page-open-animate
  document.querySelectorAll('.page-open-animate').forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const isAboveFold = rect.top < window.innerHeight;

    if (isAboveFold) {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.8 + (i * 0.1),
          ease: "back.out(1.4)"
        }
      );
    } else {
      gsap.set(el, { opacity: 1 });
    }
  });

  return tl;
};


export const initGalleryAnimations = () => {
  // Configuração inicial - prepara os elementos
  gsap.set('.projeto-item', {
    opacity: 0,
    y: 30
  });

  // Animação de entrada
  gsap.to('.projeto-item', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.2)',
    delay: 0.3
  });
};


  export function initScrollAnimations() {
  
    const elements = document.querySelectorAll(".animate-me");
  
    elements.forEach((el, index) => {
  
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 100%",
          toggleActions: "play none none none",
          markers: false,
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      });
    });
  }