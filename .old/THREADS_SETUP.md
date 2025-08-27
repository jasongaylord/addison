# Threads Integration Setup

This project includes automated Threads App Access Token management using GitHub Actions.

## Setup Instructions

### 1. Create a Threads App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app and enable Threads API
3. Note down your **App ID** and **App Secret**

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

**Required Secrets:**
- `THREADS_APP_ID`: Your Threads app ID from Meta for Developers
- `THREADS_APP_SECRET`: Your Threads app secret from Meta for Developers

**To add secrets:**
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names above

### 3. How It Works

**Automatic Token Refresh:**
- GitHub Action runs every 30 days at 2 AM UTC
- Generates a new Threads App Access Token
- Stores it in `data/threads.json` with metadata
- Commits the updated file to the repository

**Token Usage:**
- The `ThreadsReader` class automatically loads the token from `data/threads.json`
- If no token is available, it falls back to mock data
- Tokens are validated for expiration before use

### 4. Manual Refresh

You can manually trigger a token refresh:

1. Go to **Actions** tab in your GitHub repository
2. Select **Refresh Threads App Access Token**
3. Click **Run workflow**

### 5. Monitoring

The GitHub Action provides detailed logs and summaries:
- Token generation status
- Validation results
- Commit information
- Next scheduled refresh time

### 6. Security Notes

- App secrets are never exposed in logs or code
- Tokens are stored in the repository (they're app-level, not user-specific)
- The action only runs in your repository with your secrets
- Tokens automatically expire and are refreshed

## File Structure

```
├── .github/workflows/refresh-threads-token.yml  # GitHub Action workflow
├── data/threads.json                           # Auto-generated token storage
├── threads-reader.js                           # Updated with token loading
└── THREADS_SETUP.md                           # This file
```

## Troubleshooting

**If the action fails:**
1. Check that GitHub Secrets are set correctly
2. Verify your Threads app is properly configured
3. Ensure your app has the necessary permissions
4. Check the action logs for specific error messages

**If posts don't load:**
1. The action may not have run yet (check Actions tab)
2. Token might be expired (trigger manual refresh)
3. API rate limits may be exceeded
4. Falls back to mock data automatically
