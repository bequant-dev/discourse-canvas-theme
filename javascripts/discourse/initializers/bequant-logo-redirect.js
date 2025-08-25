import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "bequant-logo-redirect",
  initialize() {
    withPluginApi("0.8.31", api => {
      function redirectBeQuantLogo() {
        // Find all logo links
        const logoLinks = document.querySelectorAll('.home-logo-wrapper-outlet .title a, .header .title a');
        
        logoLinks.forEach(link => {
          // Change href to bequant.dev
          link.href = "https://bequant.dev";
          // Remove target="_blank" to open in same page
          link.removeAttribute('target');
          link.removeAttribute('rel');
          
          // Add title for accessibility
          link.title = "Go to BeQuant.dev";
          
                         // Replace the content with BeQuant text - match BeQuant app styling
               link.innerHTML = '<span style="font-family: Inter, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 1.125rem; font-weight: 700; color: #2563eb; letter-spacing: -0.025em;">BeQuant</span>';
          
                      // Add click event listener as backup (only once)
            if (!link.hasAttribute('data-bequant-redirect-added')) {
              link.setAttribute('data-bequant-redirect-added', 'true');
              link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'https://bequant.dev';
              });
            }
        });
      }

      // Run on page load
      redirectBeQuantLogo();
      
      // Run on page changes
      api.onPageChange(() => {
        setTimeout(redirectBeQuantLogo, 100);
      });
      
      // Run when content is loaded
      api.decorateCooked($elem => {
        setTimeout(redirectBeQuantLogo, 100);
      });
      
      // Run periodically to catch any dynamically added logos
      setInterval(redirectBeQuantLogo, 2000);
    });
  }
}; 