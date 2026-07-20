# TradeHub Deployment Guide

This guide explains how to deploy TradeHub to GitHub Pages.

## Prerequisites

- GitHub account
- Repository with TradeHub code
- GitHub repository must be public or have GitHub Pages enabled

## Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Build and deployment**, select **GitHub Actions** as the source
4. The workflow will automatically run on the next push

### 3. Manual Deployment

You can also manually trigger the deployment:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

### 4. Access Your Site

After deployment completes:
- Your site will be available at: `https://yourusername.github.io/TradeHub/`
- Check the Actions tab for deployment status

## Local Testing Before Deployment

To test the static build locally:

```bash
npm run build
```

The built files will be in the `out` directory. You can serve them locally using:

```bash
npx serve out
```

Or use any static file server.

## Configuration Details

The app is configured for GitHub Pages with:
- **Static Export**: `output: 'export'` in `next.config.ts`
- **Base Path**: `/TradeHub` to match repository name
- **Asset Prefix**: `/TradeHub` for proper asset loading
- **Unoptimized Images**: Required for static export

## Important Notes

- **Client-Side Only**: This app uses localStorage for data persistence. Data is stored in the user's browser and not synced across devices.
- **No Backend**: There is no server or database. All data is local to the browser.
- **SPA Behavior**: The app is a Single Page Application. Direct navigation to sub-routes may not work without proper server configuration.

## Troubleshooting

### Build Fails

- Check the Actions tab for error logs
- Ensure all dependencies are installed
- Verify Node.js version (requires Node 20+)

### 404 Errors on GitHub Pages

- Ensure `basePath` in `next.config.ts` matches your repository name
- Check that the workflow completed successfully
- Clear browser cache

### Assets Not Loading

- Verify `assetPrefix` matches `basePath`
- Check that all assets are in the `out` directory after build

### Data Not Persisting

- This is expected behavior - data is stored in localStorage
- Each browser/device has its own data
- Clearing browser data will reset the app

## Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Configure DNS records as instructed by GitHub
4. Update `basePath` and `assetPrefix` in `next.config.ts` if needed

## Workflow Configuration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
- Builds the Next.js app as a static site
- Deploys to GitHub Pages on push to main/master
- Can be triggered manually via workflow dispatch

## Environment Variables

Currently, no environment variables are required for deployment.

## Support

For issues:
- Check the Actions tab for deployment logs
- Review the GitHub Pages documentation
- Open an issue in the repository
