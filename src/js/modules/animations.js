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

export const initProjetoAnimations = () => {
  const pageOpenTL = initPageOpenAnimations();
  const projectTL = gsap.timeline({ paused: true });

  // 1. Configuração inicial garantida
  gsap.set(['#projeto-titulo', '#projeto-local', '#projeto-ano', '#projeto-area', '#projeto-texto p'], {
    opacity: 0,
    y: 20,
    visibility: 'hidden'
  });

  gsap.set('.projeto-metadados-topo', {
    'border-bottom-width': 0,
    opacity: 1 // Container visível, só a borda animada
  });

  // 2. Sequência principal
  projectTL
    // Título
    .to('#projeto-titulo', {
      opacity: 1,
      y: 0,
      visibility: 'visible',
      duration: 1,
      ease: 'power2.out'
    })
    // Container dos metadados (sem animação de opacity)
    .to('.projeto-metadados-topo', {
      'border-bottom-width': '1px',
      duration: 0.8,
      ease: 'power1.out',
      onStart: () => {
        document.querySelector('.projeto-metadados-topo').classList.add('animado');
      }
    }, '+=0.2')
    // Itens individuais
    .to(['#projeto-local', '#projeto-ano', '#projeto-area'], {
      opacity: 1,
      y: 0,
      visibility: 'visible',
      duration: 0.6,
      stagger: 0.1,
      ease: 'power1.out'
    }, '-=0.5') // Overlap com a borda
    // Parágrafos
    .to('#projeto-texto p', {
      opacity: 1,
      y: 0,
      visibility: 'visible',
      duration: 0.5,
      stagger: 0.1,
      ease: 'power1.out'
    });

  // 3. Disparo sincronizado
  pageOpenTL.eventCallback('onComplete', () => {
    // Garante que todos os elementos estão no estado inicial
    gsap.set('.projeto-metadados-topo', { 'border-bottom-width': 0 });
    document.querySelector('.projeto-metadados-topo').classList.remove('animado');
    
    projectTL.play();
  });

  return projectTL;
};

export const initProjetoGalleryAnimations = () => {
  document.querySelectorAll('.galeria-item').forEach((item, index) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      onStart: () => {
        item.style.visibility = 'visible';
      }
    });
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
      
      state.hoverTween = gsap.to(btn, {
        '--circle-opacity': 1,
        '--circle-scale': 1.5,
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
      
      state.hoverTween = gsap.to(btn, {
        '--circle-opacity': 0,
        '--circle-scale': 0,
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
      gsap.to(btn, {
        '--circle-opacity': 1,
        '--circle-scale': 1.5,
        duration: 0.4,
        ease: 'back.out(1.5)',
        overwrite: 'auto'
      });
      btn.classList.add('ativo');
      state.active = true;
    } else {
      gsap.to(btn, {
        '--circle-opacity': 0,
        '--circle-scale': 0,
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