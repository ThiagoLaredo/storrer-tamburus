// import { SwiperGallery } from './swiper-gallery.js';
// import { gsap } from 'gsap';

// export function renderGaleria(container, projetos) {
//   if (!container) return;

//   // Limpa o container
//   container.innerHTML = '';

//   if (!projetos || projetos.length === 0) {
//     container.innerHTML = '<p class="sem-projetos">Nenhum projeto encontrado</p>';
//     return;
//   }

//   // Cria a estrutura do Swiper
//   container.innerHTML = `
//     <div class="swiper">
//       <div class="swiper-wrapper">
//         ${projetos.map((projeto, index) => `
//           <div class="swiper-slide">
//             <div class="projeto-slide">
//               ${projeto.capa ? `
//                 <picture>
//                   <!-- WebP otimizado -->
//                   <source 
//                     srcset="
//                       ${projeto.capa}?w=480&fm=webp&q=85 480w,
//                       ${projeto.capa}?w=768&fm=webp&q=85 768w,
//                       ${projeto.capa}?w=1200&fm=webp&q=85 1200w,
//                       ${projeto.capa}?w=1920&fm=webp&q=85 1920w,
//                       ${projeto.capa}?w=3840&fm=webp&q=85 3840w
//                     "
//                     sizes="100vw"
//                     type="image/webp"
//                   >
//                   <!-- JPEG fallback -->
//                   <img 
//                     src="${projeto.capa}?w=1200&fm=jpg&q=85" 
//                     srcset="
//                       ${projeto.capa}?w=480&fm=jpg&q=85 480w,
//                       ${projeto.capa}?w=768&fm=jpg&q=85 768w,
//                       ${projeto.capa}?w=1200&fm=jpg&q=85 1200w,
//                       ${projeto.capa}?w=1920&fm=jpg&q=85 1920w,
//                       ${projeto.capa}?w=3840&fm=jpg&q=85 3840w
//                     "
//                     sizes="100vw"
//                     alt="${projeto.title}" 
//                     class="projeto-imagem"
//                     loading="lazy"
//                   >
//                 </picture>
//               ` : `
//                 <div class="projeto-imagem placeholder"></div>
//               `}
//               <div class="overlay"></div>
//               <div class="container">
//                 <a href="/projetos/${projeto.slug}" class="projeto-link">
//                   <h3 class="projetos-titulo" data-slide-index="${index}">${projeto.title}</h3>
//                   <span class="projeto-plus">
//                     <i class="fa-solid fa-chevron-right"></i>
//                   </span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         `).join('')}
//       </div>
//       <!-- Bullets -->
//       <div class="swiper-pagination"></div>
//     </div>
//   `;

//   // Inicializa o Swiper com callbacks para animação
//   const swiperOptions = {
//     pagination: {
//       el: '.swiper-pagination',
//       clickable: true,
//     },
//     on: {
//       init: function () {
//         animateTitleOnSlideChange(this.activeIndex);
//       },
//       slideChangeTransitionStart: function () {
//         const currentTitle = document.querySelector('.swiper-slide-active .projetos-titulo');
//         const currentIcon = document.querySelector('.swiper-slide-active .projeto-plus');
        
//         if (currentTitle && currentIcon) {
//           gsap.to([currentTitle, currentIcon], {
//             y: 20,
//             opacity: 0,
//             duration: 0.3,
//             ease: 'power1.in',
//           });
//         }
//       },
//       slideChangeTransitionEnd: function () {
//         animateTitleOnSlideChange(this.activeIndex);
//       }
//     }
//   };

//   const swiper = new SwiperGallery('.swiper', swiperOptions);
//   swiper.init();
// }

// // Função para animar tanto o título quanto o ícone
// function animateTitleOnSlideChange(slideIndex) {
//   const activeSlide = document.querySelector('.swiper-slide-active');
//   if (!activeSlide) return;

//   const title = activeSlide.querySelector('.projetos-titulo');
//   const plusIcon = activeSlide.querySelector('.projeto-plus');

//   if (!title || !plusIcon) return;

//   gsap.set([title, plusIcon], {
//     y: -15,
//     opacity: 0,
//   });

//   const tl = gsap.timeline();

//   tl.to(title, {
//     y: 0,
//     opacity: 1,
//     duration: 0.6,
//     ease: 'power2.out',
//   }, 0)
//     .to(plusIcon, {
//       y: 0,
//       opacity: 1,
//       duration: 0.5,
//       ease: 'power2.out',
//       onComplete: function () {
//         gsap.set(plusIcon, { clearProps: 'transform' });
//       }
//     }, 0.05);

//   return tl;
// }






// import { SwiperGallery } from './swiper-gallery.js';
// import { gsap } from 'gsap';
// import { buildResponsiveImage } from './imageUtils.js';

// export function renderGaleria(container, projetos) {
//   if (!container) return;

//   container.innerHTML = '';

//   if (!projetos || projetos.length === 0) {
//     container.innerHTML = '<p class="sem-projetos">Nenhum projeto encontrado</p>';
//     return;
//   }

//   container.innerHTML = `
//     <div class="swiper">
//       <div class="swiper-wrapper">
//         ${projetos.map((projeto, index) => `
//           <div class="swiper-slide">
//             <div class="projeto-slide">
//               ${projeto.capa
//                 ? buildResponsiveImage(projeto.capa, projeto.title, { 
//                     isLCP: index === 0, 
//                     className: 'projeto-imagem' 
//                   })
//                 : '<div class="projeto-imagem placeholder"></div>'
//               }
//               <div class="overlay"></div>

//               <div class="container">
//                 <a href="/projetos/${projeto.slug}" class="projeto-link">
//                   <h3 class="projetos-titulo" data-slide-index="${index}">${projeto.title}</h3>
//                   <span class="projeto-plus">
//                     <i class="fa-solid fa-chevron-right"></i>
//                   </span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         `).join('')}
//       </div>
//       <div class="swiper-pagination"></div>
//     </div>
//   `;

//   const swiper = new SwiperGallery('.swiper', {
//     pagination: { el: '.swiper-pagination', clickable: true },
//     on: {
//       init() { 
//         animateTitleOnSlideChange();
//         animateLCPImage(); // nova função
//       },
//       slideChangeTransitionStart() {
//         const activeSlide = document.querySelector('.swiper-slide-active');
//         const title = activeSlide?.querySelector('.projetos-titulo');
//         const plusIcon = activeSlide?.querySelector('.projeto-plus');
//         if (title && plusIcon) {
//           gsap.to([title, plusIcon], {
//             y: 20,
//             opacity: 0,
//             duration: 0.3,
//             ease: 'power1.in',
//           });
//         }
//       },
//       slideChangeTransitionEnd() { animateTitleOnSlideChange(); }
//     }
//   });

//   swiper.init();
// }

// // Animação do título e ícone
// function animateTitleOnSlideChange() {
//   const activeSlide = document.querySelector('.swiper-slide-active');
//   if (!activeSlide) return;

//   const title = activeSlide.querySelector('.projetos-titulo');
//   const plusIcon = activeSlide.querySelector('.projeto-plus');
//   if (!title || !plusIcon) return;

//   gsap.set([title, plusIcon], { y: -15, opacity: 0 });

//   const tl = gsap.timeline();
//   tl.to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
//     .to(plusIcon, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', onComplete: () => gsap.set(plusIcon, { clearProps: 'transform' }) }, 0.05);
// }

// function animateLCPImage() {
//   const lcpImage = document.querySelector('.swiper-slide .lcp-image');
//   if (!lcpImage) return;

//   gsap.fromTo(lcpImage, 
//     { opacity: 0, scale: 1.05 },
//     { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
//   );
// }




// src/js/modules/renderProjetos.js
import { SwiperGallery } from './swiper-gallery.js';
import { gsap } from 'gsap';
import { buildResponsiveImage } from './imageUtils.js';

export function renderGaleria(container, projetos, options = {}) {
  if (!container) return;

  const { isDestaque = false } = options; // Detecta se é destaque/projetoRenderer

  container.innerHTML = '';

  if (!projetos || projetos.length === 0) {
    container.innerHTML = '<p class="sem-projetos">Nenhum projeto encontrado</p>';
    return;
  }

  container.innerHTML = `
    <div class="${isDestaque ? 'destaque-wrapper' : 'swiper'}">
      <div class="${isDestaque ? 'destaque-container' : 'swiper-wrapper'}">
        ${projetos.map((projeto, index) => `
          <div class="${isDestaque ? 'destaque-slide' : 'swiper-slide'}">
            <div class="projeto-slide">
              ${projeto.capa
                ? buildResponsiveImage(projeto.capa, projeto.title, { 
                    isLCP: index === 0,
                    className: 'projeto-imagem'
                  })
                : '<div class="projeto-imagem placeholder"></div>'
              }
              <div class="overlay"></div>

              <div class="container">
                <a href="/projetos/${projeto.slug}" class="projeto-link">
                  <h3 class="projetos-titulo" data-slide-index="${index}">${projeto.title}</h3>
                  <span class="projeto-plus">
                    <i class="fa-solid fa-chevron-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ${!isDestaque ? '<div class="swiper-pagination"></div>' : ''}
    </div>
  `;

  // Só inicializa Swiper se não for destaque
  if (!isDestaque) {
    const swiper = new SwiperGallery('.swiper', {
      pagination: { el: '.swiper-pagination', clickable: true },
      on: {
        init() { animateSlideIn(0); },
        slideChangeTransitionStart() {
          const activeSlide = document.querySelector('.swiper-slide-active');
          const title = activeSlide?.querySelector('.projetos-titulo');
          const plusIcon = activeSlide?.querySelector('.projeto-plus');
          if (title && plusIcon) {
            gsap.to([title, plusIcon], {
              y: 20,
              opacity: 0,
              duration: 0.3,
              ease: 'power1.in',
            });
          }
        },
        slideChangeTransitionEnd() {
          animateSlideIn(this.activeIndex);
        }
      }
    });
    swiper.init();
  } else {
    // Para Destaques/ProjetoRenderer: anima o primeiro slide apenas
    animateSlideIn(0);
  }

  function animateSlideIn(slideIndex) {
    const slides = container.querySelectorAll(isDestaque ? '.destaque-slide' : '.swiper-slide');
    const activeSlide = slides[slideIndex];
    if (!activeSlide) return;

    const title = activeSlide.querySelector('.projetos-titulo');
    const plusIcon = activeSlide.querySelector('.projeto-plus');
    const image = activeSlide.querySelector('.projeto-imagem');

    if (!title || !plusIcon || !image) return;

    gsap.set([title, plusIcon, image], { y: 30, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(image, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)
      .to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.3)
      .to(plusIcon, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.35);
  }
}

