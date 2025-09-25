const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const crypto = require('crypto');
const bodyParser = require('body-parser');
require('dotenv').config();

const ghostAPI = require('./services/ghostAPI');
const razorpayService = require('./services/razorpayService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Raw body parser for webhook signature verification
app.use('/webhook/razorpay', bodyParser.raw({ type: 'application/json' }));

// JSON parser for other routes
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'ghost-razorpay-integration'
  });
});

// Razorpay webhook endpoint
app.post('/webhook/razorpay', async (req, res) => {
  try {
    const signature = req.get('X-Razorpay-Signature');
    const body = req.body;

    // Verify webhook signature
    if (!razorpayService.verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(body.toString());
    console.log('Received Razorpay webhook:', event.event, event.payload?.payment?.entity?.id);

    // Handle payment success event
    if (event.event === 'payment.captured') {
      await handlePaymentSuccess(event.payload.payment.entity);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle successful payment
async function handlePaymentSuccess(payment) {
  try {
    const { email, amount, currency, id: paymentId } = payment;
    
    // Extract email from payment notes or contact details
    const memberEmail = payment.email || payment.notes?.email;
    
    if (!memberEmail) {
      console.error('No email found in payment data:', paymentId);
      return;
    }

    console.log(`Processing payment for ${memberEmail}, amount: ${amount/100} ${currency}`);

    // Check if member exists in Ghost
    let member = await ghostAPI.getMemberByEmail(memberEmail);
    
    if (!member) {
      // Create new member
      member = await ghostAPI.createMember({
        email: memberEmail,
        name: payment.notes?.name || memberEmail.split('@')[0],
        labels: ['paid-member'],
        note: `Payment ID: ${paymentId}, Amount: ${amount/100} ${currency}`
      });
      console.log(`Created new member: ${memberEmail}`);
    } else {
      // Update existing member with payment info
      await ghostAPI.updateMember(member.id, {
        labels: [...(member.labels || []), 'paid-member'],
        note: `${member.note || ''}\nPayment ID: ${paymentId}, Amount: ${amount/100} ${currency}`
      });
      console.log(`Updated existing member: ${memberEmail}`);
    }

    // Log successful processing
    console.log(`Successfully processed payment ${paymentId} for member ${memberEmail}`);
    
  } catch (error) {
    console.error('Error processing payment:', error);
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Ghost-Razorpay integration server running on port ${PORT}`);
  console.log('Webhook endpoint: /webhook/razorpay');
});

module.exports = app;
