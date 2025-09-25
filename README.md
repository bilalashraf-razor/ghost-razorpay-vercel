# Ghost + Razorpay Payment Button Integration

A **simple serverless webhook handler** for integrating Razorpay payment buttons with Ghost CMS. No complex frontend code required!

## 🚀 Features

- **Ultra Simple**: Uses Razorpay's payment button - no custom JavaScript needed
- **Serverless**: Optimized for Vercel deployment
- **Automatic**: Creates Ghost members automatically when payments are received
- **Secure**: Webhook signature verification for safety
- **Responsive**: Razorpay's button works perfectly on all devices
- **Zero Maintenance**: No complex payment flow to maintain

## 📋 Prerequisites

1. **Razorpay Account**: [Sign up at Razorpay](https://razorpay.com/)
2. **Ghost Website**: Self-hosted or Ghost Pro
3. **Vercel Account**: [Sign up at Vercel](https://vercel.com/)

## 🛠 Quick Setup (3 Minutes)

### Step 1: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghost-razorpay-vercel)

Or manually:
1. Fork/clone this repository
2. Connect your GitHub repo to Vercel
3. Deploy to Vercel

### Step 2: Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```env
# Ghost Configuration  
GHOST_URL=https://your-ghost-site.com
GHOST_ADMIN_API_KEY=your_ghost_admin_api_key

# Razorpay Webhook
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay
```

### Step 3: Create Razorpay Payment Button

1. Go to Razorpay Dashboard → **Payment Button**
2. **Create New Payment Button** with your desired amount
3. **Important Settings**:
   - ✅ Enable "Collect customer details"
   - ✅ Enable "Email" collection
   - ✅ Enable "Send receipt to customer"
4. **Copy** your payment button ID (e.g., `pl_xxxxxxxxx`)

### Step 4: Setup Webhook

1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. **Add webhook URL**: `https://your-vercel-deployment-url.vercel.app/api/webhook`
3. **Select events**: `payment.captured`
4. **Save** and copy the webhook secret
5. **Add** the webhook secret to your Vercel environment variables

### Step 5: Get Ghost API Key

1. Go to Ghost Admin → **Integrations**
2. **Create** a new custom integration
3. **Copy** the Admin API Key
4. **Add** it to your Vercel environment variables

### Step 6: Add Payment Button to Ghost Theme

Add this code to any page in your Ghost theme:

```html
<div class="razorpay-payment-section">
    <div class="payment-content">
        <h3>Subscribe to Premium Content</h3>
        <p>Support our work and get exclusive access.</p>
        
        <!-- Replace pl_RLuBHhoEqDrQTD with your actual payment button ID -->
        <form>
            <script 
                src="https://checkout.razorpay.com/v1/payment-button.js" 
                data-payment_button_id="pl_RLuBHhoEqDrQTD" 
                async> 
            </script> 
        </form>
        
        <p><small>Secure payment powered by Razorpay</small></p>
    </div>
</div>

<style>
.razorpay-payment-section {
    max-width: 500px;
    margin: 40px auto;
    padding: 30px;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    background: #f8f9fa;
    text-align: center;
}

.payment-content h3 {
    color: #2c3e50;
    margin-bottom: 15px;
}

.payment-content p {
    color: #666;
    margin-bottom: 20px;
}
</style>
```

**Important**: Replace `pl_RLuBHhoEqDrQTD` with your actual Razorpay payment button ID.

## 📁 Project Structure

```
ghost-razorpay-vercel/
├── api/
│   └── index.js                    # Webhook handler
├── ghost-theme-snippets/
│   ├── razorpay-button.hbs        # Full payment section
│   └── simple-razorpay-button.hbs # Minimal button
├── package.json                    # Dependencies
├── vercel.json                     # Vercel configuration
├── environment.example             # Environment variables template
└── README.md                       # This file
```

## 🔧 How It Works

1. **Customer** clicks your Razorpay payment button
2. **Razorpay** handles the entire payment process
3. **Razorpay** sends a webhook to your Vercel function when payment succeeds
4. **Your webhook** creates/updates the Ghost member automatically
5. **Customer** becomes a member and can access premium content

## 📝 Environment Variables

Only **3 variables** needed:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GHOST_URL` | Your Ghost site URL | `https://yoursite.com` |
| `GHOST_ADMIN_API_KEY` | Ghost Admin API key | Ghost Admin → Integrations |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook secret | Razorpay Dashboard → Webhooks |

## 🧪 Testing

### Test Your API
Visit: `https://your-vercel-url.vercel.app/api`

You should see:
```json
{
  "status": "OK",
  "message": "Ghost-Razorpay Webhook Handler (Simple Version)"
}
```

### Test Payment Flow
1. Add the payment button to a test page
2. Make a test payment using Razorpay test mode
3. Check Ghost Admin → Members for the new member

### Razorpay Test Mode
- Use test credentials in Razorpay Dashboard
- Test card: `4111 1111 1111 1111`
- Any future date for expiry
- Any CVV

## ⚙️ Customization

### Payment Button Styling
The payment button uses Razorpay's default styling, but you can customize the container:

```css
/* Customize the button container */
.razorpay-payment-button {
    /* Your custom styles */
}
```

### Member Labels
Members are automatically tagged with:
- `paid-member`
- `razorpay-verified`

To customize labels, edit `api/index.js`:
```javascript
labels: ['your-custom-label', 'premium-member']
```

### Payment Amounts
Configure different amounts by creating multiple payment buttons in Razorpay Dashboard.

## 🚨 Security

- ✅ Webhook signature verification
- ✅ HTTPS only in production
- ✅ Environment variables for secrets
- ✅ Razorpay handles PCI compliance

## 📱 Mobile Support

Razorpay's payment button is fully responsive and supports:
- Mobile browsers
- In-app browsers  
- Touch interactions
- Indian payment methods (UPI, cards, wallets, etc.)

## 🔍 Troubleshooting

### Payment button not showing
- Check if the script loads without errors
- Verify your payment button ID is correct
- Ensure the button is published in Razorpay Dashboard

### Webhook not working
- Check Vercel function logs
- Verify webhook URL in Razorpay Dashboard
- Ensure webhook secret matches environment variable
- Test webhook endpoint manually

### Ghost member not created
- Verify Ghost API key has proper permissions
- Check Ghost URL format (include https://)
- Ensure customer email is collected by payment button

### Debug Logs
Check Vercel Dashboard → Functions → View Function Logs

## 🆚 Why This Approach?

| Simple Razorpay Button | Custom Integration |
|------------------------|-------------------|
| ✅ No frontend code | ❌ Complex JavaScript |
| ✅ Mobile optimized | ❌ Mobile testing needed |
| ✅ PCI compliant | ❌ Compliance complexity |
| ✅ Battle-tested UI | ❌ Custom UI maintenance |
| ✅ Zero maintenance | ❌ Regular updates needed |

## 📞 Support

### Getting Help
1. Check Vercel function logs
2. Verify Razorpay webhook logs
3. Test each component individually
4. Review Ghost member creation logs

### Common Issues
- **Webhook signature mismatch**: Check webhook secret
- **Member not created**: Verify Ghost API permissions
- **Button not showing**: Check payment button ID and status

## 🔄 Updates

To update:
1. Pull latest changes from this repository
2. Redeploy to Vercel
3. No frontend changes needed!

## 📄 License

MIT License - feel free to use for personal and commercial projects.

---

**Ready to accept payments?** Follow the 3-minute setup above and you'll be collecting payments with automatic Ghost member creation! 🚀

## 🎯 Quick Start Checklist

- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Create Razorpay payment button
- [ ] Setup webhook in Razorpay
- [ ] Get Ghost API key
- [ ] Add button to Ghost theme
- [ ] Test payment flow
- [ ] Go live!

**Total setup time: ~3 minutes** ⏱️