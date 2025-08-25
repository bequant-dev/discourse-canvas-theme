import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dark-theme-default",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Function to apply dark theme
      function applyDarkTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('discourse-theme', 'dark');
      }

      // Initialize theme on page load
      api.onPageChange(() => {
        // Always apply dark theme
        applyDarkTheme();
      });

      // Also run on initial load
      api.decorateCooked($elem => {
        applyDarkTheme();
      });

      // Apply dark theme by default
      applyDarkTheme();

      // Additional attempts on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          applyDarkTheme();
        });
      } else {
        applyDarkTheme();
      }
    });
  }
}; 