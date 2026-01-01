#!/bin/bash
# 🧱 Deploy Mongoose OS Firmware to ESP32/ESP8266
# Part of C13B0 autonomous system - additive only
# Operator: Kris Watson

set -e

echo "🔮 Infinity Portal - Mongoose OS Deployment Script"
echo "🧱 C13B0 Mode: ADDITIVE"
echo ""

# Check if mos is installed
if ! command -v mos &> /dev/null; then
    echo "❌ Mongoose OS tools not found!"
    echo "📥 Installing Mongoose OS tools..."
    curl -fsSL https://mongoose.io/downloads/mos/install.sh | /bin/bash
    echo "✅ Mongoose OS tools installed"
fi

# Check for platform argument
PLATFORM=${1:-esp32}
if [[ "$PLATFORM" != "esp32" && "$PLATFORM" != "esp8266" ]]; then
    echo "❌ Invalid platform: $PLATFORM"
    echo "Usage: $0 [esp32|esp8266]"
    exit 1
fi

echo "🔧 Target platform: $PLATFORM"
echo ""

# Get WiFi credentials
read -p "📡 WiFi SSID: " WIFI_SSID
read -sp "🔒 WiFi Password: " WIFI_PASS
echo ""

# Get MQTT broker (optional)
read -p "📬 MQTT Broker (leave empty to skip): " MQTT_BROKER

# Get portal URL (optional)
read -p "🌐 Portal URL (leave empty to skip): " PORTAL_URL

echo ""
echo "🔨 Building firmware for $PLATFORM..."
mos build --platform $PLATFORM

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful"
echo ""

echo "📤 Flashing firmware to device..."
mos flash

if [ $? -ne 0 ]; then
    echo "❌ Flash failed!"
    exit 1
fi

echo "✅ Flash successful"
echo ""

echo "⚙️ Configuring device..."

# Configure WiFi
mos config-set wifi.sta.ssid="$WIFI_SSID"
mos config-set wifi.sta.pass="$WIFI_PASS"
mos config-set wifi.sta.enable=true
mos config-set wifi.ap.enable=false

echo "✅ WiFi configured: $WIFI_SSID"

# Configure MQTT if provided
if [ ! -z "$MQTT_BROKER" ]; then
    mos config-set mqtt.server="$MQTT_BROKER"
    mos config-set mqtt.enable=true
    echo "✅ MQTT configured: $MQTT_BROKER"
fi

# Configure portal URL if provided
if [ ! -z "$PORTAL_URL" ]; then
    mos config-set portal.url="$PORTAL_URL"
    echo "✅ Portal URL configured: $PORTAL_URL"
fi

# Set default theme
mos config-set portal.theme=mario
mos config-set portal.sync_interval=60

echo "✅ Portal defaults configured"
echo ""

echo "🧪 Testing device..."
sleep 2

# Get device status
echo "📊 Device Status:"
mos call Portal.GetStatus

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📺 To monitor device:"
    echo "   mos console"
    echo ""
    echo "🎨 To change theme:"
    echo "   mos call Portal.SetTheme '{\"theme\":\"electronics\"}'"
    echo ""
    echo "🔧 Available themes:"
    echo "   mario, rock, electronics, chemistry, robotics,"
    echo "   math, physics, biology, art, music, space"
    echo ""
    echo "🧱 C13B0 Mode: ADDITIVE - Device ready for portal sync!"
else
    echo ""
    echo "⚠️ Deployment completed with warnings"
    echo "💡 Check device with: mos console"
fi
