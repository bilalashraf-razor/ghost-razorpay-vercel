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
    message: 'Ghost-Razorpay Webhook Handler is running',
    endpoints: [
      'GET /api - This health check',
      'POST /api/webhook - Razorpay webhook handler'
    ],
    timestamp: new Date().toISOString(),
    environment: {
      ghostUrl: process.env.GHOST_URL ? 'Set ✅' : 'Missing ❌',
      ghostApiKey: process.env.GHOST_ADMIN_API_KEY ? 'Set ✅' : 'Missing ❌',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ? 'Set ✅' : 'Missing ❌'
    }
  });
};
