# Ghost + Razorpay + Vercel Integration

A complete serverless solution for integrating Razorpay payments with Ghost CMS, deployable on Vercel with one click.

## 🚀 Features

- **Serverless Backend**: Optimized for Vercel deployment
- **Razorpay Integration**: Complete payment processing with webhooks
- **Ghost CMS Integration**: Automatic member creation and management
- **Theme Snippets**: Ready-to-use HTML/CSS/JS for your Ghost theme
- **Multiple Payment Tiers**: Support for different membership levels
- **Webhook Support**: Automatic payment verification and member updates
- **Error Handling**: Comprehensive error handling and logging
- **Mobile Responsive**: Works seamlessly on all devices

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Razorpay Account**: [Sign up at Razorpay](https://razorpay.com/)
2. **Ghost Website**: Self-hosted or Ghost Pro
3. **Vercel Account**: [Sign up at Vercel](https://vercel.com/)
4. **GitHub Account**: For code repository

## 🛠 Quick Setup (5 Minutes)

### Step 1: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghost-razorpay-vercel)

Or manually:

1. Fork/clone this repository
2. Connect your GitHub repo to Vercel
3. Deploy to Vercel

### Step 2: Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Ghost Configuration  
GHOST_URL=https://your-ghost-site.com
GHOST_ADMIN_API_KEY=your_ghost_admin_api_key
GHOST_CONTENT_API_KEY=your_ghost_content_api_key

# Application Configuration
WEBHOOK_SECRET=your_webhook_secret_for_razorpay
BASE_URL=https://your-vercel-deployment-url.vercel.app

# Optional: Custom redirect URLs
SUCCESS_REDIRECT_URL=https://your-ghost-site.com/thank-you
CANCEL_REDIRECT_URL=https://your-ghost-site.com/payment-cancelled

# Payment Configuration
DEFAULT_CURRENCY=INR
DEFAULT_AMOUNT=100000
```

### Step 3: Setup Razorpay Webhook

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Create new webhook with URL: `https://your-vercel-deployment-url.vercel.app/api/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy the webhook secret to your environment variables

### Step 4: Get Ghost API Keys

#### Admin API Key:
1. Go to Ghost Admin → Integrations
2. Create a new custom integration
3. Copy the Admin API Key

#### Content API Key:
1. In the same integration
2. Copy the Content API Key

### Step 5: Add to Your Ghost Theme

Choose one of these options:

#### Option A: Full Payment Form
1. Add this to your theme's `default.hbs` before `</head>`:
```html
<script src="https://your-vercel-deployment-url.vercel.app/payment-integration.js"></script>
```

2. Copy the content from `ghost-theme-snippets/payment-button.hbs` and add it to any page/post template.

#### Option B: Simple Button
1. Add the script (same as above)
2. Copy the content from `ghost-theme-snippets/simple-button.hbs`

## 📁 Project Structure

```
ghost-razorpay-vercel/
├── api/
│   └── index.js                 # Main serverless function
├── public/
│   └── payment-integration.js   # Frontend integration script
├── ghost-theme-snippets/
│   ├── payment-button.hbs       # Full payment form
│   ├── simple-button.hbs        # Simple payment button
│   ├── header-integration.hbs   # Script inclusion
│   └── THEME_INTEGRATION.md     # Theme integration guide
├── package.json                 # Dependencies
├── vercel.json                  # Vercel configuration
├── environment.example          # Environment variables template
└── README.md                    # This file
```

## 🔧 API Endpoints

### `POST /api/create-order`
Creates a new Razorpay order.

**Request:**
```json
{
  "amount": 100000,
  "currency": "INR",
  "memberEmail": "user@example.com",
  "memberName": "John Doe",
  "membershipTier": "basic"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_xyz",
  "amount": 100000,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

### `POST /api/verify-payment`
Verifies payment and creates/updates Ghost member.

**Request:**
```json
{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature",
  "memberEmail": "user@example.com",
  "memberName": "John Doe",
  "membershipTier": "basic"
}
```

### `POST /api/webhook`
Handles Razorpay webhooks for automatic member updates.

### `GET /api/health`
Health check endpoint.

## 🎨 Customization

### Payment Amounts
Update amounts in the frontend JavaScript:
```javascript
case 'basic':
    amount = 100000; // ₹1,000 in paise
    break;
case 'premium':
    amount = 250000; // ₹2,500 in paise
    break;
```

### Styling
All CSS is included inline. You can:
- Move styles to your theme's CSS file
- Customize colors, fonts, and layout
- Add your own branding

### Membership Tiers
Add custom labels in Ghost Admin and reference them in your payment form:
```javascript
membershipTier: 'pro' // Will add 'paid-pro' label to Ghost member
```

## 🧪 Testing

### Local Development
1. Clone the repository
2. Copy `environment.example` to `.env`
3. Fill in your credentials
4. Run: `npm install && npm run dev`

### Razorpay Test Mode
Use these test credentials:
- Key ID: `rzp_test_xxxxxxxxxx`
- Use test card: `4111 1111 1111 1111`

### Test Payment Flow
1. Fill in the payment form
2. Use test card details
3. Verify member creation in Ghost Admin
4. Check webhook logs in Vercel

## 🚨 Security Considerations

- Always use HTTPS in production
- Keep your API keys secure
- Validate webhook signatures
- Use environment variables for sensitive data
- Enable CORS only for your domain

## 📱 Mobile Support

The integration is fully responsive and supports:
- Mobile browsers
- Progressive Web Apps
- In-app browsers
- Touch interactions

## 🔍 Troubleshooting

### Common Issues

#### Payment fails with "Invalid signature"
- Check your Razorpay key secret
- Ensure webhook secret matches

#### Ghost member not created
- Verify Ghost API keys
- Check Ghost URL format
- Ensure proper permissions

#### Script not loading
- Verify Vercel deployment URL
- Check CORS configuration
- Test API endpoints manually

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem('debug', 'true');
```

### Logs
Check Vercel function logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. View logs for debugging

## 🔄 Updates and Maintenance

### Updating the Integration
1. Pull latest changes from repository
2. Redeploy to Vercel
3. Update theme snippets if needed

### Monitoring
- Monitor Vercel function logs
- Check Razorpay dashboard for failed payments
- Review Ghost member creation logs

## 📞 Support

### Getting Help
1. Check this README thoroughly
2. Review the troubleshooting section
3. Check browser console for errors
4. Review Vercel function logs

### Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use this for personal and commercial projects.

## 🙏 Acknowledgments

- [Ghost CMS](https://ghost.org/) - Publishing platform
- [Razorpay](https://razorpay.com/) - Payment gateway
- [Vercel](https://vercel.com/) - Serverless deployment platform

---

**Ready to accept payments on your Ghost site?** Follow the quick setup guide above and you'll be up and running in 5 minutes! 🚀
