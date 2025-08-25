import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "text-replacements",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Function to check if a node is within user-generated content
      function isUserGeneratedContent(node) {
        // Check if the node or any of its parents have classes that indicate user content
        let currentElement = node.parentElement;
        
        while (currentElement && currentElement !== document.body) {
          const classList = currentElement.classList;
          
          // Only exclude actual user content, not UI elements
          const userContentClasses = [
            'cooked',           // Post content (user-written)
            'post',             // Individual posts (user content)
            'topic-body',       // Topic body content (user-written)
            'topic-excerpt',    // Topic excerpts (user-written)
            'post-message',     // Post messages (user-written)
            'category-box-inner', // Category descriptions (user-written)
            'topic-category',   // Topic categories (user-created)
            'topic-meta-data',  // Topic metadata (user-created)
            'link-top-line',    // Topic link top line (user titles)
            'link-bottom-line', // Topic link bottom line (user content)
            'badge-category__name', // Category names (user-created)
            'topic-post-badges' // Topic post badges (user-created)
          ];
          
          // Check if any of the user content classes are present
          for (const userClass of userContentClasses) {
            if (classList.contains(userClass)) {
              return true;
            }
          }
          
          // Check for specific data attributes that indicate user content
          if (currentElement.hasAttribute('data-topic-id') && 
              (classList.contains('topic-list-item') || classList.contains('link-top-line'))) {
            return true;
          }
          
          // Check for specific IDs that contain user content
          const id = currentElement.id || '';
          if (id.includes('post_') || 
              id.includes('topic_') || 
              id.includes('user_')) {
            return true;
          }
          
          currentElement = currentElement.parentElement;
        }
        
        return false;
      }

      // Function to perform text replacements
      function replaceText() {
        // Get all text nodes in the document
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: function(node) {
              // Skip script and style tags
              if (node.parentElement.tagName === 'SCRIPT' || 
                  node.parentElement.tagName === 'STYLE') {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip user-generated content
              if (isUserGeneratedContent(node)) {
                return NodeFilter.FILTER_REJECT;
              }
              
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
          textNodes.push(node);
        }

        // Perform replacements
        textNodes.forEach(textNode => {
          let text = textNode.textContent;
          let originalText = text;

          // Replace "Topic" with "Thread" (case-sensitive)
          text = text.replace(/\bTopic\b/g, "Thread");
          text = text.replace(/\btopic\b/g, "thread");
          text = text.replace(/\bTOPIC\b/g, "THREAD");

          // Replace "Topics" with "Threads" (case-sensitive)
          text = text.replace(/\bTopics\b/g, "Threads");
          text = text.replace(/\btopics\b/g, "threads");
          text = text.replace(/\bTOPICS\b/g, "THREADS");

          // Replace "Post" with "Comment" (but be careful not to replace our new "Post" text)
          // We need to be more specific to avoid double replacements
          text = text.replace(/\bPost\s+(?!\(s\)|s\b)/g, "Comment");
          text = text.replace(/\bpost\s+(?!\(s\)|s\b)/g, "comment");
          text = text.replace(/\bPOST\s+(?!\(s\)|s\b)/g, "COMMENT");

          // Replace "Posts" with "Comments" (but be careful)
          text = text.replace(/\bPosts\b/g, "Comments");
          text = text.replace(/\bposts\b/g, "comments");
          text = text.replace(/\bPOSTS\b/g, "COMMENTS");

          // Replace "Category" with "Room" (case-sensitive)
          text = text.replace(/\bCategory\b/g, "Room");
          text = text.replace(/\bcategory\b/g, "room");
          text = text.replace(/\bCATEGORY\b/g, "ROOM");

          // Replace "Categories" with "Rooms" (case-sensitive)
          text = text.replace(/\bCategories\b/g, "Rooms");
          text = text.replace(/\bcategories\b/g, "rooms");
          text = text.replace(/\bCATEGORIES\b/g, "ROOMS");

          // Only update if text actually changed
          if (text !== originalText) {
            textNode.textContent = text;
          }
        });
      }

      // Run replacements when the page loads
      api.onPageChange(() => {
        // Small delay to ensure DOM is fully rendered
        setTimeout(replaceText, 100);
      });

      // Also run on initial load
      api.decorateCooked($elem => {
        setTimeout(replaceText, 100);
      });

      // Run periodically to catch dynamic content
      setInterval(replaceText, 2000);
    });
  }
}; 