# 🚀 Quick Setup Guide

Get your Ghost + Razorpay integration running in **3 minutes**!

## ✅ What's Changed

Switched from complex custom integration to **simple Razorpay payment button** approach:

- ❌ No custom JavaScript needed
- ❌ No complex payment forms
- ❌ No CORS issues
- ✅ Just Razorpay's battle-tested payment button
- ✅ Simple webhook handler
- ✅ Automatic Ghost member creation

## 📋 Quick Checklist

### 1. Deploy Backend (1 minute)
- [ ] Deploy to Vercel: [One-click deploy](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghost-razorpay-vercel)
- [ ] Note your Vercel URL: `https://your-app.vercel.app`

### 2. Configure Vercel (1 minute)
Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

- [ ] `GHOST_URL` = `https://your-ghost-site.com`
- [ ] `GHOST_ADMIN_API_KEY` = Get from Ghost Admin → Integrations
- [ ] `RAZORPAY_WEBHOOK_SECRET` = Get from Razorpay (step 4)

### 3. Setup Razorpay (1 minute)
- [ ] Go to Razorpay Dashboard → **Payment Button**
- [ ] Create new payment button (enable email collection)
- [ ] Copy your button ID: `pl_xxxxxxxxx`
- [ ] Go to **Settings** → **Webhooks**
- [ ] Add webhook: `https://your-vercel-url.vercel.app/webhook`
- [ ] Select event: `payment.captured`
- [ ] Copy webhook secret → Add to Vercel environment variables

### 4. Add to Ghost Theme (30 seconds)
Add this code where you want the payment button:

```html
<div style="text-align: center; margin: 30px 0;">
    <h3>Subscribe to Premium Content</h3>
    
    <form>
        <script 
            src="https://checkout.razorpay.com/v1/payment-button.js" 
            data-payment_button_id="pl_YOUR_BUTTON_ID" 
            async> 
        </script> 
    </form>
    
    <p><small>Secure payment via Razorpay</small></p>
</div>
```

**Replace `pl_YOUR_BUTTON_ID` with your actual button ID!**

## 🧪 Test It

1. **Visit**: `https://your-vercel-url.vercel.app/` (should show "OK" status)
2. **Test payment** with card: `4111 1111 1111 1111`
3. **Check** Ghost Admin → Members for new member

## 🎉 You're Done!

Your customers can now:
1. Click your Razorpay payment button
2. Complete payment via Razorpay
3. Automatically become Ghost members
4. Access premium content

## 🔧 Customization

### Payment Button Styling
Use the pre-made snippets in `ghost-theme-snippets/`:
- `razorpay-button.hbs` - Full featured section
- `simple-razorpay-button.hbs` - Minimal version

### Multiple Plans
Create multiple payment buttons in Razorpay Dashboard for different amounts.

### Member Labels
Members get tagged with:
- `paid-member`
- `razorpay-verified`

## 📞 Need Help?

1. **Check Vercel logs**: Vercel Dashboard → Functions → Logs
2. **Check Razorpay logs**: Razorpay Dashboard → Webhooks → Logs
3. **Test webhook**: Visit your webhook URL directly
4. **Verify environment variables**: All 3 variables set correctly

---

**Total setup time: 3 minutes** ⏱️

**Maintenance required: Zero** 🎯
