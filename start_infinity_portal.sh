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

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies need to be installed
if [ ! -f "venv/.dependencies_installed" ] || [ "requirements.txt" -nt "venv/.dependencies_installed" ]; then
    echo "Installing/updating dependencies in virtual environment..."
    pip install -q -r requirements.txt
    touch venv/.dependencies_installed
else
    echo "Dependencies already up to date."
fi

# Set default environment variables if not set
export PORT=${PORT:-8080}
export DEBUG=${DEBUG:-false}

# Warn about security settings
if [ -z "$SECRET_KEY" ]; then
    echo ""
    echo "⚠️  WARNING: SECRET_KEY not set. Using default (insecure for production)"
    echo ""
fi

if [ "$PRODUCTION_MODE" != "true" ]; then
    echo ""
    echo "⚠️  Running in DEMO mode (insecure token verification)"
    echo "   Set PRODUCTION_MODE=true and GOOGLE_CLIENT_ID for production"
    echo ""
fi

echo ""
echo "Starting Rogers Core on port $PORT..."
echo ""
echo "Access the portal at: http://localhost:$PORT/infinity_portal_with_google_auth.html"
echo ""
echo "Configure your Google Client ID in the portal settings to enable authentication."
echo ""

# Start Rogers Core
python3 rogers_core.py
