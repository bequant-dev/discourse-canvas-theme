import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dark-theme",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Function to apply dark theme
      function applyDarkTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('discourse-theme', 'dark');
      }

      // Function to apply light theme
      function applyLightTheme() {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('discourse-theme', 'light');
      }

      // Function to toggle theme
      function toggleTheme() {
        const currentTheme = localStorage.getItem('discourse-theme') || 'dark';
        if (currentTheme === 'dark') {
          applyLightTheme();
        } else {
          applyDarkTheme();
        }
        updateThemeToggleButton();
      }

      // Function to update theme toggle button
      function updateThemeToggleButton() {
        const currentTheme = localStorage.getItem('discourse-theme') || 'dark';
        const button = document.getElementById('theme-toggle-button');
        if (button) {
          const icon = button.querySelector('.theme-icon');
          if (icon) {
            if (currentTheme === 'dark') {
              // Show moon icon for dark mode
              icon.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              `;
            } else {
              // Show sun icon for light mode
              icon.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              `;
            }
          }
        }
      }

      // Function to create theme toggle button
      function createThemeToggleButton() {
        // Check if button already exists
        if (document.getElementById('theme-toggle-button')) {
          return;
        }

        const currentTheme = localStorage.getItem('discourse-theme') || 'dark';
        
        // Create button
        const button = document.createElement('button');
        button.id = 'theme-toggle-button';
        button.className = 'btn btn-flat theme-toggle-btn';
        button.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background-color: var(--btn-secondary-bg, #1e293b);
          color: var(--btn-secondary-text, #e2e8f0);
          border: 1px solid var(--card-border, #334155);
          transition: all 0.2s ease;
          margin-left: 8px;
        `;
        
        button.innerHTML = `
          <span class="theme-icon">
            ${currentTheme === 'dark' ? `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            ` : `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            `}
          </span>
        `;
        
        button.addEventListener('click', toggleTheme);
        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = 'var(--btn-secondary-hover, #334155)';
          button.style.borderColor = 'var(--primary, #2563eb)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = 'var(--btn-secondary-bg, #1e293b)';
          button.style.borderColor = 'var(--card-border, #334155)';
        });

        // Try to find header buttons container
        const headerButtons = document.querySelector('.header-buttons') || 
                             document.querySelector('.header .buttons') ||
                             document.querySelector('.header .header-buttons');
        
        if (headerButtons) {
          headerButtons.appendChild(button);
        } else {
          // Fallback: add to header
          const header = document.querySelector('.header') || document.querySelector('header');
          if (header) {
            header.appendChild(button);
          }
        }
      }

      // Initialize theme on page load
      api.onPageChange(() => {
        const savedTheme = localStorage.getItem('discourse-theme') || 'dark';
        if (savedTheme === 'dark') {
          applyDarkTheme();
        } else {
          applyLightTheme();
        }
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 100);
      });

      // Also run on initial load
      api.decorateCooked($elem => {
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 100);
      });

      // Apply dark theme by default if no preference is set
      if (!localStorage.getItem('discourse-theme')) {
        applyDarkTheme();
      }
    });
  }
}; 