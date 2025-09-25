# Ghost + Razorpay Serverless Integration

**Automatically create Ghost CMS members when customers pay through Razorpay payment buttons.**


--

## **Architecture**

```
Customer Payment → Razorpay Button → Webhook → Ghost Member → Content Access
```

**Key Components:**
- **Frontend**: Razorpay payment button (1 script tag)
- **Backend**: Vercel serverless webhook handler  
- **Integration**: Ghost Admin API for member management

---

## **Setup**

### **Step 1: Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghost-razorpay-vercel)

**Or manually:**
```bash
git clone https://github.com/bilalashraf-razor/ghost-razorpay-vercel
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
3. **CRITICAL**: Enable **"Collect customer details"** and **"Email"** 
4. **Save** and copy button ID (e.g., `pl_xyz123`)

#### **B. Setup Webhook**
1. **Razorpay Dashboard** → **Settings** → **Webhooks** → **Create New**
2. **URL**: `https://your-vercel-deployment.vercel.app/api/webhook`
3. **Events**: Select **`payment.captured`** 
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

## **Payment Flow**

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

## 🚨 **Troubleshooting Guide**

### **Diagnosis Steps**

1. **Check Status Page**: Visit `/api/` for environment status
2. **Test Payment**: Use test card `4111 1111 1111 1111`
3. **Check Logs**: Vercel → Functions → Logs
4. **Verify Webhook**: Razorpay → Webhooks → Logs

### **Common Issues**

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

## **Advanced Features**

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

---
