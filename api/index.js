const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const GhostAdminAPI = require('@tryghost/admin-api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Ghost Admin API
const ghostAPI = new GhostAdminAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_ADMIN_API_KEY,
  version: 'v5.0'
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Ghost-Razorpay Integration Server is running',
    timestamp: new Date().toISOString()
  });
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { 
      amount, 
      currency = process.env.DEFAULT_CURRENCY || 'INR',
      receipt,
      memberEmail,
      memberName,
      membershipTier = 'basic'
    } = req.body;

    // Validate required fields
    if (!amount || !memberEmail) {
      return res.status(400).json({
        error: 'Amount and member email are required'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // amount in smallest currency unit
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        memberEmail,
        memberName: memberName || '',
        membershipTier,
        ghostIntegration: true
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      message: error.message
    });
  }
});

// Verify payment and create/update Ghost member
app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      memberEmail,
      memberName,
      membershipTier = 'basic'
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        error: 'Invalid signature',
        success: false
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({
        error: 'Payment not captured',
        success: false
      });
    }

    // Create or update Ghost member
    try {
      // Check if member already exists
      let member;
      try {
        const existingMembers = await ghostAPI.members.browse({
          filter: `email:'${memberEmail}'`
        });
        
        if (existingMembers && existingMembers.length > 0) {
          // Update existing member
          member = await ghostAPI.members.edit({
            id: existingMembers[0].id,
            labels: [`paid-${membershipTier}`, 'razorpay-verified'],
            note: `Payment verified: ${razorpay_payment_id} | Order: ${razorpay_order_id} | Amount: ${payment.amount/100} ${payment.currency}`
          });
        } else {
          // Create new member
          member = await ghostAPI.members.add({
            email: memberEmail,
            name: memberName || '',
            labels: [`paid-${membershipTier}`, 'razorpay-verified'],
            note: `Payment verified: ${razorpay_payment_id} | Order: ${razorpay_order_id} | Amount: ${payment.amount/100} ${payment.currency}`
          });
        }
      } catch (ghostError) {
        console.error('Ghost API error:', ghostError);
        // Payment is verified but Ghost update failed
        return res.json({
          success: true,
          paymentVerified: true,
          ghostMemberUpdated: false,
          message: 'Payment verified but member update failed',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          ghostError: ghostError.message
        });
      }

      res.json({
        success: true,
        paymentVerified: true,
        ghostMemberUpdated: true,
        message: 'Payment verified and member updated successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        member: {
          id: member.id,
          email: member.email,
          name: member.name
        }
      });

    } catch (error) {
      console.error('Error updating Ghost member:', error);
      res.status(500).json({
        error: 'Payment verified but failed to update member',
        success: false,
        paymentId: razorpay_payment_id
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      error: 'Payment verification failed',
      message: error.message,
      success: false
    });
  }
});

// Razorpay webhook handler
app.post('/api/webhook', async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment.entity;

    console.log(`Webhook received: ${event}`);

    // Handle payment captured event
    if (event === 'payment.captured') {
      const { notes } = payment;
      
      if (notes && notes.ghostIntegration && notes.memberEmail) {
        try {
          // Check if member already exists
          const existingMembers = await ghostAPI.members.browse({
            filter: `email:'${notes.memberEmail}'`
          });
          
          let member;
          if (existingMembers && existingMembers.length > 0) {
            // Update existing member
            member = await ghostAPI.members.edit({
              id: existingMembers[0].id,
              labels: [`paid-${notes.membershipTier || 'basic'}`, 'razorpay-verified'],
              note: `Webhook payment verified: ${payment.id} | Amount: ${payment.amount/100} ${payment.currency}`
            });
          } else {
            // Create new member
            member = await ghostAPI.members.add({
              email: notes.memberEmail,
              name: notes.memberName || '',
              labels: [`paid-${notes.membershipTier || 'basic'}`, 'razorpay-verified'],
              note: `Webhook payment verified: ${payment.id} | Amount: ${payment.amount/100} ${payment.currency}`
            });
          }

          console.log(`Ghost member updated via webhook: ${notes.memberEmail}`);
        } catch (ghostError) {
          console.error('Ghost API error in webhook:', ghostError);
        }
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

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Export for Vercel
module.exports = app;
