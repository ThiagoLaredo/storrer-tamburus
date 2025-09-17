/**
 * Gera URLs otimizadas de imagens do Contentful com srcset
 * @param {string} url - URL base vinda do Contentful (ex: fields.file.url)
 * @param {string} alt - Texto alternativo da imagem
 * @param {Object} options - Configurações extras
 * @param {number[]} [options.widths=[400, 800, 1200, 1600]] - Larguras desejadas
 * @param {string} [options.sizes="(max-width: 600px) 400px, (max-width: 1024px) 800px, 1200px"] - Atributo sizes
 * @param {number} [options.quality=80] - Qualidade da imagem
 * @returns {string} HTML <img> pronto para inserir
 */
export function generateContentfulImage(url, alt = "", options = {}) {
    if (!url) return "";
  
    const {
      widths = [400, 800, 1200, 1600],
      sizes = "(max-width: 600px) 400px, (max-width: 1024px) 800px, 1200px",
      quality = 80
    } = options;
  
    // Garantir https (às vezes o Contentful manda só //images.ctfassets.net/...)
    const baseUrl = url.startsWith("http") ? url : `https:${url}`;
  
    // Monta srcset
    const srcset = widths
      .map(w => `${baseUrl}?w=${w}&q=${quality}&fm=auto ${w}w`)
      .join(", ");
  
    // Usa a maior versão como fallback no src
    const src = `${baseUrl}?w=${Math.max(...widths)}&q=${quality}&fm=auto`;
  
    return `
      <img 
        src="${src}" 
        srcset="${srcset}" 
        sizes="${sizes}" 
        alt="${alt}" 
        loading="lazy"
        decoding="async"
      />
    `;
  }  