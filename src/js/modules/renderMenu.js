// modules/renderMenu.js

export function renderFiltros(container, tipos, onClickFiltro) {
    container.innerHTML = ''; // Limpa o conteúdo anterior
  
    // Função que cria um item de menu com link
    function criarItemMenu(texto, slug) {
      const li = document.createElement('li');
      const link = document.createElement('a');
  
      link.href = '#'; // Mantém o comportamento de link
      link.textContent = texto;
      link.classList.add('filtro-btn', 'menu-item');
      link.setAttribute('data-menu-item', 'true');
      link.setAttribute('role', 'menuitem');
      link.setAttribute('aria-label', `Filtrar por ${texto}`);
  
      link.addEventListener('click', (e) => {
        e.preventDefault();
        marcarAtivo(link);
        onClickFiltro(slug);
      });
  
      li.appendChild(link);
      return li;
    }
  
    // Adiciona "Todos" no início
    container.appendChild(criarItemMenu('todos', 'todos'));
  
    // Adiciona os demais tipos
    tipos.forEach(tipo => {
      container.appendChild(criarItemMenu(tipo.nome, tipo.slug));
    });
  
    // Controla a classe ativa
    function marcarAtivo(linkAtivo) {
      const links = container.querySelectorAll('.filtro-btn');
      links.forEach(link => link.classList.remove('ativo'));
      linkAtivo.classList.add('ativo');
    }
  }