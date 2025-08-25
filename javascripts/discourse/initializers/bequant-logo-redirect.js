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
          link.target = "_blank"; // Open in new tab
          link.rel = "noopener noreferrer"; // Security best practice
          
          // Add title for accessibility
          link.title = "Go to BeQuant.dev";
          
          // Add click event listener as backup
          link.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://bequant.dev', '_blank');
          });
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