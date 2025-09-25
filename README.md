# Ghost-Razorpay Integration

This Node.js application integrates Razorpay payments with Ghost CMS membership system. When users make payments through your Razorpay payment button, this service automatically creates or updates their membership in Ghost.

## Features

- ✅ Webhook handler for Razorpay payment events
- ✅ Automatic Ghost member creation/update
- ✅ Secure webhook signature verification
- ✅ Support for multiple payment tiers
- ✅ Comprehensive error handling and logging
- ✅ Health check endpoint for monitoring

## Prerequisites

1. **Ghost CMS** with Admin API access
2. **Razorpay** account with payment button configured
3. **Node.js** (v14 or higher)
4. **Public server** or tunnel service (for webhook endpoint)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd /path/to/ghost-rzp
npm install
```

### 2. Environment Configuration

Copy the configuration template:
```bash
cp config.env.template .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=3000

# Ghost Admin API Configuration
GHOST_ADMIN_API_URL=https://your-ghost-site.com/ghost/api/admin
GHOST_ADMIN_API_KEY=your_admin_api_key_here

# Razorpay Configuration
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Get Ghost Admin API Key

1. Go to your Ghost Admin panel → Settings → Integrations
2. Click "Add custom integration"
3. Name it "Razorpay Integration"
4. Copy the Admin API Key (format: `id:secret`)
5. Add it to your `.env` file

### 4. Configure Razorpay Webhook

1. Log into your Razorpay Dashboard
2. Go to Settings → Webhooks
3. Create a new webhook with URL: `https://your-server.com/webhook/razorpay`
4. Select these events:
   - `payment.captured`
   - `payment.failed` (optional, for logging)
5. Copy the webhook secret and add it to your `.env` file

### 5. Update Your Payment Button

Modify your Ghost page/post to include user email in the payment button:

```html
<form>
  <script 
    src="https://checkout.razorpay.com/v1/payment-button.js" 
    data-payment_button_id="pl_RLuBHhoEqDrQTD"
    data-notes.email="{{@member.email}}"
    data-notes.name="{{@member.name}}"
    async> 
  </script> 
</form>
```

Or for non-members, use a form to collect email:

```html
<div id="razorpay-payment">
  <input type="email" id="user-email" placeholder="Enter your email" required>
  <button onclick="openRazorpay()">Pay Now</button>
</div>

<script>
function openRazorpay() {
  const email = document.getElementById('user-email').value;
  if (!email) {
    alert('Please enter your email');
    return;
  }
  
  const options = {
    "key": "rzp_live_your_key_here", // Your Razorpay key
    "amount": 50000, // Amount in paisa (500 INR)
    "currency": "INR",
    "name": "Your Site Name",
    "description": "Membership Payment",
    "prefill": {
      "email": email
    },
    "notes": {
      "email": email
    },
    "handler": function (response) {
      alert('Payment successful! You will receive access shortly.');
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
}
</script>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)
See [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for complete Vercel deployment guide.

**Quick Vercel deployment:**
```bash
npm install -g vercel
vercel login
vercel
# Add environment variables in Vercel dashboard
vercel --prod
```

**Benefits:**
- ✅ Free hosting (100GB bandwidth/month)
- ✅ Automatic deployments from Git
- ✅ Global CDN and auto-scaling
- ✅ Built-in SSL certificates
- ✅ Easy environment variable management

### Option 2: Railway
1. Create account at [Railway](https://railway.app)
2. Connect your repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Option 2: Heroku
1. Create Heroku app: `heroku create your-app-name`
2. Set environment variables: `heroku config:set GHOST_ADMIN_API_URL=...`
3. Deploy: `git push heroku main`

### Option 3: VPS/DigitalOcean
1. Set up Node.js on your server
2. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ghost-razorpay
   pm2 startup
   pm2 save
   ```
3. Set up reverse proxy with Nginx

### Option 4: ngrok (Development/Testing)
```bash
npm install -g ngrok
ngrok http 3000
# Use the ngrok URL for Razorpay webhook
```

## API Endpoints

- **GET** `/health` - Health check
- **POST** `/webhook/razorpay` - Razorpay webhook handler

## How It Works

1. User clicks payment button on your Ghost site
2. User completes payment on Razorpay
3. Razorpay sends webhook to your server
4. Server verifies webhook signature
5. Server creates/updates Ghost member with 'paid-member' label
6. Member gains access to paid content in Ghost

## Payment Tiers (Optional)

You can configure different membership tiers based on payment amounts by modifying the `getPaymentTier` function in `services/razorpayService.js`.

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check if webhook URL is publicly accessible
   - Verify webhook secret is correct
   - Check Razorpay webhook logs

2. **Ghost API errors**
   - Verify Admin API key format
   - Check Ghost site URL is correct
   - Ensure API key has proper permissions

3. **Member not created**
   - Check server logs for errors
   - Verify email is being passed in payment
   - Check Ghost member creation settings

### Logs
Check application logs for detailed error information:
```bash
# In development
npm run dev

# In production with PM2
pm2 logs ghost-razorpay
```

## Security Considerations

- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Store API keys securely
- Implement rate limiting for production
- Monitor webhook endpoint for suspicious activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Test webhook delivery in Razorpay dashboard
4. Verify Ghost API connectivity

---

**Note**: This integration assumes you're using Ghost's member system. Make sure your Ghost site has membership features enabled.
