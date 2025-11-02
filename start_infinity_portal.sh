#!/bin/bash
# Infinity Portal Startup Script

echo "╔═══════════════════════════════════════════╗"
echo "║   INFINITY PORTAL - GOOGLE AUTH SYSTEM   ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Architecture: Google Auth → Rogers Core → Realms"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is not installed"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
pip3 install -r requirements.txt

# Set default environment variables if not set
export PORT=${PORT:-8080}
export DEBUG=${DEBUG:-false}

echo ""
echo "Starting Rogers Core on port $PORT..."
echo ""
echo "Access the portal at: http://localhost:$PORT/infinity_portal_with_google_auth.html"
echo ""
echo "Configure your Google Client ID in the portal settings to enable authentication."
echo ""

# Start Rogers Core
python3 rogers_core.py
