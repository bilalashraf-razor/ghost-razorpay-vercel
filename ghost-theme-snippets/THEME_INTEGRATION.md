# Ghost Theme Integration Guide

This guide explains how to integrate Razorpay payments into your Ghost theme.

## Quick Integration Steps

### 1. Add the Integration Script to Your Theme

Add this line to your theme's `default.hbs` file, right before the closing `</head>` tag:

```html
<script src="YOUR_VERCEL_DEPLOYMENT_URL/payment-integration.js"></script>
```

**Important:** Replace `YOUR_VERCEL_DEPLOYMENT_URL` with your actual Vercel deployment URL.

### 2. Choose Your Integration Method

#### Option A: Full Payment Form (Recommended)
Copy the contents of `payment-button.hbs` and paste it where you want the payment form to appear (e.g., in a page template, post template, or as a partial).

#### Option B: Simple Button
Copy the contents of `simple-button.hbs` for a minimal integration that prompts users for their details.

### 3. Update Configuration

In the integration code, make sure to replace:
- `YOUR_VERCEL_DEPLOYMENT_URL` with your actual Vercel deployment URL
- Customize amounts, tiers, and redirect URLs as needed

## Integration Examples

### In a Page Template
1. Create a new page in Ghost Admin (e.g., "Subscribe")
2. Add the payment form code to the page template (e.g., `page-subscribe.hbs`)
3. Publish the page

### In a Post Template
Add the payment button to your `post.hbs` template to show it on all posts, or create a specific post template.

### As a Partial
Create a new partial file (e.g., `partials/payment-form.hbs`) and include it using:
```handlebars
{{> payment-form}}
```

## Customization Options

### Styling
All CSS is included inline in the snippets. You can:
- Move styles to your theme's CSS file
- Customize colors, fonts, and layout
- Add animations and transitions

### Payment Amounts
Update the amounts in both the HTML options and JavaScript switch statement:
```javascript
case 'basic':
    amount = 100000; // ₹1,000 (in paise)
    break;
```

### Redirect URLs
Customize where users go after payment:
```javascript
successRedirectUrl: window.location.origin + '/thank-you',
cancelRedirectUrl: window.location.origin + '/payment-cancelled'
```

## Testing

1. Use Razorpay test credentials for development
2. Test with different email addresses
3. Verify Ghost member creation in Ghost Admin
4. Test webhook functionality

## Troubleshooting

### Common Issues
1. **Script not loading**: Check the Vercel URL and ensure CORS is enabled
2. **Payment not working**: Verify Razorpay credentials and API configuration
3. **Ghost integration failing**: Check Ghost API keys and permissions

### Debug Mode
Add this to your browser console to enable debug logging:
```javascript
localStorage.setItem('debug', 'true');
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test API endpoints manually
4. Check Ghost Admin for member creation
