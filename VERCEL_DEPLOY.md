# Deploy to Vercel

This guide will help you deploy your Ghost-Razorpay integration to Vercel in just a few minutes.

## 🚀 Quick Deployment

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add GHOST_ADMIN_API_URL
   vercel env add GHOST_ADMIN_API_KEY
   vercel env add RAZORPAY_WEBHOOK_SECRET
   ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Import your repository:**
   - Click "New Project"
   - Import from Git repository
   - Select this repository

3. **Configure environment variables:**
   - In project settings, go to "Environment Variables"
   - Add these variables:
     - `GHOST_ADMIN_API_URL` = `https://your-ghost-site.com/ghost/api/admin`
     - `GHOST_ADMIN_API_KEY` = `your_admin_api_key_here`
     - `RAZORPAY_WEBHOOK_SECRET` = `your_webhook_secret_here`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy

## 📡 Configure Webhook URL

After deployment, your webhook URL will be:
```
https://your-project-name.vercel.app/webhook/razorpay
```

Update this in your Razorpay Dashboard:
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Edit your webhook or create new one
3. Set URL to: `https://your-project-name.vercel.app/webhook/razorpay`
4. Select events: `payment.captured`
5. Save

## 🧪 Test Your Deployment

Visit your health check endpoint:
```
https://your-project-name.vercel.app/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "ghost-razorpay-integration",
  "platform": "vercel"
}
```

## 🔧 Vercel-Specific Features

### Automatic Deployments
- Every push to main branch triggers automatic deployment
- Preview deployments for pull requests
- Rollback to previous deployments easily

### Environment Variables
- Manage all secrets securely in Vercel dashboard
- Different variables for preview vs production
- No need to commit sensitive data

### Performance
- Global CDN for fast response times
- Automatic scaling based on traffic
- Zero cold starts for most regions

## 📊 Monitoring

### View Logs
```bash
vercel logs your-project-name
```

### View Function Invocations
- Go to Vercel Dashboard → Your Project → Functions
- Monitor webhook calls and performance
- View detailed logs for debugging

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit secrets to git
   - Use Vercel's environment variable system
   - Different secrets for preview/production

2. **Webhook Security:**
   - Always verify Razorpay signatures
   - Monitor for unusual webhook patterns
   - Set up alerts for failed payments

## 🛠 Troubleshooting

### Common Issues

1. **Webhook not receiving data:**
   - Check Razorpay webhook URL is correct
   - Verify webhook secret in Vercel env vars
   - Check function logs in Vercel dashboard

2. **Ghost API errors:**
   - Verify Ghost URL format (include `/ghost/api/admin`)
   - Check Ghost API key format: `id:secret`
   - Ensure Ghost site is accessible from internet

3. **Environment variables not working:**
   - Redeploy after adding env vars: `vercel --prod`
   - Check variable names match exactly
   - Verify no extra spaces in values

### Debug Commands

```bash
# View recent logs
vercel logs

# View specific function logs
vercel logs --follow

# Test local function
vercel dev
```

## 💰 Costs

Vercel's Hobby plan includes:
- ✅ 100GB bandwidth per month
- ✅ 100 serverless function invocations per day
- ✅ Unlimited static deployments
- ✅ Custom domains

For higher traffic, upgrade to Pro plan for unlimited everything.

## 🔄 Updates

To update your deployment:
1. Make changes to your code
2. Push to your git repository
3. Vercel automatically deploys the update

Or manually deploy:
```bash
vercel --prod
```

## ⚡ Performance Tips

1. **Keep functions lightweight** - Only import what you need
2. **Use environment variables** - Avoid hardcoded values
3. **Monitor function duration** - Optimize slow operations
4. **Cache when possible** - Reduce external API calls

---

🎉 **Your Ghost-Razorpay integration is now live on Vercel!**

Need help? Check the [main README](README.md) or Vercel's documentation.
