import { initHeroSlider } from "./heroSlider.js";
import { buildResponsiveImage } from "./imageUtils.js";
import { animateFirstHeroImage } from "./heroAnimations.js";

export function renderDestaques(container, projetos) {
  if (!container) return;

  container.innerHTML = "";

  if (!projetos || projetos.length === 0) {
    container.innerHTML = '<p class="sem-projetos">Nenhum destaque encontrado</p>';
    return;
  }

  container.innerHTML = `
    <div class="hero-slideshow">
      ${projetos
        .map(
          (projeto, index) => `
            <div class="destaque-slide">
              ${buildResponsiveImage(projeto.capa, projeto.title, {
                isLCP: index === 0,
                className: "destaque-imagem"
              })}
              <div class="overlay"></div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  initHeroSlider();

  // anima só a primeira imagem uma vez na abertura
  animateFirstHeroImage(".hero-slideshow");
}