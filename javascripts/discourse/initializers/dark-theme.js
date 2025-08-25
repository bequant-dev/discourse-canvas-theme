import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "theme-switcher",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Function to apply dark theme
      function applyDarkTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('discourse-theme', 'dark');
      }

      // Function to apply light theme
      function applyLightTheme() {
        document.documentElement.setAttribute('data-theme', 'light');
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
              // Show moon icon for dark mode (switch to light)
              icon.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              `;
              button.setAttribute('title', 'Switch to light mode');
            } else {
              // Show sun icon for light mode (switch to dark)
              icon.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              `;
              button.setAttribute('title', 'Switch to dark mode');
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
          background-color: var(--highlight);
          color: var(--primary);
          border: 1px solid var(--quaternary);
          transition: all 0.2s ease;
          margin-left: 8px;
          cursor: pointer;
          z-index: 1000;
        `;
        
        button.innerHTML = `
          <span class="theme-icon">
            ${currentTheme === 'dark' ? `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            ` : `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            `}
          </span>
        `;
        
        button.addEventListener('click', toggleTheme);
        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = 'var(--hover)';
          button.style.borderColor = 'var(--tertiary)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = 'var(--highlight)';
          button.style.borderColor = 'var(--quaternary)';
        });

        // More comprehensive header button placement
        const possibleSelectors = [
          '.header-buttons',
          '.header .buttons',
          '.header .header-buttons',
          '.header .header-buttons .buttons',
          '.header .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .buttons',
          '.header .header-buttons .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .header-buttons .buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons',
          '.header .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .header-buttons .buttons'
        ];

        let headerButtons = null;
        for (const selector of possibleSelectors) {
          headerButtons = document.querySelector(selector);
          if (headerButtons) {
            console.log('Found header buttons container:', selector);
            break;
          }
        }
        
        if (headerButtons) {
          headerButtons.appendChild(button);
          console.log('Theme toggle button added to header');
        } else {
          // Fallback: try to find any header element and add the button
          const header = document.querySelector('.header') || 
                        document.querySelector('header') || 
                        document.querySelector('[data-header]') ||
                        document.querySelector('.d-header') ||
                        document.querySelector('.header-wrapper');
          
          if (header) {
            // Create a container for the button if needed
            let buttonContainer = header.querySelector('.theme-toggle-container');
            if (!buttonContainer) {
              buttonContainer = document.createElement('div');
              buttonContainer.className = 'theme-toggle-container';
              buttonContainer.style.cssText = `
                display: flex;
                align-items: center;
                margin-left: auto;
                margin-right: 10px;
              `;
              header.appendChild(buttonContainer);
            }
            buttonContainer.appendChild(button);
            console.log('Theme toggle button added to header fallback');
          } else {
            console.log('Could not find header element for theme toggle button');
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
        
        // Multiple attempts to ensure button appears
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 100);
        
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 500);
        
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 1000);
      });

      // Also run on initial load
      api.decorateCooked($elem => {
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 100);
        
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 500);
      });

      // Apply dark theme by default if no preference is set
      if (!localStorage.getItem('discourse-theme')) {
        applyDarkTheme();
      }

      // Additional attempts on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            createThemeToggleButton();
            updateThemeToggleButton();
          }, 100);
        });
      } else {
        setTimeout(() => {
          createThemeToggleButton();
          updateThemeToggleButton();
        }, 100);
      }

      // Periodic check to ensure button exists
      setInterval(() => {
        if (!document.getElementById('theme-toggle-button')) {
          console.log('Theme toggle button not found, attempting to create...');
          createThemeToggleButton();
          updateThemeToggleButton();
        }
      }, 2000);
    });
  }
}; 