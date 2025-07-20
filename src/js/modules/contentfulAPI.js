const SPACE_ID = 'xcps7qy8mp38';
const ACCESS_TOKEN = 'tiNcarfk_a8YwEAoNaKCKtNnQglytJd7qobm5JnlHP4';
const ENVIRONMENT = 'master'; // ou outro se tiver

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

// export async function fetchEntries(contentType) {
//   const url = `${BASE_URL}/entries?access_token=${ACCESS_TOKEN}&content_type=${contentType}&include=2`;
  
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`Erro ao buscar ${contentType}: ${response.statusText}`);
//   }
//   return await response.json();
// }

export async function fetchEntries(contentType, queryParams = {}) {
  // URL base SEM include=2 inicial (vamos adicionar depois)
  let url = `${BASE_URL}/entries?access_token=${ACCESS_TOKEN}&content_type=${contentType}`;
  
  // Parâmetros fixos que sempre queremos
  const fixedParams = {
    include: 2 // Sempre queremos includes
  };

  // Combina parâmetros fixos com os dinâmicos
  const allParams = { ...fixedParams, ...queryParams };
  
  // Constrói a query string corretamente
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(allParams)) {
    if (value !== undefined && value !== null) {
      // Tratamento especial para campos booleanos
      if (key === 'fields.destaque') {
        params.append(key, value === true ? 'true' : 'false');
      } else {
        params.append(key, value);
      }
    }
  }
  
  url += `&${params.toString()}`;

  console.log('[DEBUG] URL final:', url); // Log crucial para debug

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[Contentful] Falha na requisição:', {
      url,
      error: error.message
    });
    throw error;
  }
}