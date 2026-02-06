// app.js - نقطة الدخول
import { initAuthGuards, restoreThemePreference } from './auth.js';

(function init() {
  restoreThemePreference();
  setupThemeToggle();
  initAuthGuards();
})();

function setupThemeToggle() {
  const btn = document.getElementById('toggle-theme');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('itqan_theme', isLight ? 'light' : 'dark');
  });
}