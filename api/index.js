// Health check endpoint for Vercel serverless function
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check response
  res.status(200).json({
    status: 'OK',
    message: 'Ghost-Razorpay Webhook Handler (Simple Version)',
    description: 'Handles Razorpay payment button webhooks and creates Ghost members',
    endpoints: [
      'GET /api - This health check',
      'POST /api/webhook - Razorpay webhook handler'
    ],
    timestamp: new Date().toISOString()
  });
};