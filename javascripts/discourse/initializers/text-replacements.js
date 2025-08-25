import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "text-replacements",
  initialize() {
    withPluginApi("0.8.31", api => {
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

          // Replace "Topic" with "Post" (case-sensitive)
          text = text.replace(/\bTopic\b/g, "Post");
          text = text.replace(/\btopic\b/g, "post");
          text = text.replace(/\bTOPIC\b/g, "POST");

          // Replace "Topics" with "Posts" (case-sensitive)
          text = text.replace(/\bTopics\b/g, "Posts");
          text = text.replace(/\btopics\b/g, "posts");
          text = text.replace(/\bTOPICS\b/g, "POSTS");

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