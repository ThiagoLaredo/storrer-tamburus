export function renderFiltros(container, tipos, onClickFiltro) {
    container.innerHTML = ''; // limpa o <ul>
  
    // Adiciona o botão "Todos"
    const liTodos = document.createElement('li');
    const btnTodos = document.createElement('button');
    btnTodos.textContent = 'Todos';
    btnTodos.classList.add('filtro-btn');
    btnTodos.addEventListener('click', () => {
      marcarAtivo(btnTodos);
      onClickFiltro('todos');
    });
    liTodos.appendChild(btnTodos);
    container.appendChild(liTodos);
  
    tipos.forEach(tipo => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = tipo.nome;
      btn.classList.add('filtro-btn');
      btn.addEventListener('click', () => {
        marcarAtivo(btn);
        onClickFiltro(tipo.slug);
      });
      li.appendChild(btn);
      container.appendChild(li);
    });
  
    function marcarAtivo(btnAtivo) {
      const botoes = container.querySelectorAll('button');
      botoes.forEach(b => b.classList.remove('ativo'));
      btnAtivo.classList.add('ativo');
    }
  }
  
  
  export function renderGaleria(container, projetos) {
    if (!projetos || projetos.length === 0) {
      container.innerHTML = '<p>Nenhum projeto encontrado.</p>';
      return;
    }
  
    container.innerHTML = projetos.map(projeto => `
 <div class="projeto-item">
      <a href="/projeto.html?slug=${projeto.slug}">
        <img src="${projeto.capa}" alt="${projeto.title}" loading="lazy" />
        <div class="projeto-overlay"></div>
        <h3 class="projeto-titulo">${projeto.title}</h3>
      </a>
    </div>
    `).join('');
  }
  