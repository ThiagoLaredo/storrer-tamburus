import gsap from "gsap";
import { initPageOpenAnimations } from "../modules/animations.js";

export function animateFirstHeroImage(containerSelector = ".hero-slideshow") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const firstSlide = container.querySelector(".destaque-slide");
  if (!firstSlide) return;

  // agora pega corretamente o <img>
  const image = firstSlide.querySelector(".destaque-imagem");
  const overlay = firstSlide.querySelector(".overlay");

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // 1. Imagem aparece (de cima para baixo)
  if (image) {
    gsap.set(image, { clipPath: "inset(0 0 100% 0)" });
    tl.to(image, {
      clipPath: "inset(0 0 0% 0)",
      duration: 1.2
    });
  }

  // 2. Overlay entra logo depois
  if (overlay) {
    gsap.set(overlay, { opacity: 0 });
    tl.to(overlay, {
      opacity: 1,
      duration: 0.8
    }, "-=0.6"); // começa antes de a imagem terminar
  }

  // 3. Header só depois do overlay
  tl.add(initPageOpenAnimations(), ">");

  return tl;
}