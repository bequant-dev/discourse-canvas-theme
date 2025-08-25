import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "hide-signup-button",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Function to hide sign up button when user is not logged in
      function hideSignUpButton() {
        // Check if user is logged in
        const currentUser = api.getCurrentUser();
        
        if (!currentUser) {
          // Hide sign up button and related elements when user is not logged in
          const signUpSelectors = [
            '.sign-up-button',
            '.btn-sign-up',
            '.signup-button',
            '.btn-signup',
            '[data-name="sign-up"]',
            '[data-name="signup"]',
            '.header-sign-up',
            '.nav-sign-up',
            '.sign-up-link',
            '.signup-link',
            'a[href*="/signup"]',
            'a[href*="/sign-up"]',
            '.btn[href*="/signup"]',
            '.btn[href*="/sign-up"]'
          ];

          signUpSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
              element.style.display = 'none';
            });
          });

          // Also hide any elements with text content containing "sign up" or "signup"
          const allElements = document.querySelectorAll('a, button, .btn');
          allElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes('sign up') || text.includes('signup') || text.includes('register')) {
              // Check if it's not a login button
              if (!text.includes('log in') && !text.includes('login')) {
                element.style.display = 'none';
              }
            }
          });
        }
      }

      // Run when the page loads
      api.onPageChange(() => {
        // Small delay to ensure DOM is fully rendered
        setTimeout(hideSignUpButton, 100);
      });

      // Also run on initial load
      api.decorateCooked($elem => {
        setTimeout(hideSignUpButton, 100);
      });

      // Run periodically to catch dynamic content
      setInterval(hideSignUpButton, 2000);
    });
  }
}; 