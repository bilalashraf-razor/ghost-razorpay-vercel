#!/bin/bash

# Ghost-Razorpay Integration Deployment Script

echo "🚀 Deploying Ghost-Razorpay Integration..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy config.env.template to .env and configure your settings"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check Node.js version
NODE_VERSION=$(node -v)
echo "📋 Node.js version: $NODE_VERSION"

# Validate environment variables
echo "🔍 Validating environment configuration..."
if [ -z "$GHOST_ADMIN_API_URL" ]; then
    echo "⚠️  Warning: GHOST_ADMIN_API_URL not set"
fi

if [ -z "$GHOST_ADMIN_API_KEY" ]; then
    echo "⚠️  Warning: GHOST_ADMIN_API_KEY not set"
fi

# Start the application
echo "🎯 Starting application..."
if command -v pm2 &> /dev/null; then
    echo "Using PM2 for process management"
    pm2 start server.js --name ghost-razorpay-integration
    pm2 save
else
    echo "PM2 not found, starting with Node.js directly"
    npm start
fi

echo "✅ Deployment complete!"
echo "📡 Webhook endpoint: http://localhost:3000/webhook/razorpay"
echo "🏥 Health check: http://localhost:3000/health"
