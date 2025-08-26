import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "logo-redirect",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Simple logo redirect to bequant.dev
      const logoLink = document.querySelector('.home-logo-wrapper-outlet .title a[href="/"]');
      if (logoLink && !logoLink.hasAttribute('data-redirect-added')) {
        logoLink.setAttribute('data-redirect-added', 'true');
        logoLink.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'https://bequant.dev';
        });
      }
    });
  }
}; 