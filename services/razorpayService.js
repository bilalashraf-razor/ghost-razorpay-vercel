const crypto = require('crypto');

class RazorpayService {
  constructor() {
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!this.webhookSecret) {
      console.warn('Razorpay webhook secret not configured. Webhook signature verification will be skipped.');
    }
  }

  // Verify Razorpay webhook signature
  verifyWebhookSignature(body, signature) {
    if (!this.webhookSecret) {
      console.warn('Webhook secret not configured, skipping signature verification');
      return true; // Skip verification if secret is not configured
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(body)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      );
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  // Extract payment information from webhook payload
  extractPaymentInfo(webhookPayload) {
    const payment = webhookPayload.payload?.payment?.entity;
    
    if (!payment) {
      throw new Error('Invalid webhook payload: missing payment entity');
    }

    return {
      paymentId: payment.id,
      amount: payment.amount, // Amount in paisa (multiply by 100 for rupees)
      currency: payment.currency,
      status: payment.status,
      email: payment.email || payment.notes?.email,
      name: payment.notes?.name,
      contact: payment.contact,
      notes: payment.notes,
      createdAt: new Date(payment.created_at * 1000), // Convert Unix timestamp
      method: payment.method,
      orderId: payment.order_id
    };
  }

  // Validate payment amount (useful for specific pricing tiers)
  validatePaymentAmount(amount, expectedAmount, tolerance = 0) {
    const difference = Math.abs(amount - expectedAmount);
    return difference <= tolerance;
  }

  // Format amount for display (convert paisa to rupees)
  formatAmount(amountInPaisa, currency = 'INR') {
    const amount = amountInPaisa / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Get payment tier based on amount (customize based on your pricing)
  getPaymentTier(amountInPaisa) {
    const amount = amountInPaisa / 100; // Convert to rupees
    
    // Define your pricing tiers here
    const tiers = [
      { name: 'basic', minAmount: 99, maxAmount: 499 },
      { name: 'premium', minAmount: 500, maxAmount: 999 },
      { name: 'pro', minAmount: 1000, maxAmount: Infinity }
    ];

    return tiers.find(tier => amount >= tier.minAmount && amount <= tier.maxAmount) || null;
  }
}

module.exports = new RazorpayService();
