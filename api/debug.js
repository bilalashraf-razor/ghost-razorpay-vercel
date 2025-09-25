// Debug environment variables
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const envVars = {
    GHOST_URL: process.env.GHOST_URL || 'NOT SET',
    GHOST_ADMIN_API_KEY: process.env.GHOST_ADMIN_API_KEY ? 
      `${process.env.GHOST_ADMIN_API_KEY.substring(0, 10)}...` : 'NOT SET',
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'NOT SET'
  };
  
  console.log('Environment variables check:', envVars);
  
  res.json({
    message: 'Environment Variables Debug',
    environment: envVars,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('GHOST') || key.includes('RAZORPAY')
    )
  });
};
