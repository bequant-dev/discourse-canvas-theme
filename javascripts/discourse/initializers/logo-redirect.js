import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "logo-redirect",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Function to update logo href
      const updateLogoHref = () => {
        const logoLink = document.querySelector('.home-logo-wrapper-outlet .title a[href="/"]');
        if (logoLink) {
          logoLink.href = 'https://bequant.dev';
        }
      };

      // Update immediately if DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateLogoHref);
      } else {
        updateLogoHref();
      }

      // Also update when the page changes (for SPA navigation)
      api.onPageChange(() => {
        setTimeout(updateLogoHref, 100); // Small delay to ensure DOM is updated
      });
    });
  }
}; 