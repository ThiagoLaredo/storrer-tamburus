import { client } from './contentfulAPI';

async function carregarProjeto() {
  const slug = window.location.pathname.split('/').pop().replace('.html', '');

  const entries = await client.getEntries({
    content_type: 'projeto',
    'fields.slug': slug,
    include: 2,
  });

  const projeto = entries.items[0].fields;

  const container = document.querySelector('#projeto-container');

  container.innerHTML = `
    <h1>${projeto.title}</h1>
    <p>${projeto.descricao}</p>
    ${projeto.galeria.map(img => `<img src="${img.fields.file.url}" />`).join('')}
  `;
}

carregarProjeto();
