const GhostAdminAPI = require('@tryghost/admin-api');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔔 Payment webhook received (simplified - no verification)');
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));

  try {
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;

    console.log(`Webhook event: ${event}`);

    // Handle successful payment
    if (event === 'payment.captured') {
      console.log('Payment captured:', payment.id);
      
      // Initialize Ghost Admin API
      const ghostAPI = new GhostAdminAPI({
        url: process.env.GHOST_URL,
        key: process.env.GHOST_ADMIN_API_KEY,
        version: 'v5.0'
      });

      // Extract customer info from payment
      const customerEmail = payment.email;
      const customerName = payment.contact || payment.notes?.name || 'Paid Customer';
      const amount = payment.amount / 100; // Convert from paise to rupees
      
      console.log('Customer email:', customerEmail);
      console.log('Customer name:', customerName);
      console.log('Payment amount: ₹', amount);
      
      if (customerEmail) {
        try {
          // Check if member already exists
          const existingMembers = await ghostAPI.members.browse({
            filter: `email:'${customerEmail}'`
          });
          
          let member;
          const memberData = {
            email: customerEmail,
            name: customerName,
            labels: ['paid-member'], // Simplified - just one label
            note: `Razorpay Payment: ${payment.id} | Amount: ₹${amount} | Date: ${new Date().toISOString()}`
          };

          if (existingMembers && existingMembers.length > 0) {
            // Update existing member with paid status
            member = await ghostAPI.members.edit({
              id: existingMembers[0].id,
              ...memberData
            });
            console.log(`✅ Updated existing member: ${customerEmail}`);
          } else {
            // Create new paid member
            member = await ghostAPI.members.add(memberData);
            console.log(`✅ Created new paid member: ${customerEmail}`);
          }

          return res.status(200).json({ 
            success: true,
            message: 'Paid member created/updated successfully',
            memberEmail: customerEmail
          });

        } catch (ghostError) {
          console.error('❌ Ghost API error:', ghostError);
          return res.status(200).json({ 
            success: false,
            error: 'Failed to create Ghost member',
            details: ghostError.message 
          });
        }
      } else {
        console.log('❌ No customer email in payment data');
        return res.status(200).json({ 
          success: false,
          error: 'No customer email found in payment' 
        });
      }
    } else {
      console.log('Ignoring event:', event);
      return res.status(200).json({ success: true, note: 'Event ignored' });
    }

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
};
