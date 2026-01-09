#!/bin/bash

#####################################################################
#                                                                   #
#   BIBLICAL MAN HUB - AUTOMATED INCOME SETUP                       #
#   Run this script once to set up your $1000/month system          #
#                                                                   #
#   Usage: ./setup.sh                                               #
#                                                                   #
#####################################################################

set -e

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "          BIBLICAL MAN HUB - PREMIUM SETUP"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local file not found!"
    echo ""
    echo "Please create .env.local with the following variables:"
    echo ""
    echo "STRIPE_SECRET_KEY=sk_test_your_key_here"
    echo "STRIPE_WEBHOOK_SECRET=whsec_your_secret_here"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo "ANTHROPIC_API_KEY=sk-ant-your_key_here"
    echo "RESEND_API_KEY=re_your_key_here"
    echo "EMAIL_FROM=your@email.com"
    echo "NEXT_PUBLIC_SITE_URL=https://yourdomain.com"
    echo ""
    echo "Get your keys from:"
    echo "  - Stripe: https://dashboard.stripe.com/apikeys"
    echo "  - Supabase: https://supabase.com/dashboard"
    echo "  - Anthropic: https://console.anthropic.com/"
    echo "  - Resend: https://resend.com/api-keys"
    echo ""
    exit 1
fi

# Run the setup script
echo "🚀 Running premium setup..."
echo ""
npx tsx scripts/setup-premium.ts

# Build the application
echo ""
echo "🔨 Building application..."
npm run build

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "                    SETUP COMPLETE!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Your automated income system is ready!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To deploy to production (Vercel):"
echo "  vercel --prod"
echo ""
echo "Your premium page is at: /premium"
echo ""
echo "═══════════════════════════════════════════════════════════════"
