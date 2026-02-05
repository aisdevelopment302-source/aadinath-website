# AIS Website Deployment Guide

## Vercel Deployment

### Quick Setup
1. **Connect GitHub repo** to Vercel
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Select the `aadinath-website` repo from GitHub
   - Framework: **Next.js** (auto-detected)

2. **Environment Variables** (if needed)
   - Copy any variables from `.env.example`
   - Add to Vercel project settings under "Environment Variables"

3. **Deploy**
   - Vercel auto-deploys on every push to `main`
   - First deployment runs `pnpm install && pnpm build`
   - Preview URLs generated automatically for each commit

### Local Development
```bash
cd /home/adityajain/AIS/ais-website
pnpm install
pnpm dev
# Visit http://localhost:3000
```

### Production Build
```bash
pnpm build
pnpm start
```

### Vercel Configuration
Settings are in `vercel.json`:
- Build command: `pnpm install && pnpm build`
- Install command: `pnpm install`
- Node version: 22.x
- Region: US (iad1)

## Custom Domain
Once deployed, add a custom domain in Vercel project settings:
1. Go to **Domains** tab
2. Add domain (e.g., `aadinath.com`)
3. Update DNS records per Vercel's instructions

## Troubleshooting
- **Build fails**: Check `pnpm-lock.yaml` is committed
- **Large files**: Ensure `.gitignore` is properly configured
- **Performance**: Vercel provides analytics in dashboard
