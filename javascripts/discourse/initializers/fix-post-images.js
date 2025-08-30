import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "fix-post-images",
  initialize() {
    withPluginApi("0.8.31", api => {
      
      // Function to fix images that disappear after posting
      function fixDisappearingImages() {
        // Find all images in posts that might be hidden
        const postImages = document.querySelectorAll('.cooked img, .topic-body img, .post-message img');
        
        postImages.forEach(img => {
          // Force image to be visible
          img.style.display = 'block';
          img.style.visibility = 'visible';
          img.style.opacity = '1';
          
          // If image failed to load, try reloading it
          if (!img.complete || img.naturalWidth === 0) {
            const originalSrc = img.src;
            
            // Add error handler to retry loading
            img.onerror = () => {
              // Try reloading the image after a short delay
              setTimeout(() => {
                img.src = originalSrc + '?retry=' + Date.now();
              }, 1000);
            };
            
            // Force reload if image seems broken
            if (img.src && !img.complete) {
              img.src = img.src + '?reload=' + Date.now();
            }
          }
        });
      }

      // Run fix when posts are loaded
      api.onPageChange(() => {
        // Wait for posts to fully load
        setTimeout(fixDisappearingImages, 500);
        setTimeout(fixDisappearingImages, 1500);
      });

      // Also run when new posts are added
      api.decorateCooked($elem => {
        setTimeout(fixDisappearingImages, 100);
      });

      // Monitor for new posts being added
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            // Check if new posts were added
            const hasNewPosts = Array.from(mutation.addedNodes).some(node => 
              node.nodeType === Node.ELEMENT_NODE && 
              (node.classList?.contains('post') || node.querySelector?.('.post'))
            );
            
            if (hasNewPosts) {
              setTimeout(fixDisappearingImages, 200);
            }
          }
        });
      });

      // Start observing for new posts
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
};
