# Deployment Guide - Climb Himalayan

## 🎉 Deployment Status

Your site has been successfully deployed to Cloudflare Pages with password protection!

**Deployment URL:** https://f97b6d47.climb-himalayan.pages.dev

## 🔐 Current Password

The site is currently protected with the following password:
```
MySecurePassword123!
```

**⚠️ IMPORTANT:** You should change this password immediately. See instructions below.

## 📋 What Was Implemented

### 1. Password Protection
- **Edge Middleware** (`functions/_middleware.js`) - Intercepts all requests and checks authentication
- **Login Endpoint** (`functions/auth/login.js`) - Handles password verification
- **Login Page** (`public/auth-login.html`) - Beautiful login interface

### 2. Deployment Configuration
- **Wrangler CLI** - Installed and configured for Cloudflare Pages deployment
- **Project Created** - `climb-himalayan` project on Cloudflare Pages
- **Deploy Script** - Added `npm run deploy` command to package.json

### 3. Security Features
- ✅ Server-side password verification (not visible in client code)
- ✅ HTTP-only secure session cookies
- ✅ 7-day session duration
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Static assets remain accessible (CSS, JS, images)

## 🔄 How to Deploy Updates

To deploy changes to your site:

```bash
npm run deploy
```

This will:
1. Build your Astro site (`astro build`)
2. Deploy to Cloudflare Pages (`wrangler pages deploy dist`)

## 🔑 How to Change the Password

### Option 1: Using Wrangler CLI (Recommended)

```bash
npx wrangler pages secret put SITE_PASSWORD --project-name=climb-himalayan
```

You'll be prompted to enter the new password securely.

### Option 2: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **climb-himalayan**
3. Go to **Settings** → **Environment Variables**
4. Edit the `SITE_PASSWORD` variable
5. Redeploy for changes to take effect

## 🌐 Connect Your Custom Domain

To connect `climbhimalayan.com` to your site:

### Step 1: Add Custom Domain in Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **climb-himalayan**
3. Go to **Custom domains** tab
4. Click **Set up a custom domain**
5. Enter: `climbhimalayan.com`
6. Click **Activate domain**

### Step 2: Add www Subdomain (Optional but Recommended)

7. Repeat the process for `www.climbhimalayan.com`

### Step 3: Wait for DNS Propagation

- Cloudflare will automatically configure DNS records (since your domain is already in Cloudflare)
- SSL certificates will be auto-provisioned in ~5 minutes
- You can check status in the Custom domains tab

## 🧪 Local Development with Authentication

To test the password protection locally:

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Run with Wrangler:**
   ```bash
   npx wrangler pages dev dist
   ```

3. **Test locally at:** http://localhost:8788

The local password is set in `.dev.vars` file (currently: `test123`). You can change it there for local testing.

## 📁 Project Structure

```
climb-himalayan/
├── functions/                    # Cloudflare Pages Functions
│   ├── _middleware.js           # Authentication middleware
│   └── auth/
│       └── login.js             # Password verification endpoint
├── public/
│   └── auth-login.html          # Login page
├── wrangler.toml                # Wrangler configuration
├── .dev.vars                    # Local environment variables (gitignored)
└── package.json                 # Added deploy script
```

## 💰 Cost Breakdown

- **Cloudflare Pages Hosting:** $0 (Free tier)
- **Cloudflare Functions:** $0 (100,000 requests/day free)
- **Custom Domain:** Already owned
- **SSL Certificate:** $0 (Auto-provisioned)

**Total Monthly Cost: $0**

## 🔒 Security Best Practices

1. **Use a Strong Password**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Don't share it publicly

2. **Rotate Password Regularly**
   - Change the password every 3-6 months
   - Use the Wrangler CLI command above

3. **Monitor Access**
   - Check Cloudflare Analytics for unusual activity
   - Review access logs in Workers & Pages dashboard

## 🆘 Troubleshooting

### Can't Login with Password
- Verify the password was set correctly: `npx wrangler pages secret list --project-name=climb-himalayan`
- Check browser console for errors
- Clear cookies and try again

### Changes Not Showing Up
- Make sure you ran `npm run deploy` after making changes
- Check deployment status in Cloudflare Dashboard
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Domain Not Working
- Verify DNS records in Cloudflare DNS settings
- Wait up to 24 hours for full DNS propagation
- Check SSL certificate status in Custom domains tab

## 📞 Support

For issues with:
- **Cloudflare Pages:** [Cloudflare Community](https://community.cloudflare.com/)
- **Wrangler CLI:** [GitHub Issues](https://github.com/cloudflare/workers-sdk/issues)
- **Astro:** [Astro Discord](https://astro.build/chat)

---

🏔️ **Happy Climbing!**
