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
          const className = currentElement.className || '';
          const classList = currentElement.classList;
          
          // User-generated content classes to exclude
          const userContentClasses = [
            'cooked',           // Post content
            'post',             // Individual posts
            'topic-body',       // Topic body content
            'topic-title',      // Topic titles
            'title',            // General titles (but be careful)
            'topic-list-item',  // Topic list items (user-created topics)
            'category-box',     // Category descriptions
            'topic-excerpt',    // Topic excerpts
            'post-message',     // Post messages
            'crawler-link',     // Crawler links
            'topic-category',   // Topic categories
            'topic-meta-data',  // Topic metadata
            'topic-list',       // Topic list (contains user content)
            'topic-list-body',  // Topic list body
            'topic-list-item',  // Individual topic items
            'link-top-line',    // Topic link top line
            'link-bottom-line', // Topic link bottom line
            'badge-category',   // Category badges
            'topic-statuses',   // Topic statuses
            'topic-post-badges' // Topic post badges
          ];
          
          // Check if any of the user content classes are present
          for (const userClass of userContentClasses) {
            if (classList.contains(userClass)) {
              return true;
            }
          }
          
          // Check for data attributes that indicate user content
          if (currentElement.hasAttribute('data-topic-id') || 
              currentElement.hasAttribute('data-post-id') ||
              currentElement.hasAttribute('data-user-id')) {
            return true;
          }
          
          // Check for specific IDs that contain user content
          const id = currentElement.id || '';
          if (id.includes('post_') || 
              id.includes('topic_') || 
              id.includes('user_') ||
              id.includes('ember')) {
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