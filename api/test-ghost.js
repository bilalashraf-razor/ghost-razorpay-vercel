const GhostAdminAPI = require('@tryghost/admin-api');

module.exports = async (req, res) => {
  try {
    console.log('Testing Ghost API connection...');
    console.log('GHOST_URL:', process.env.GHOST_URL);
    console.log('GHOST_ADMIN_API_KEY exists:', !!process.env.GHOST_ADMIN_API_KEY);
    
    if (!process.env.GHOST_URL || !process.env.GHOST_ADMIN_API_KEY) {
      return res.status(500).json({
        error: 'Missing environment variables',
        ghostUrl: !!process.env.GHOST_URL,
        ghostApiKey: !!process.env.GHOST_ADMIN_API_KEY
      });
    }

    // Initialize Ghost Admin API
    const ghostAPI = new GhostAdminAPI({
      url: process.env.GHOST_URL,
      key: process.env.GHOST_ADMIN_API_KEY,
      version: 'v5.0'
    });

    console.log('Ghost API initialized, testing connection...');
    
    // Test by browsing members
    const members = await ghostAPI.members.browse({ limit: 1 });
    console.log('✅ Ghost API test successful');
    console.log('Members found:', members.length);
    
    res.json({
      success: true,
      message: 'Ghost API connection successful',
      membersCount: members.length,
      ghostUrl: process.env.GHOST_URL,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Ghost API test failed:', error);
    res.status(500).json({
      error: 'Ghost API test failed',
      message: error.message,
      stack: error.stack
    });
  }
};
