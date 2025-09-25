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

  // Health check response with status page
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ghost-Razorpay Integration</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .status { background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .endpoint { background: #f5f5f5; border-radius: 4px; padding: 10px; font-family: monospace; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🚀 Ghost-Razorpay Integration</h1>
    <div class="status">
        <h2>✅ Webhook Handler is Live!</h2>
        <p>Ready to receive Razorpay payments and create Ghost members.</p>
    </div>
    <h2>📍 API Endpoints</h2>
    <div class="endpoint">GET /api - This status page</div>
    <div class="endpoint">POST /api/webhook - Webhook handler</div>
    <h2>🔧 Environment Status</h2>
    <ul>
        <li>Ghost URL: ${process.env.GHOST_URL || 'Missing ❌'}</li>
        <li>Ghost API Key: ${process.env.GHOST_ADMIN_API_KEY ? 'Set ✅' : 'Missing ❌'}</li>
        <li>Webhook Secret: ${process.env.RAZORPAY_WEBHOOK_SECRET ? 'Set ✅' : 'Missing ❌'}</li>
    </ul>
    <h2>🔗 Test Links</h2>
    <p><a href="/api/test-ghost" style="color: #007cba;">Test Ghost API Connection</a></p>
    <h2>🔗 Configuration</h2>
    <p><strong>Webhook URL for Razorpay:</strong></p>
    <div class="endpoint">${req.headers.host ? `https://${req.headers.host}/api/webhook` : 'https://your-deployment-url.vercel.app/api/webhook'}</div>
</body>
</html>`;

  // If request accepts HTML, return the status page
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } else {
    // Otherwise return JSON
    res.status(200).json({
      status: 'OK',
      message: 'Ghost-Razorpay Webhook Handler is running',
      endpoints: [
        'GET /api - This health check',
        'POST /api/webhook - Razorpay webhook handler'
      ],
      timestamp: new Date().toISOString(),
      environment: {
        ghostUrl: process.env.GHOST_URL || 'Missing ❌',
        ghostApiKey: process.env.GHOST_ADMIN_API_KEY ? 'Set ✅' : 'Missing ❌',
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ? 'Set ✅' : 'Missing ❌'
      }
    });
  }
};