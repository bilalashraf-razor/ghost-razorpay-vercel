# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### 1. Configure Environment
```bash
cp config.env.template .env
```

Edit `.env` with your values:
- `GHOST_ADMIN_API_URL`: Your Ghost site admin API URL
- `GHOST_ADMIN_API_KEY`: From Ghost Admin → Settings → Integrations → Add custom integration
- `RAZORPAY_WEBHOOK_SECRET`: From Razorpay Dashboard → Settings → Webhooks

### 2. Install and Test
```bash
npm install
npm test
```

### 3. Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
# Add environment variables in Vercel dashboard
vercel --prod
```

**Or run locally:**
```bash
npm start
```

### 4. Configure Razorpay Webhook
- Go to Razorpay Dashboard → Webhooks
- Add webhook URL: `https://your-project.vercel.app/webhook/razorpay` (or your server URL)
- Select event: `payment.captured`
- Save webhook secret to `.env` (or Vercel environment variables)

### 5. Update Payment Button
Add user email to your payment form:

```html
<script 
  src="https://checkout.razorpay.com/v1/payment-button.js" 
  data-payment_button_id="pl_RLuBHhoEqDrQTD"
  data-notes.email="{{@member.email}}"
  async> 
</script>
```

## ✅ That's it!

When users pay, they'll automatically become Ghost members with the `paid-member` label.

## Next Steps
- Set up Ghost member tiers
- Configure member-only content
- Monitor webhook logs
- Deploy to production server

See [README.md](README.md) for detailed documentation.
