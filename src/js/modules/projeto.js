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
    ${projeto.galeria.map(img => `<img src="${img.fields.file.url}" loading="lazy" alt="${projeto.title}">`).join('')}
  `;

  // --- SEO Dinâmico ---
  const title = `${projeto.title} | Storrer Tamburus`;
  const description = projeto.descricao?.substring(0, 160) || 'Projeto de arquitetura e interiores da Storrer Tamburus.';

  document.title = title;

  function setMeta(name, content) {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  function setOG(property, content) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.content = content;
    document.head.appendChild(meta);
  }

  // Meta description
  setMeta('description', description);

  // Open Graph
  setOG('og:title', title);
  setOG('og:description', description);
  setOG('og:type', 'website');
  setOG('og:url', window.location.href);

  // Twitter Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);

  // Imagem destacada (se houver)
  if (projeto.galeria && projeto.galeria.length > 0) {
    const imageUrl = projeto.galeria[0].fields.file.url;

    setOG('og:image', imageUrl);
    setOG('og:image:width', '1200');
    setOG('og:image:height', '630');
    setMeta('twitter:image', imageUrl);

    // Preload
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = imageUrl;
    document.head.appendChild(preload);
  }
}

carregarProjeto();
