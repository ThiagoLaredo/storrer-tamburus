function getOptimizedImage(url, { width, format = "webp", quality = 80 }) {
    if (!url) return "";
    const baseUrl = url.startsWith("//") ? `https:${url}` : url;
    return `${baseUrl}?w=${width}&fm=${format}&q=${quality}`;
  }
  
  /**
   * Mapeia entries do Contentful e adiciona URLs otimizadas das imagens
   */
  export function mapAssets(data) {
    if (!data || !data.items || !data.includes?.Asset) return [];
  
    // Cria um dicionário de assets para lookup rápido
    const assetsMap = {};
    for (const asset of data.includes.Asset) {
      assetsMap[asset.sys.id] = asset;
    }
  
    return data.items.map((item) => {
      const mappedItem = { ...item.fields };
  
      // percorre os fields para encontrar imagens
      for (const [key, value] of Object.entries(item.fields)) {
        if (value?.sys?.type === "Link" && value.sys.linkType === "Asset") {
          const asset = assetsMap[value.sys.id];
          if (asset?.fields?.file?.url) {
            const url = asset.fields.file.url;
  
            mappedItem[key] = {
              original: `https:${url}`,
              mobile: getOptimizedImage(url, { width: 600 }),
              desktop: getOptimizedImage(url, { width: 1980 }),
              srcset: `
                ${getOptimizedImage(url, { width: 600 })} 600w,
                ${getOptimizedImage(url, { width: 1200 })} 1200w,
                ${getOptimizedImage(url, { width: 1980 })} 1980w
              `,
            };
          }
        }
      }
  
      return mappedItem;
    });
  }
  