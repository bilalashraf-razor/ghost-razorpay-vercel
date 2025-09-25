const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const GhostAdminAPI = require('@tryghost/admin-api');

const app = express();

// CORS Configuration for webhooks
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Razorpay-Signature'],
  credentials: false
}));

app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

// Initialize Ghost Admin API
const ghostAPI = new GhostAdminAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_ADMIN_API_KEY,
  version: 'v5.0'
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Ghost-Razorpay Webhook Handler (Simple Version)',
    description: 'Handles Razorpay payment button webhooks and creates Ghost members',
    endpoints: [
      'GET / - This health check',
      'POST /webhook - Razorpay webhook handler'
    ],
    timestamp: new Date().toISOString()
  });
});

// Razorpay webhook handler
app.post('/webhook', async (req, res) => {
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

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
});

// Catch-all route for undefined endpoints
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET / - Health check',
      'POST /webhook - Razorpay webhook handler'
    ],
    message: 'This is a simple webhook handler for Razorpay payment buttons'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Export for Vercel serverless functions
module.exports = app;
