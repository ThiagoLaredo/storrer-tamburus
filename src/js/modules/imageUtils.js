// src/js/modules/imageUtils.js
export function buildResponsiveImage(
    url,
    alt,
    { isLCP = false, widths = [480, 768, 1200, 1920, 3840] } = {}
  ) {
    if (!url) return '';
  
    // Garante que os URLs não sejam escapados
    const cleanUrl = url.replace(/&amp;/g, '&');
  
    // Srcset AVIF
    const avifSrcset = widths
      .map(w => `${cleanUrl}?w=${w}&fm=avif&q=85 ${w}w`)
      .join(', ');
  
    // Srcset WebP
    const webpSrcset = widths
      .map(w => `${cleanUrl}?w=${w}&fm=webp&q=85 ${w}w`)
      .join(', ');
  
    // Srcset JPG fallback
    const jpgSrcset = widths
      .map(w => `${cleanUrl}?w=${w}&fm=jpg&q=85 ${w}w`)
      .join(', ');
  
    // Src de fallback
    const fallbackSrc = `${cleanUrl}?w=1200&fm=jpg&q=85`;
  
    return `
      <picture>
        <source srcset="${avifSrcset}" sizes="100vw" type="image/avif">
        <source srcset="${webpSrcset}" sizes="100vw" type="image/webp">
        <img
          src="${fallbackSrc}"
          srcset="${jpgSrcset}"
          sizes="100vw"
          alt="${alt || ''}"
          class="projeto-imagem destaque-imagem
          loading="${isLCP ? 'eager' : 'lazy'}"
          ${isLCP ? 'fetchpriority="high"' : ''}
          decoding="async"
        >
      </picture>
    `;
  }
  