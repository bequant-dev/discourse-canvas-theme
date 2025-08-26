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

      // Apply dark theme by default
      applyDarkTheme();

      // Additional attempt on DOM ready if needed
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          applyDarkTheme();
        });
      }
    });
  }
}; 