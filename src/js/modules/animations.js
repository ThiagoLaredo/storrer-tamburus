import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export const initPageOpenAnimations = () => {
  // 1. Configuração INICIAL (só prepara os elementos sem mover)
  gsap.set("[data-menu='logo'], [data-menu='button'], #menu > li > a, #menu > li > span, .header_acoes a", {
      opacity: 0 // Só controlamos a opacidade inicial
  });

  gsap.set(".page-open-animate", {
      opacity: 0,
      y: 0 // Garante posição Y inicial zerada
  });

  // 2. Timeline PRINCIPAL
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  
  // Logo (0.2s)
  tl.to("[data-menu='logo']", {
      opacity: 1,
      duration: 0.8
  });

  // Botão Menu (0.3s)
  tl.to("[data-menu='button']", {
      opacity: 1,
      duration: 0.6
  }, 0.2);

  // Itens do Menu (0.4s com stagger)
  tl.to("#menu > li > a, #menu > li > span", {
      opacity: 1,
      stagger: 0.1,
      duration: 0.5
  }, 0.3);

  // Botões Ação (0.6s)
  tl.to(".header_acoes a", {
      opacity: 1,
      stagger: 0.15,
      duration: 0.5
  }, 0.5);

  // 3. Animação DOS ELEMENTOS DA SECTION (com verificação de posição)
  document.querySelectorAll('.page-open-animate').forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight;
      
      // Só anima se estiver na área visível inicial
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
          // Mantém visível se já estiver abaixo do fold
          gsap.set(el, { opacity: 1 });
      }
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