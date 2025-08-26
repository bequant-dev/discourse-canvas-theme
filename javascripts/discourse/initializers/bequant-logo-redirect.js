import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bequant-logo-redirect",
  initialize() {
    withPluginApi("0.8.31", api => {
      function redirectBeQuantLogo() {
        // Find all logo links
        const logoLinks = document.querySelectorAll('.home-logo-wrapper-outlet .title a, .header .title a');
        
        logoLinks.forEach((link, index) => {
          // Only process if not already processed
          if (link.hasAttribute('data-bequant-redirect-added')) {
            return;
          }
          
          // Change href to bequant.dev
          link.href = "https://bequant.dev";
          // Remove target="_blank" to open in same page
          link.removeAttribute('target');
          link.removeAttribute('rel');
          
          // Add title for accessibility
          link.title = "Go to BeQuant.dev";
          
          // Keep the original logo image, just redirect the link
          // Don't replace the innerHTML - keep the uploaded PNG
          
          // Add click event listener as backup (only once)
          link.setAttribute('data-bequant-redirect-added', 'true');
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'https://bequant.dev';
          });
        });
      }

      // Run only once on page load - no observers or page change events
      redirectBeQuantLogo();
      
      // Also run when the page is ready to ensure logo appears
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectBeQuantLogo);
      } else {
        // Page is already loaded, run immediately
        redirectBeQuantLogo();
      }
    });
  }
}; 