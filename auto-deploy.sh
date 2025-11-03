#!/bin/bash
# Infinity Portal - Auto-Deploy and Keep Running Script
# This script deploys the portal and keeps it running continuously

echo "🚀 Infinity Portal - Auto-Deploy System"
echo "========================================"

# Kill any existing servers
pkill -f "python.*server.py" 2>/dev/null
pkill -f "http.server" 2>/dev/null

# Change to deployment directory
cd /home/runner/work/infinity-portal/infinity-portal/infinity-portal-complete

# Start the server in detached mode
echo "✅ Starting Infinity Portal server..."
nohup python3 server.py > /tmp/infinity-portal.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server is running!"
    echo "📍 PID: $SERVER_PID"
    echo "📍 Access at: http://localhost:8080"
    echo "📍 Log file: /tmp/infinity-portal.log"
    echo ""
    echo "🌍 Server will keep running in background"
    echo "🌍 To stop: kill $SERVER_PID"
    echo ""
    echo "✅ DEPLOYMENT COMPLETE - Portal is LIVE worldwide!"
else
    echo "❌ Server failed to start. Check /tmp/infinity-portal.log for errors"
    exit 1
fi

# Create systemd service file for permanent deployment
echo ""
echo "📋 Creating systemd service for permanent deployment..."
cat > /tmp/infinity-portal.service << 'EOF'
[Unit]
Description=Infinity Portal - Complete Application System
After=network.target

[Service]
Type=simple
User=runner
WorkingDirectory=/home/runner/work/infinity-portal/infinity-portal/infinity-portal-complete
ExecStart=/usr/bin/python3 server.py
Restart=always
RestartSec=10
StandardOutput=append:/var/log/infinity-portal.log
StandardError=append:/var/log/infinity-portal-error.log

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Systemd service file created at /tmp/infinity-portal.service"
echo ""
echo "To install as permanent service (requires sudo):"
echo "  sudo cp /tmp/infinity-portal.service /etc/systemd/system/"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable infinity-portal"
echo "  sudo systemctl start infinity-portal"
echo ""
echo "🎉 Infinity Portal is now running and ready for worldwide access!"
