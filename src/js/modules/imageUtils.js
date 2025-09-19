// src/js/modules/imageUtils.js
export function buildResponsiveImage(
    url,
    alt,
    { isLCP = false, widths = [480, 768, 1200, 1920, 3840] } = {}
  ) {
    if (!url) return '';
  
    const avifSrcset = widths
      .map(w => `${url}?w=${w}&fm=avif&q=85 ${w}w`)
      .join(', ');
  
    const webpSrcset = widths
      .map(w => `${url}?w=${w}&fm=webp&q=85 ${w}w`)
      .join(', ');
  
    const jpgSrcset = widths
      .map(w => `${url}?w=${w}&fm=jpg&q=85 ${w}w`)
      .join(', ');
  
    const fallbackSrc = `${url}?w=1200&fm=jpg&q=85`;
  
    // Monta o <picture>
    const pictureHTML = `
      <picture>
        <source srcset="${avifSrcset}" sizes="100vw" type="image/avif">
        <source srcset="${webpSrcset}" sizes="100vw" type="image/webp">
        <img
          src="${fallbackSrc}"
          srcset="${jpgSrcset}"
          sizes="100vw"
          alt="${alt || ''}"
          class="responsive-image"
          loading="${isLCP ? 'eager' : 'lazy'}"
          ${isLCP ? 'fetchpriority="high"' : ''}
          decoding="async"
        >
      </picture>
    `;
  
    // Se for LCP, gera também a tag <link rel="preload">
    const preloadHTML = isLCP
      ? `<link rel="preload" as="image" href="${fallbackSrc}" imagesrcset="${jpgSrcset}" imagesizes="100vw" type="image/jpeg">`
      : '';
  
    return { pictureHTML, preloadHTML };
  }
  