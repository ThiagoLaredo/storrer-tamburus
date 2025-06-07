const SPACE_ID = 'xcps7qy8mp38';
const ACCESS_TOKEN = 'tiNcarfk_a8YwEAoNaKCKtNnQglytJd7qobm5JnlHP4';
const ENVIRONMENT = 'master'; // ou outro se tiver

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

export async function fetchEntries(contentType) {
  const url = `${BASE_URL}/entries?access_token=${ACCESS_TOKEN}&content_type=${contentType}&include=2`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${contentType}: ${response.statusText}`);
  }
  return await response.json();
}
