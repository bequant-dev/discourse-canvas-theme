# PostHog Analytics for Discourse Theme

This Discourse theme includes PostHog analytics integration to track user behavior and engagement on your forum.

## Setup Instructions

### 1. Get PostHog Credentials

1. Go to your PostHog dashboard
2. Navigate to Project Settings > Project API Keys
3. Copy your **Project API Key**
4. Note your **PostHog Host** (usually `https://us.i.posthog.com`)

### 2. Configure Discourse Settings

In your Discourse admin panel:

1. Go to **Admin > Customize > Themes**
2. Find your theme and click **Edit**
3. Go to **Settings** tab
4. Configure the following settings:

```
posthog_analytics_enabled: true
posthog_key: "your_actual_posthog_project_key"
posthog_host: "https://us.i.posthog.com"
track_pageviews: true
track_user_actions: true
track_search: true
autocapture: true
```

### 3. Deploy the Theme

1. Save the theme settings
2. The PostHog integration will automatically start tracking

## What Gets Tracked

### Automatic Tracking
- **Page Views** - Every page navigation
- **User Sessions** - Session recording and behavior
- **Autocapture** - Clicks, form submissions, page views

### Custom Events
- **Post Clicks** - When users click on posts
- **Topic Clicks** - When users click on topics
- **Search** - Search queries and results
- **User Identification** - User login/registration

### User Properties
- User ID, email, username
- Trust level, moderator status, admin status
- Forum activity and engagement

## Privacy Considerations

- PostHog respects user privacy settings
- No sensitive content is tracked
- Users can opt out through browser settings
- GDPR compliant tracking

## Testing

1. Open browser developer tools
2. Check the Network tab for requests to PostHog
3. Look for console logs: "PostHog loaded in Discourse"
4. Visit your PostHog dashboard to see events

## Troubleshooting

### PostHog not loading
- Check that the API key is correct
- Verify the host URL is accessible
- Check browser console for errors

### No events showing
- Ensure the theme is active
- Check if ad blockers are interfering
- Verify PostHog project settings

### User identification issues
- Check that users are logged in
- Verify Discourse user API is working
- Check console for identification logs
