// modules/menuInit.js
import { renderFiltros } from './renderMenu.js';

export function initMenu(containerSelector, tipos, onClickHandler) {
  const container = document.querySelector(containerSelector);
  if (container) {
    renderFiltros(container, tipos, onClickHandler);
  }
}