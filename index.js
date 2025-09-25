// Root entry point that redirects to API endpoints
module.exports = (req, res) => {
  // Redirect root requests to /api
  if (req.url === '/' || req.url === '') {
    const apiHandler = require('./api/index.js');
    return apiHandler(req, res);
  }
  
  // Redirect webhook requests
  if (req.url === '/webhook' || req.url.startsWith('/webhook')) {
    const webhookHandler = require('./api/webhook.js');
    return webhookHandler(req, res);
  }
  
  // Redirect API requests
  if (req.url.startsWith('/api/webhook')) {
    const webhookHandler = require('./api/webhook.js');
    return webhookHandler(req, res);
  }
  
  if (req.url.startsWith('/api') || req.url === '/api/') {
    const apiHandler = require('./api/index.js');
    return apiHandler(req, res);
  }
  
  // Default: serve API status
  const apiHandler = require('./api/index.js');
  return apiHandler(req, res);
};
