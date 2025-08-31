import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  let posthogInitialized = false;
  let currentUserIdentified = false;

  // Get settings from the theme settings
  const posthogKey = settings.posthog_key || '';
  const posthogHost = settings.posthog_host || 'https://us.i.posthog.com';
  const isEnabled = settings.posthog_analytics_enabled || false;

  // Skip initialization if not configured
  if (!isEnabled || !posthogKey || posthogKey.trim() === '') {
    return;
  }

  // Efficient PostHog initialization
  const initPostHog = () => {
    if (posthogInitialized || window.posthog) {
      return;
    }
    
    // Load PostHog script efficiently
    const script = document.createElement('script');
    script.src = 'https://app.posthog.com/static/array.js';
    script.async = true;
    script.onload = () => {
      try {
        // Initialize PostHog with optimal settings
        window.posthog.init(posthogKey, {
          api_host: posthogHost,
          autocapture: true,
          capture_pageview: true,
          capture_pageleave: true,
          disable_session_recording: false,
          enable_recording_console: true,
          loaded: () => {
            posthogInitialized = true;
            identifyUser();
            trackPageView();
          }
        });
      } catch (error) {
        console.error('Error initializing PostHog:', error);
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load PostHog script');
    };
    
    document.head.appendChild(script);
  };

  // Efficient user identification
  const identifyUser = () => {
    if (!window.posthog || currentUserIdentified) {
      return;
    }

    try {
      const currentUser = api.getCurrentUser();
      if (currentUser) {
        window.posthog.identify(currentUser.id.toString(), {
          email: currentUser.email,
          username: currentUser.username,
          name: currentUser.name,
          trust_level: currentUser.trust_level,
          moderator: currentUser.moderator,
          admin: currentUser.admin,
          primary_group_name: currentUser.primary_group_name,
          title: currentUser.title,
          created_at: currentUser.created_at,
          last_seen_at: currentUser.last_seen_at
        });
        currentUserIdentified = true;
      }
    } catch (error) {
      // Silent fail for user identification
    }
  };

  // Track page views efficiently
  const trackPageView = () => {
    if (!window.posthog) {
      return;
    }

    window.posthog.capture('$pageview', {
      page_title: document.title,
      page_url: window.location.href,
      referrer: document.referrer,
      discourse_route: window.location.pathname
    });
  };

  // Track user actions
  const trackUserAction = (action, properties = {}) => {
    if (!window.posthog) {
      return;
    }

    window.posthog.capture(action, {
      ...properties,
      discourse_route: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  };

  // Track page changes and user identification
  api.onPageChange((url, title) => {
    if (window.posthog) {
      identifyUser();
      trackPageView();
    }
  });

  // Track specific Discourse events
  api.onAppEvent('post:highlight', () => {
    trackUserAction('post_highlighted');
  });

  api.onAppEvent('post:unhighlight', () => {
    trackUserAction('post_unhighlighted');
  });

  api.onAppEvent('composer:opened', () => {
    trackUserAction('composer_opened');
  });

  api.onAppEvent('composer:closed', () => {
    trackUserAction('composer_closed');
  });

  api.onAppEvent('topic:created', (topic) => {
    trackUserAction('topic_created', {
      topic_id: topic.id,
      category_id: topic.category_id,
      title: topic.title
    });
  });

  api.onAppEvent('post:created', (post) => {
    trackUserAction('post_created', {
      post_id: post.id,
      topic_id: post.topic_id,
      category_id: post.category_id,
      is_first_post: post.post_number === 1
    });
  });

  // Track search events
  api.onAppEvent('search:complete', (results) => {
    trackUserAction('search_performed', {
      query: results.query,
      result_count: results.resultCount,
      search_type: results.type
    });
  });

  // Track navigation events
  api.onAppEvent('header:search-button', () => {
    trackUserAction('search_button_clicked');
  });

  api.onAppEvent('header:user-menu-button', () => {
    trackUserAction('user_menu_opened');
  });

  // Track topic interactions
  api.onAppEvent('topic:bookmarked', (topic) => {
    trackUserAction('topic_bookmarked', {
      topic_id: topic.id,
      category_id: topic.category_id
    });
  });

  api.onAppEvent('topic:unbookmarked', (topic) => {
    trackUserAction('topic_unbookmarked', {
      topic_id: topic.id,
      category_id: topic.category_id
    });
  });

  // Track post interactions
  api.onAppEvent('post:like', (post) => {
    trackUserAction('post_liked', {
      post_id: post.id,
      topic_id: post.topic_id,
      category_id: post.category_id
    });
  });

  api.onAppEvent('post:unlike', (post) => {
    trackUserAction('post_unliked', {
      post_id: post.id,
      topic_id: post.topic_id,
      category_id: post.category_id
    });
  });

  // Track category navigation
  api.onAppEvent('category:clicked', (category) => {
    trackUserAction('category_clicked', {
      category_id: category.id,
      category_name: category.name,
      category_slug: category.slug
    });
  });

  // Track tag interactions
  api.onAppEvent('tag:clicked', (tag) => {
    trackUserAction('tag_clicked', {
      tag_name: tag.name
    });
  });

  // Initialize PostHog when the app is ready
  api.decorateCooked($elem => {
    if (!posthogInitialized) {
      initPostHog();
    }
  });

  // Fallback initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostHog);
  } else {
    initPostHog();
  }
});
