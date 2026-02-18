# Deployment Troubleshooting

If you are seeing a 404 error, follows these steps:

## 1. Verify Repo Visibility
GitHub Pages is **Free for Public** repositories only.
- Go to your repo on GitHub.
- Check if it says "Public" next to the name.
- If it says "Private", go to **Settings > General > Danger Zone** and change visibility to Public.

## 2. Verify GitHub Pages Settings
- Go to **Settings > Pages**.
- Ensure **Source** is set to "Deploy from a branch".
- Ensure **Branch** is set to `gh-pages` / `/ (root)`.

## 3. Hard Refresh
- Sometimes the browser caches the 404 page.
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to hard refresh.

## 4. Redeploy
I have updated the configuration to be **repository-name independent**.
Run this one last time:

```bash
npm run deploy
```

This will fix any path issues.
