import gsap from "gsap";

export function initHeroSlider() {
  const imagens = document.querySelectorAll(".hero-slideshow .destaque-imagem");
  if (!imagens.length) return;

  gsap.set(imagens, { autoAlpha: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" });
  gsap.set(imagens[0], { autoAlpha: 1 }); // primeira visível

  const tl = gsap.timeline({ repeat: -1 });
  imagens.forEach((img, i) => {
    const next = imagens[(i + 1) % imagens.length];
    tl.to(img, { autoAlpha: 0, duration: 1.5, delay: 3 }, `slide${i}`)
      .to(next, { autoAlpha: 1, duration: 1.5 }, `slide${i}+=1.5`);
  });
}
