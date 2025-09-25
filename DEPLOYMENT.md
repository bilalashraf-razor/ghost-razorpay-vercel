# Deployment Guide (Simple Version)

This guide provides step-by-step instructions for deploying the simplified Ghost-Razorpay webhook handler to Vercel.

## 🚀 One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghost-razorpay-vercel)

## 📋 Manual Deployment Steps

### 1. Prepare Your Repository

```bash
# Clone or fork this repository
git clone https://github.com/yourusername/ghost-razorpay-vercel.git
cd ghost-razorpay-vercel

# Install dependencies (optional, for local testing)
npm install
```

### 2. Create Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel
```

Follow the prompts:
- Link to existing project? **N**
- Project name: `ghost-razorpay-integration` (or your preferred name)
- Deploy to current directory? **Y**

### 3. Configure Environment Variables

#### Via Vercel Dashboard:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable from the list below

#### Via Vercel CLI:
```bash
# Add environment variables
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add GHOST_URL
vercel env add GHOST_ADMIN_API_KEY
vercel env add GHOST_CONTENT_API_KEY
vercel env add WEBHOOK_SECRET
vercel env add BASE_URL
```

### 4. Required Environment Variables

**Only 3 variables needed:**

```env
# Ghost Configuration
GHOST_URL=https://your-ghost-site.com
GHOST_ADMIN_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Razorpay Webhook Secret (Get from Razorpay Dashboard → Webhooks)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay

# Optional: Your Vercel deployment URL (for documentation)
BASE_URL=https://your-project-name.vercel.app
```

### 5. Domain Configuration (Optional)

#### Add Custom Domain:
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed
4. Update `BASE_URL` environment variable

### 6. Set Up Razorpay Payment Button and Webhook

#### Create Payment Button:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Payment Button**
3. **Create New Payment Button**
4. Configure:
   - Amount and currency
   - ✅ Enable "Collect customer details"
   - ✅ Enable "Email" collection
   - ✅ Enable "Send receipt to customer"
5. **Save** and copy the payment button ID (e.g., `pl_xxxxxxxxx`)

#### Setup Webhook:
1. Go to **Settings** → **Webhooks**
2. Click "Create New Webhook"
3. Enter webhook URL: `https://your-vercel-url.vercel.app/api/webhook`
4. Select events: **`payment.captured`** only
5. Save and copy the webhook secret
6. Add the secret to your Vercel environment variables as `RAZORPAY_WEBHOOK_SECRET`

## 🔧 Advanced Configuration

### Custom Build Commands

The project uses default Vercel configuration, but you can customize in `vercel.json`:

```json
{
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### Function Configuration

To optimize serverless functions:

```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  }
}
```

### Environment-Specific Deployments

#### Production
```bash
vercel --prod
```

#### Preview/Staging
```bash
vercel
```

## 🧪 Testing Your Deployment

### 1. Test Webhook Endpoint

```bash
# Health check
curl https://your-vercel-url.vercel.app/api
```

You should see:
```json
{
  "status": "OK",
  "message": "Ghost-Razorpay Webhook Handler (Simple Version)"
}
```

### 2. Test Payment Button

1. Copy the payment button snippet to your Ghost theme
2. Replace `pl_RLuBHhoEqDrQTD` with your actual payment button ID
3. Test the payment flow with Razorpay test credentials

### 3. Test Full Flow

1. Make a test payment using test card: `4111 1111 1111 1111`
2. Check Vercel function logs for webhook processing
3. Verify member creation in Ghost Admin → Members

## 📊 Monitoring

### Vercel Analytics

Enable analytics in Vercel Dashboard:
1. Go to Analytics tab
2. Enable Real-Time Analytics
3. Monitor function performance

### Error Tracking

Monitor errors through:
1. Vercel function logs
2. Browser console (for frontend issues)
3. Razorpay dashboard (for payment issues)

### Performance Optimization

1. **Cold Start Optimization**: Functions warm up automatically
2. **Caching**: API responses are cached appropriately
3. **CDN**: Static files served via Vercel Edge Network

## 🔄 Updates and Maintenance

### Updating Your Deployment

```bash
# Pull latest changes
git pull origin main

# Deploy updates
vercel --prod
```

### Environment Variable Updates

```bash
# Update specific variable
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME

# Or use Vercel Dashboard
```

### Rollback

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote DEPLOYMENT_URL
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
- Check package.json syntax
- Verify all dependencies are listed
- Review build logs in Vercel Dashboard

#### Environment Variable Issues
- Ensure all required variables are set
- Check for typos in variable names
- Verify values don't contain special characters

#### API Errors
- Check function logs in Vercel Dashboard
- Verify external API credentials (Razorpay, Ghost)
- Test endpoints individually

### Debug Mode

Enable verbose logging:
```bash
vercel dev --debug
```

## 📞 Support

### Getting Help

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **GitHub Issues**: Report bugs in the repository
3. **Community**: Join relevant Discord/Slack communities

### Performance Monitoring

Monitor your deployment:
- Function execution time
- Error rates
- Memory usage
- Request volume

---

**Your Ghost-Razorpay integration is now live!** 🎉

Test thoroughly and monitor the deployment for any issues.
