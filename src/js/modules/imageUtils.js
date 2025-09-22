
export function buildResponsiveImage(
    url,
    alt,
    { isLCP = false, widths = [480, 768, 1200, 1920, 3840], className = '' } = {}
  ) {
    if (!url) return '';
  
    const cleanUrl = url.replace(/&amp;/g, '&');
  
    const avifSrcset = widths.map(w => `${cleanUrl}?w=${w}&fm=avif&q=85 ${w}w`).join(', ');
    const webpSrcset = widths.map(w => `${cleanUrl}?w=${w}&fm=webp&q=85 ${w}w`).join(', ');
    const jpgSrcset = widths.map(w => `${cleanUrl}?w=${w}&fm=jpg&q=85 ${w}w`).join(', ');
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
          class="${className}"
          loading="${isLCP ? 'eager' : 'lazy'}"
          ${isLCP ? 'fetchpriority="high"' : ''}
          decoding="async"
        >
      </picture>
    `;
  }
   
  