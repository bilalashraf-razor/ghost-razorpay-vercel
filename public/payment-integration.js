/**
 * Ghost-Razorpay Payment Integration Script
 * Include this script in your Ghost theme to enable Razorpay payments
 */

class GhostRazorpayIntegration {
  constructor(config) {
    this.apiBaseUrl = config.apiBaseUrl;
    this.defaultAmount = config.defaultAmount || 100000; // 1000 INR in paise
    this.defaultCurrency = config.defaultCurrency || 'INR';
    this.membershipTier = config.membershipTier || 'basic';
    this.successRedirectUrl = config.successRedirectUrl;
    this.cancelRedirectUrl = config.cancelRedirectUrl;
    
    // Load Razorpay script
    this.loadRazorpayScript();
  }

  loadRazorpayScript() {
    if (document.getElementById('razorpay-script')) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async initializePayment(memberEmail, memberName, amount, currency) {
    try {
      // Show loading state
      this.showLoading();

      // Create order on backend
      const orderResponse = await fetch(`${this.apiBaseUrl}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount || this.defaultAmount,
          currency: currency || this.defaultCurrency,
          memberEmail,
          memberName,
          membershipTier: this.membershipTier
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Initialize Razorpay
      await this.loadRazorpayScript();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Membership Payment',
        description: `${this.membershipTier} membership`,
        order_id: orderData.orderId,
        prefill: {
          email: memberEmail,
          name: memberName
        },
        theme: {
          color: '#3399cc'
        },
        handler: async (response) => {
          await this.verifyPayment(response, memberEmail, memberName);
        },
        modal: {
          ondismiss: () => {
            this.hideLoading();
            if (this.cancelRedirectUrl) {
              window.location.href = this.cancelRedirectUrl;
            }
          }
        }
      };

      const rzp = new Razorpay(options);
      this.hideLoading();
      rzp.open();

    } catch (error) {
      this.hideLoading();
      this.showError('Payment initialization failed: ' + error.message);
      console.error('Payment initialization error:', error);
    }
  }

  async verifyPayment(razorpayResponse, memberEmail, memberName) {
    try {
      this.showLoading('Verifying payment...');

      const verifyResponse = await fetch(`${this.apiBaseUrl}/api/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          memberEmail,
          memberName,
          membershipTier: this.membershipTier
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        this.showSuccess('Payment successful! Welcome to the membership.');
        
        // Redirect to success page after a delay
        setTimeout(() => {
          if (this.successRedirectUrl) {
            window.location.href = this.successRedirectUrl;
          } else {
            window.location.reload();
          }
        }, 2000);
      } else {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

    } catch (error) {
      this.hideLoading();
      this.showError('Payment verification failed: ' + error.message);
      console.error('Payment verification error:', error);
    }
  }

  showLoading(message = 'Processing payment...') {
    // Remove existing loading/message elements
    this.hideLoading();
    this.hideMessage();

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'razorpay-loading';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      color: white;
      font-family: Arial, sans-serif;
    `;
    
    loadingDiv.innerHTML = `
      <div style="text-align: center;">
        <div style="border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div>${message}</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loadingDiv);
  }

  hideLoading() {
    const loadingDiv = document.getElementById('razorpay-loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  showSuccess(message) {
    this.hideLoading();
    this.showMessage(message, 'success');
  }

  showError(message) {
    this.hideLoading();
    this.showMessage(message, 'error');
  }

  showMessage(message, type = 'info') {
    this.hideMessage();

    const messageDiv = document.createElement('div');
    messageDiv.id = 'razorpay-message';
    
    const backgroundColor = type === 'success' ? '#4CAF50' : 
                           type === 'error' ? '#f44336' : '#2196F3';
    
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 10001;
      font-family: Arial, sans-serif;
      max-width: 300px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideMessage();
    }, 5000);
  }

  hideMessage() {
    const messageDiv = document.getElementById('razorpay-message');
    if (messageDiv) {
      messageDiv.remove();
    }
  }
}

// Global function to initialize payment
window.initializeGhostRazorpayPayment = function(memberEmail, memberName, amount, currency) {
  if (!window.ghostRazorpayIntegration) {
    console.error('Ghost Razorpay Integration not initialized. Please call setupGhostRazorpayIntegration() first.');
    return;
  }
  
  if (!memberEmail) {
    alert('Please provide your email address.');
    return;
  }
  
  window.ghostRazorpayIntegration.initializePayment(memberEmail, memberName, amount, currency);
};

// Global function to setup integration
window.setupGhostRazorpayIntegration = function(config) {
  window.ghostRazorpayIntegration = new GhostRazorpayIntegration(config);
};
