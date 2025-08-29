import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);


export const initPageOpenAnimations = () => {
  // 1. Remova a classe preload imediatamente
  document.body.classList.remove("preload");
  
  // 2. Adicione classe de controle no body
  document.body.classList.add('menu-animating');

  // 3. Configuração inicial - ESCONDER TUDO
  gsap.set("[data-menu='logo'], [data-menu='button-menu'], .menu-institutional li, #menu-projetos > li > a", {
    opacity: 0,
    y: 10
  });

  // prepara também o título e a barrinha
  gsap.set("#projeto-titulo", { opacity: 0, x: -20 });
  gsap.set("#projeto-titulo .barra", { scaleY: 0, transformOrigin: "bottom" });

  // === NOVO: Configurar primeiro slide ===
  const firstSlide = document.querySelector('.swiper-slide:first-child');
  if (firstSlide) {
    // Esconder elementos do primeiro slide
    gsap.set(firstSlide.querySelectorAll('.projetos-titulo, .projeto-plus, .projeto-imagem, .projeto-descricao'), {
      opacity: 0,
      y: 30
    });
  }

  // 4. Timeline principal
  const tl = gsap.timeline({ 
    defaults: { ease: "power3.out" },
    onComplete: () => {
      document.body.classList.remove('menu-animating');
      document.body.classList.add('menu-visible');
    }
  });

  // === NOVO: ANIMAÇÃO DO PRIMEIRO SLIDE (começa primeiro) ===
  if (firstSlide) {
    // Elementos do slide para animar
    const slideElements = firstSlide.querySelectorAll('.projetos-titulo, .projeto-plus, .projeto-imagem, .projeto-descricao');
    
    // Animação do primeiro slide - começa imediatamente
    tl.to(slideElements, {
      opacity: 1,
      y: 0,
      duration: 9,
      stagger: 0.15,
      ease: "back.out(1.4)"
    }, 0); // Inicia no tempo 0 da timeline
  }

  // Logo (agora começa depois do slide)
  tl.to("[data-menu='logo']", {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, firstSlide ? 0.6 : 0); // Atraso se houver slide

  // Botão Menu
  tl.to("[data-menu='button-menu']", {
    opacity: 1,
    duration: 0.6
  }, firstSlide ? 0.8 : 0.2);

  // Menu Projetos
  tl.to("#menu-projetos > li > a", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1
  }, firstSlide ? 1.0 : 0.4);

  // Menu Institucional
  tl.to(".menu-institutional li", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1
  }, firstSlide ? 0.8 : 0.2);

  // título do projeto
  tl.to("#projeto-titulo", {
    opacity: 1,
    x: 0,
    duration: 0.8
  }, firstSlide ? 1.2 : 0.8);

  // barrinha
  tl.to("#projeto-titulo .barra", {
    scaleY: 1,
    duration: 0.6,
    ease: "power3.out"
  }, firstSlide ? "-=0.2" : "-=0.4");

  // Itens do Menu Principal
  const animateMenuItems = () => {
    tl.to("#menu-projetos > li > a", {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.5,
      onStart: () => {
        document.body.classList.add('menu-animating');
      }
    }, firstSlide ? 1.0 : 0.4);
  };

  // Verificação e observer para itens dinâmicos
  if (document.querySelectorAll('#menu-projetos > li > a').length > 0) {
    animateMenuItems();
  } else {
    const observer = new MutationObserver((mutations) => {
      if (document.querySelectorAll('#menu-projetos > li > a').length > 0) {
        animateMenuItems();
        observer.disconnect();
      }
    });
    
    observer.observe(document.getElementById('menu-projetos'), {
      childList: true,
      subtree: true
    });
  }

  // Animação dos elementos .page-open-animate (com delay maior)
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
          delay: (firstSlide ? 1.5 : 0.8) + (i * 0.1),
          ease: "back.out(1.4)"
        }
      );
    } else {
      gsap.set(el, { opacity: 1 });
    }
  });

  return tl;
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

// Objeto para controlar o estado
const hoverStates = new WeakMap();

export const setupFilterAnimations = (container) => {
  const buttons = container.querySelectorAll('.filtro-btn');
  
  buttons.forEach(btn => {
    // Inicializa o estado
    hoverStates.set(btn, {
      hoverTween: null,
      active: false
    });

    // Animação hover - versão robusta
    btn.addEventListener('mouseenter', () => {
      const state = hoverStates.get(btn);
      
      // Se já está ativo ou já tem hover, ignora
      if (btn.classList.contains('ativo') || state.hoverTween) return;
      
      // Cancela qualquer animação existente
      if (state.hoverTween) state.hoverTween.kill();
      
      // Define a origem para a esquerda (entrada)
      gsap.set(btn, {'--barra-origin': 'left'});
      
      state.hoverTween = gsap.to(btn, {
        '--barra-opacity': 1,
        '--barra-width': '100%',
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          state.hoverTween = null;
        }
      });
    });

    btn.addEventListener('mouseleave', () => {
      const state = hoverStates.get(btn);
      
      // Se está ativo, mantém o estado
      if (btn.classList.contains('ativo')) return;
      
      // Cancela a animação de entrada se estiver ocorrendo
      if (state.hoverTween) state.hoverTween.kill();
      
      // Define a origem para a direita (saída)
      gsap.set(btn, {'--barra-origin': 'right'});
      
      state.hoverTween = gsap.to(btn, {
        '--barra-opacity': 0,
        '--barra-width': '0%',
        duration: 0.2,
        ease: 'power1.in',
        onComplete: () => {
          state.hoverTween = null;
        }
      });
    });
  });
};

export const toggleActiveFilter = (activeBtn) => {
  const buttons = activeBtn.closest('ul').querySelectorAll('.filtro-btn');
  
  buttons.forEach(btn => {
    const state = hoverStates.get(btn);
    const isActive = btn === activeBtn;
    
    // Cancela qualquer animação em andamento
    if (state.hoverTween) {
      state.hoverTween.kill();
      state.hoverTween = null;
    }
    
    if (isActive) {
      // Define a origem para a esquerda (ativação)
      gsap.set(btn, {'--barra-origin': 'left'});
      
      gsap.to(btn, {
        '--barra-opacity': 1,
        '--barra-width': '100%',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      btn.classList.add('ativo');
      state.active = true;
    } else {
      // Define a origem para a direita (desativação)
      gsap.set(btn, {'--barra-origin': 'right'});
      
      gsap.to(btn, {
        '--barra-opacity': 0,
        '--barra-width': '0%',
        duration: 0.3,
        overwrite: 'auto'
      });
      btn.classList.remove('ativo');
      state.active = false;
    }
  });
};

// Função para limpar animações
export const cleanupFilterAnimations = (container) => {
  const buttons = container.querySelectorAll('.filtro-btn');
  buttons.forEach(btn => {
    const state = hoverStates.get(btn);
    if (state?.hoverTween) state.hoverTween.kill();
    hoverStates.delete(btn);
  });
};
