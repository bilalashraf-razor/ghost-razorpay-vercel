const crypto = require('crypto');
const GhostAdminAPI = require('@tryghost/admin-api');

// Initialize Ghost Admin API
const ghostAPI = new GhostAdminAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_ADMIN_API_KEY,
  version: 'v5.0'
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Razorpay-Signature');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment.entity;

    console.log(`Webhook received: ${event}`);

    // Handle successful payment
    if (event === 'payment.captured') {
      console.log('Payment captured:', payment.id);
      
      // Extract customer info from payment
      const customerEmail = payment.email;
      const customerName = payment.contact || payment.notes?.name || '';
      const amount = payment.amount / 100; // Convert from paise to rupees
      
      if (customerEmail) {
        try {
          // Check if member already exists
          const existingMembers = await ghostAPI.members.browse({
            filter: `email:'${customerEmail}'`
          });
          
          let member;
          const memberData = {
            email: customerEmail,
            name: customerName,
            labels: ['paid-member', 'razorpay-verified'],
            note: `Payment: ${payment.id} | Amount: ₹${amount} | Date: ${new Date().toISOString()}`
          };

          if (existingMembers && existingMembers.length > 0) {
            // Update existing member
            member = await ghostAPI.members.edit({
              id: existingMembers[0].id,
              ...memberData
            });
            console.log(`Updated existing member: ${customerEmail}`);
          } else {
            // Create new member
            member = await ghostAPI.members.add(memberData);
            console.log(`Created new member: ${customerEmail}`);
          }

        } catch (ghostError) {
          console.error('Ghost API error:', ghostError);
          // Still return success to Razorpay to avoid retries
        }
      } else {
        console.log('No customer email in payment data');
      }
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
};
