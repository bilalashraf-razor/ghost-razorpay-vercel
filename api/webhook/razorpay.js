// Vercel serverless function for Razorpay webhook

const crypto = require('crypto');

// Import services (we'll need to adapt these for serverless)
const ghostAPI = require('../../services/ghostAPI');
const razorpayService = require('../../services/razorpayService');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    if (!razorpayService.verifyWebhookSignature(Buffer.from(body), signature)) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
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
}

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
