// src/js/modules/imageUtils.js
export function buildResponsiveImage(
    url,
    alt,
    { isLCP = false, widths = [480, 768, 1200, 1920, 3840] } = {}
  ) {
    if (!url) return '';
  
    const webpSrcset = widths.map(w => `${url}?w=${w}&fm=webp&q=85 ${w}w`).join(', ');
    const jpgSrcset  = widths.map(w => `${url}?w=${w}&fm=jpg&q=85 ${w}w`).join(', ');
  
    const fallbackSrc = `${url}?w=1200&fm=jpg&q=85`;
  
    return `
      <picture>
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
  }
  