# Ghost Theme Integration Guide (Simple Version)

This guide shows you how to add Razorpay payment buttons to your Ghost theme.

## 🎯 Quick Integration

### Step 1: Get Your Payment Button ID

1. Go to Razorpay Dashboard → **Payment Button**
2. Find your payment button ID (e.g., `pl_RLuBHhoEqDrQTD`)
3. Copy this ID - you'll need it below

### Step 2: Choose Your Style

#### Option A: Full Payment Section (Recommended)

Copy the contents of `razorpay-button.hbs` and paste it where you want the payment section to appear.

**Features:**
- Professional styling
- Payment benefits list  
- Responsive design
- Dark mode support

#### Option B: Simple Button

Copy the contents of `simple-razorpay-button.hbs` for a minimal integration.

**Features:**
- Minimal styling
- Quick integration
- Small footprint

### Step 3: Update Payment Button ID

**IMPORTANT**: Replace `pl_RLuBHhoEqDrQTD` with your actual payment button ID in the code:

```html
<script 
    src="https://checkout.razorpay.com/v1/payment-button.js" 
    data-payment_button_id="YOUR_ACTUAL_BUTTON_ID" 
    async> 
</script>
```

## 📍 Where to Add the Code

### In a Page Template
1. Create a new page in Ghost Admin (e.g., "Subscribe")
2. Switch to HTML mode
3. Add the payment button code
4. Publish the page

### In a Post Template
Add the code to your `post.hbs` template to show on all posts:

```handlebars
{{#post}}
    <article>
        {{content}}
        
        <!-- Add payment button after content -->
        {{> razorpay-button}}
    </article>
{{/post}}
```

### As a Partial
1. Create `partials/razorpay-button.hbs` in your theme
2. Add the payment button code
3. Include it anywhere using: `{{> razorpay-button}}`

### In the Homepage
Add to your `index.hbs` or `home.hbs` template.

## 🎨 Customization

### Styling
All CSS is included inline. You can:
- Move styles to your theme's CSS file
- Customize colors and fonts
- Modify layout and spacing
- Add animations

### Payment Amounts
Create multiple payment buttons in Razorpay Dashboard for different amounts:
- Basic: ₹999/month
- Premium: ₹1999/month  
- Pro: ₹4999/year

### Content
Customize the text and benefits list:
```html
<div class="payment-features">
    <ul>
        <li>✓ Your benefit 1</li>
        <li>✓ Your benefit 2</li>
        <li>✓ Your benefit 3</li>
    </ul>
</div>
```

## 📱 Mobile Optimization

The Razorpay payment button is automatically mobile-optimized:
- Responsive design
- Touch-friendly
- Works with all mobile wallets
- Supports UPI payments

## 🔧 Advanced Customization

### Multiple Payment Options
Add multiple buttons for different plans:

```html
<div class="payment-plans">
    <!-- Basic Plan -->
    <div class="plan">
        <h4>Basic - ₹999/month</h4>
        <form>
            <script 
                src="https://checkout.razorpay.com/v1/payment-button.js" 
                data-payment_button_id="pl_BASIC_BUTTON_ID" 
                async> 
            </script>
        </form>
    </div>
    
    <!-- Premium Plan -->
    <div class="plan">
        <h4>Premium - ₹1999/month</h4>
        <form>
            <script 
                src="https://checkout.razorpay.com/v1/payment-button.js" 
                data-payment_button_id="pl_PREMIUM_BUTTON_ID" 
                async> 
            </script>
        </form>
    </div>
</div>
```

### Conditional Display
Show payment button only for specific posts or pages:

```handlebars
{{#has tag="premium"}}
    {{> razorpay-button}}
{{/has}}

{{#is "page"}}
    {{#if slug "subscribe"}}
        {{> razorpay-button}}
    {{/if}}
{{/is}}
```

### Member-Only Content
Hide payment button for existing members:

```handlebars
{{^@member}}
    {{> razorpay-button}}
{{else}}
    <p>Welcome back, {{@member.name}}! You have access to all premium content.</p>
{{/@member}}
```

## ⚡ Performance Tips

1. **Async Loading**: The script loads asynchronously - no performance impact
2. **Caching**: Razorpay's CDN handles caching automatically
3. **Minimal Code**: Very lightweight integration

## 🧪 Testing

### Test Mode
1. Use Razorpay test credentials
2. Create test payment buttons
3. Use test card: `4111 1111 1111 1111`

### Live Mode
1. Switch to live credentials in Razorpay
2. Update payment button IDs
3. Test with small amounts first

## 🚨 Troubleshooting

### Button Not Showing
- Check browser console for errors
- Verify payment button ID is correct
- Ensure button is published in Razorpay Dashboard

### Payment Not Working
- Check if you're in test/live mode correctly
- Verify webhook is configured
- Check Vercel function logs

### Styling Issues
- Check CSS conflicts with your theme
- Use browser dev tools to debug
- Ensure responsive styles work

## 📞 Support

### Getting Help
1. Check Ghost theme documentation
2. Review Razorpay payment button docs
3. Test in browser dev tools
4. Check Vercel logs for webhook issues

---

**Your payment integration is ready!** 🎉

Remember to replace the payment button ID with your actual ID from Razorpay Dashboard.