// import gsap from "gsap";



// export function animateFirstSlide(slide, { extraElements = [] } = {}) {
//   if (!slide) return;

//   const title = slide.querySelector('.projetos-titulo') || slide.querySelector('#projeto-titulo');
//   const plusIcon = slide.querySelector('.projeto-plus');
//   const barra = slide.querySelector('.barra');           // ProjetoRenderer
//   const image = slide.querySelector('.projeto-imagem');

//   const elements = [title, plusIcon, image, ...extraElements].filter(Boolean);

//   // anima barra separadamente
//   if (barra) {
//     gsap.set(barra, { scaleY: 0, transformOrigin: "bottom" });
//   }

//   if (elements.length) {
//     gsap.set(elements, { opacity: 0, y: 30 });
//   }

//   // animação principal
//   gsap.to(elements, {
//     opacity: 1,
//     y: 0,
//     duration: 0.8,
//     stagger: 0.15,
//     ease: "power2.out"
//   });

//   // animação da barra
//   if (barra) {
//     gsap.to(barra, {
//       scaleY: 1,
//       duration: 0.6,
//       delay: 0.3, // começa depois do título
//       ease: "power2.out"
//     });
//   }
// }

// export function animateSlideChange(slide) {
//   if (!slide) return;

//   const title = slide.querySelector('.projetos-titulo') || slide.querySelector('#projeto-titulo');
//   const plusIcon = slide.querySelector('.projeto-plus');
//   const barra = slide.querySelector('.barra'); // ProjetoRenderer

//   const elements = [title, plusIcon].filter(Boolean);

//   if (elements.length) {
//     gsap.fromTo(elements, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" });
//   }

//   // anima barra separadamente
//   if (barra) {
//     gsap.fromTo(barra, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out" });
//   }
// }

import gsap from "gsap";
import { initPageOpenAnimations } from './animations.js';

export function animateFirstSlide(slide) {
  if (!slide) return;

  // Seleciona elementos comuns
  const title = slide.querySelector('.projetos-titulo') || document.querySelector('#projeto-titulo');
  const plusIcon = slide.querySelector('.projeto-plus');
  const barra = slide.querySelector('.barra') || document.querySelector('#projeto-titulo .barra');
  const image = slide.querySelector('.projeto-imagem');
  const overlay = slide.querySelector('.overlay');

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // 1. Animação da imagem de cima para baixo
  if (image) {
    gsap.set(image, { clipPath: "inset(0 0 100% 0)" });
    tl.to(image, {
      clipPath: "inset(0 0 0% 0)",
      duration: 1.2
    });
  }

  // 2. Overlay logo depois da imagem
  if (overlay) {
    gsap.set(overlay, { opacity: 0 });
    tl.to(overlay, {
      opacity: 1,
      duration: 0.8
    }, "-=0.6"); // começa antes da imagem terminar, sobreposição suave
  }

  // 3. Header animado após imagem e overlay
  // initPageOpenAnimations retorna uma timeline, então podemos encadear
  tl.add(initPageOpenAnimations(), "-=0.3"); // começa um pouco antes do overlay terminar

  // 4. Título, barra e plus animam rapidamente em sequência
  if (title) gsap.set(title, { opacity: 0, y: 20 });
  if (barra) gsap.set(barra, { scaleY: 0, transformOrigin: "bottom" });
  if (plusIcon) gsap.set(plusIcon, { opacity: 0, y: 20 });

  tl.to([title, plusIcon], {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1
  }, ">"); // começa imediatamente após o header

  if (barra) {
    tl.to(barra, {
      scaleY: 1,
      duration: 0.5
    }, "<"); // anima junto do título para não demorar
  }

  return tl;
}





export function animateSlideChange(slide) {
  if (!slide) return;

  const title = slide.querySelector('.projetos-titulo') || slide.querySelector('#projeto-titulo');
  const plusIcon = slide.querySelector('.projeto-plus');
  const barra = slide.querySelector('.barra'); // ProjetoRenderer

  const elements = [title, plusIcon].filter(Boolean);

  if (elements.length) {
    gsap.fromTo(elements, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" });
  }

  // anima barra separadamente
  if (barra) {
    gsap.fromTo(barra, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out" });
  }
}