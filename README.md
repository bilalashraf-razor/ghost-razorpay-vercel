# 🚀 Ghost + Razorpay Serverless Integration

**Automatically create Ghost CMS members when customers pay through Razorpay payment buttons.**

Turn any Ghost website into an automated subscription business with **zero maintenance** and **infinite scalability**.

---

## ✨ **What This Does**

- 🎯 **One-click payments** via Razorpay payment buttons
- ⚡ **Instant member creation** in Ghost CMS  
- 🔄 **Automatic access** to premium content
- 📱 **Mobile-optimized** payment experience
- 🛡️ **Secure webhook** verification
- 🚀 **Serverless architecture** - scales automatically

## 🏗️ **Architecture**

```
Customer Payment → Razorpay Button → Webhook → Ghost Member → Content Access
```

**Key Components:**
- **Frontend**: Razorpay payment button (1 script tag)
- **Backend**: Vercel serverless webhook handler  
- **Integration**: Ghost Admin API for member management

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghost-razorpay-vercel)

**Or manually:**
```bash
git clone https://github.com/yourusername/ghost-razorpay-vercel
cd ghost-razorpay-vercel
vercel
```

### **Step 2: Configure Environment Variables**

In **Vercel Dashboard** → **Settings** → **Environment Variables**, add:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `GHOST_URL` | `https://your-site.ghost.io` | Your Ghost site URL |
| `GHOST_ADMIN_API_KEY` | `abc123:def456...` | Ghost Admin → Integrations |
| `RAZORPAY_WEBHOOK_SECRET` | `your_webhook_secret` | Razorpay Dashboard → Webhooks |

### **Step 3: Configure Razorpay**

#### **A. Create Payment Button**
1. **Razorpay Dashboard** → **Payment Button** → **Create New**
2. **Set amount** and currency
3. **CRITICAL**: Enable **"Collect customer details"** and **"Email"** ✅
4. **Save** and copy button ID (e.g., `pl_xyz123`)

#### **B. Setup Webhook**
1. **Razorpay Dashboard** → **Settings** → **Webhooks** → **Create New**
2. **URL**: `https://your-vercel-deployment.vercel.app/api/webhook`
3. **Events**: Select **`payment.captured`** ✅
4. **Save** and copy webhook secret
5. **Add secret** to Vercel environment variables

### **Step 4: Get Ghost API Key**

1. **Ghost Admin** → **Settings** → **Integrations** → **Add custom integration**
2. **Name**: "Razorpay Integration"
3. **Copy Admin API Key** (format: `key_id:key_secret`)
4. **Add to Vercel** environment variables

### **Step 5: Add to Ghost Theme**

Add this **one line** to your Ghost theme where you want the payment button:

```html
<form>
    <script 
        src="https://checkout.razorpay.com/v1/payment-button.js" 
        data-payment_button_id="pl_YOUR_BUTTON_ID" 
        async> 
    </script> 
</form>
```

**Replace `pl_YOUR_BUTTON_ID` with your actual button ID from step 3A.**

---

## 🧪 **Testing Your Integration**

### **1. Verify Deployment**
Visit: `https://your-deployment.vercel.app/api/`

**Expected Result:**
```
✅ Webhook Handler is Live!
Environment Status:
• Ghost URL: https://your-site.ghost.io ✅
• Ghost API Key: Set ✅  
• Webhook Secret: Set ✅
```

### **2. Test Payment Flow**
1. **Use Razorpay test credentials**
2. **Test card**: `4111 1111 1111 1111` (any future date, any CVV)
3. **Complete payment** on your Ghost site
4. **Check Ghost Admin** → **Members** for new member

### **3. Monitor Logs**
- **Vercel**: Dashboard → Functions → Logs
- **Razorpay**: Dashboard → Webhooks → Logs

---

## 📁 **Project Structure**

```
ghost-razorpay-vercel/
├── api/
│   ├── index.js          # Status page & health check
│   ├── webhook.js        # Payment webhook handler
│   └── debug.js          # Environment diagnostics
├── vercel.json           # Serverless routing configuration
├── package.json          # Dependencies
└── README.md             # This file
```

---

## 🔧 **API Endpoints**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/` | GET | Status page with environment diagnostics |
| `/api/webhook` | POST | Receives Razorpay payment notifications |
| `/api/debug` | GET | Environment variable debugging |

---

## 🔄 **Payment Flow Explained**

### **1. Customer Journey**
```
Visit Ghost site → See payment button → Click subscribe → 
Razorpay payment page → Enter payment details → Payment success
```

### **2. Behind the Scenes**
```
Payment captured → Razorpay webhook → Signature verification → 
Email extraction → Ghost API call → Member created → Access granted
```

### **3. What Customer Sees**
- **Professional payment interface** (Razorpay)
- **Instant access** to premium content
- **Email confirmation** with payment receipt
- **Seamless Ghost login** for content access

---

## 🛡️ **Security Features**

- **🔐 Webhook signature verification** - Prevents fake payment notifications
- **🌍 CORS protection** - Secure cross-origin requests
- **🔒 Environment variables** - Secure credential storage  
- **🛡️ Input validation** - Sanitizes all webhook data
- **⚡ Error handling** - Graceful failure without data exposure

---

## 🎨 **Customization Options**

### **Multiple Payment Tiers**
```html
<!-- Basic Plan -->
<script data-payment_button_id="pl_BASIC_ID" ...></script>

<!-- Premium Plan -->  
<script data-payment_button_id="pl_PREMIUM_ID" ...></script>

<!-- Pro Plan -->
<script data-payment_button_id="pl_PRO_ID" ...></script>
```

### **Custom Member Labels**
Edit `api/webhook.js`:
```javascript
labels: ['tier-basic', 'verified-' + paymentMethod, 'expires-' + expiryDate]
```

### **Payment Success Actions**
Add custom logic after member creation:
```javascript
// Send welcome email
// Add to mailing list  
// Grant specific content access
// Track analytics event
```

---

## 🚨 **Troubleshooting Guide**

### **🔍 Diagnosis Steps**

1. **Check Status Page**: Visit `/api/` for environment status
2. **Test Payment**: Use test card `4111 1111 1111 1111`
3. **Check Logs**: Vercel → Functions → Logs
4. **Verify Webhook**: Razorpay → Webhooks → Logs

### **❌ Common Issues**

#### **"No POST requests in logs"**
- **Cause**: Webhook not configured or wrong URL
- **Fix**: Set webhook URL to `https://your-app.vercel.app/api/webhook`

#### **"Invalid signature" error**  
- **Cause**: Webhook secret mismatch
- **Fix**: Copy exact secret from Razorpay to Vercel environment

#### **"No customer email in payment"**
- **Cause**: Email collection disabled in payment button
- **Fix**: Enable "Collect customer details" and "Email"

#### **"Ghost API error"**
- **Cause**: Wrong Ghost API credentials
- **Fix**: Verify API key format and Ghost URL

---

## 🌟 **Advanced Features**

### **Subscription Management**
Extend for recurring subscriptions:
```javascript
// Handle subscription events
if (event === 'subscription.charged') {
  // Extend member access period
  // Send renewal confirmation
}
```

### **Refund Handling**
```javascript
// Handle refund events
if (event === 'payment.refunded') {
  // Remove member labels
  // Revoke content access
}
```

### **Analytics Integration**
```javascript
// Track payment events
analytics.track('subscription_purchased', {
  amount: payment.amount,
  email: customerEmail,
  plan: membershipTier
});
```

---

## 📞 **Support & Community**

### **Getting Help**
1. **GitHub Issues**: Report bugs and feature requests
2. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
3. **Razorpay Docs**: [razorpay.com/docs](https://razorpay.com/docs)
4. **Ghost API Docs**: [ghost.org/docs/admin-api](https://ghost.org/docs/admin-api)

### **Contributing**
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

---

**🎉 Ready to launch your automated subscription system?**

**Total setup time: 5 minutes** ⏱️  
**Maintenance required: Zero** 🎯  
**Scalability: Infinite** 📈

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghost-razorpay-vercel)