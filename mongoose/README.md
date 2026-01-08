# 🔮 Mongoose OS Firmware for Infinity Portal

## Overview

This directory contains Mongoose OS firmware for ESP32/ESP8266 devices that integrate with the Infinity Portal multi-theme gateway system. The firmware enables physical devices to sync with the portal's theme system and respond to user interactions in real-time.

## 🧱 C13B0 Architecture

**Mode**: ADDITIVE  
**Operator**: Kris Watson  
**System**: Infinity / Octave / Mongoose  
**Rule**: Non-destructive, additive only

All firmware files follow the Legend architecture - modular, extensible, and designed to grow without breaking existing functionality.

## 📁 File Structure

```
mongoose/
├── README.md              # This file
└── mongoose.json          # Mongoose metadata

mos.yml                    # Mongoose OS configuration
fs/                        # Firmware source files
├── init.js                # Main firmware entry point
├── api_portal.js          # Portal API RPC handlers
└── config_schema.yaml     # Device configuration schema

sync/                      # Sync system
├── mongoose-sync.js       # Portal-device sync logic
├── device-registry.json   # Connected device registry
└── firmware-manifest.json # Firmware version tracking

device-bridge/             # Communication bridge
├── portal-api.js          # REST API for devices
├── mqtt-handler.js        # MQTT pub/sub handler
└── device-themes.json     # Theme mappings for devices
```

## 🚀 Quick Start

### Prerequisites

1. **Install Mongoose OS tools**:
   ```bash
   curl -fsSL https://mongoose.io/downloads/mos/install.sh | /bin/bash
   ```

2. **Hardware**:
   - ESP32 or ESP8266 development board
   - USB cable
   - LED (optional, built-in LED works)
   - NeoPixel strip (optional)
   - Servo motor (optional)

### Configuration

1. **WiFi Setup**:
   ```bash
   mos config-set wifi.sta.ssid=YourWiFiSSID
   mos config-set wifi.sta.pass=YourPassword
   ```

2. **MQTT Setup**:
   ```bash
   mos config-set mqtt.server=mqtt://your-broker:1883
   mos config-set mqtt.enable=true
   ```

3. **Portal Setup**:
   ```bash
   mos config-set portal.url=https://your-portal-url.com
   mos config-set portal.theme=mario
   mos config-set portal.sync_interval=60
   ```

### Build and Flash

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pewpi-infinity/infinity-portal.git
   cd infinity-portal
   ```

2. **Build the firmware**:
   ```bash
   mos build --platform esp32
   # or for ESP8266:
   mos build --platform esp8266
   ```

3. **Flash to device**:
   ```bash
   mos flash
   ```

4. **Monitor console**:
   ```bash
   mos console
   ```

## 🎨 Supported Themes

The firmware supports all Infinity Portal themes:

- 🍄 **Mario World** - Green warp pipe entrance
- 🎸 **Rock Arena** - Red backstage entrance
- 🔌 **Electronics Lab** - Cyan circuit board
- 🧪 **Chemistry Lab** - Pink molecular world
- 🤖 **Robotics Factory** - Silver factory gate
- 📐 **Mathematics Realm** - Gold geometric portal
- ⚛️ **Physics Field** - Purple quantum gateway
- 🧬 **Biology Center** - Green DNA helix
- 🎨 **Art Studio** - Rainbow canvas portal
- 🎵 **Music Studio** - Magenta sound wave
- 🚀 **Space Station** - Blue cosmic tunnel

## 📡 API Reference

### RPC Methods

The device exposes these RPC methods:

#### `Portal.GetStatus`
Get current device status.

```bash
mos call Portal.GetStatus
```

Response:
```json
{
  "device_id": "a1b2c3d4",
  "theme": "mario",
  "uptime": 3600,
  "free_ram": 123456,
  "portal_version": "1.0.0"
}
```

#### `Portal.SetTheme`
Change the current theme.

```bash
mos call Portal.SetTheme '{"theme":"electronics"}'
```

#### `Portal.GetConfig`
Get portal configuration.

```bash
mos call Portal.GetConfig
```

#### `Portal.SetConfig`
Update portal configuration.

```bash
mos call Portal.SetConfig '{"portal_url":"https://new-url.com","sync_interval":120}'
```

#### `Portal.GetThemes`
List all available themes.

```bash
mos call Portal.GetThemes
```

#### `Portal.GetDeviceInfo`
Get detailed device information including C13B0 metadata.

```bash
mos call Portal.GetDeviceInfo
```

## 🔌 MQTT Topics

### Subscribe (device receives)

- `infinity-portal/devices/{device_id}/theme` - Theme changes
- `infinity-portal/devices/{device_id}/cmd` - Commands

### Publish (device sends)

- `infinity-portal/devices/{device_id}/status` - Device status updates
- `infinity-portal/devices/{device_id}/register` - Device registration

### Message Format

**Theme Change**:
```
Topic: infinity-portal/devices/a1b2c3d4/theme
Payload: "electronics"
```

**Command**:
```
Topic: infinity-portal/devices/a1b2c3d4/cmd
Payload: {"action":"sync"}
Payload: {"action":"restart"}
```

**Status Update**:
```
Topic: infinity-portal/devices/a1b2c3d4/status
Payload: {
  "device_id": "a1b2c3d4",
  "theme": "mario",
  "uptime": 3600,
  "free_ram": 123456,
  "sync_count": 42,
  "firmware_version": "1.0.0"
}
```

## 🔧 Hardware Integration

### LED Control

The firmware uses the built-in LED (GPIO 2) by default. Each theme has a corresponding LED pattern:

```javascript
let THEME_INDICATORS = {
  mario: [0, 255, 0],      // Green
  rock: [255, 0, 0],       // Red
  electronics: [0, 255, 255], // Cyan
  // ... etc
};
```

### Adding Custom Hardware

To add custom hardware (NeoPixels, servos, etc.), edit `fs/init.js`:

```javascript
// Example: Add NeoPixel support
load('api_neopixel.js');

let strip = NeoPixel.create(4, 16, NeoPixel.GRB); // 16 LEDs on GPIO 4
strip.setPixel(0, 255, 0, 0); // Red
strip.show();
```

## 🌐 Server-Side Integration

### REST API

Start the portal API server:

```javascript
const MongooseSync = require('./sync/mongoose-sync.js');
const PortalAPI = require('./device-bridge/portal-api.js');
const express = require('express');

const app = express();
app.use(express.json());

const sync = new MongooseSync({
  mqttTopic: 'infinity-portal/devices',
  syncInterval: 60000
});

const api = new PortalAPI(sync, { port: 8080 });
api.setupRoutes(app);

app.listen(8080, () => {
  console.log('Portal API listening on port 8080');
});
```

### MQTT Handler

Setup MQTT broker connection:

```javascript
const mqtt = require('mqtt');
const MQTTHandler = require('./device-bridge/mqtt-handler.js');

const client = mqtt.connect('mqtt://localhost:1883');
const handler = new MQTTHandler(sync, {
  broker: 'mqtt://localhost:1883',
  topic: 'infinity-portal/devices'
});

handler.connect(client);
```

## 🧪 Testing

### Local Testing

1. **Test RPC calls**:
   ```bash
   mos call Portal.GetStatus
   mos call Portal.SetTheme '{"theme":"rock"}'
   ```

2. **Monitor MQTT messages**:
   ```bash
   mosquitto_sub -t "infinity-portal/devices/#" -v
   ```

3. **Publish test theme change**:
   ```bash
   mosquitto_pub -t "infinity-portal/devices/YOUR_DEVICE_ID/theme" -m "space"
   ```

### Verify Sync

Watch the device console for sync messages:
```
📡 Published to MQTT: infinity-portal/devices/a1b2c3d4/status
💓 Uptime: 3600 s | Theme: mario | Syncs: 42
```

## 🔒 Security

### Best Practices

1. **Change default passwords**:
   ```bash
   mos config-set wifi.ap.pass=your-secure-password
   ```

2. **Use MQTT authentication**:
   ```bash
   mos config-set mqtt.user=your-username
   mos config-set mqtt.pass=your-password
   ```

3. **Enable HTTPS** for portal URL

4. **Keep firmware updated**:
   ```bash
   mos ota https://your-firmware-server/firmware.zip
   ```

## 📊 Monitoring

### Device Status

Check device status via RPC:
```bash
mos call Portal.GetStatus
```

### Sync Statistics

Get sync statistics from the portal:
```bash
curl http://localhost:8080/api/devices
```

Response:
```json
{
  "success": true,
  "devices": [...],
  "stats": {
    "totalDevices": 5,
    "onlineDevices": 4,
    "totalSyncs": 1234,
    "lastSync": "2026-01-01T16:22:28Z"
  }
}
```

## 🐛 Troubleshooting

### Device Won't Connect to WiFi

```bash
mos wifi SSID PASSWORD
mos config-set wifi.sta.enable=true
```

### MQTT Not Working

Check broker connection:
```bash
mos config-get mqtt
mos call MQTT.GetInfo
```

### Theme Not Syncing

1. Verify MQTT topic configuration
2. Check device is online
3. Monitor MQTT messages
4. Verify portal URL is accessible

### Out of Memory

Reduce sync interval or disable features:
```bash
mos config-set portal.sync_interval=300
mos config-set debug.level=1
```

## 🔄 OTA Updates

Update firmware over-the-air:

```bash
# Build firmware
mos build --platform esp32

# Host firmware (example with Python)
python3 -m http.server 8000

# Trigger OTA from device
mos call OTA.Update '{"url":"http://your-ip:8000/build/fw.zip"}'
```

## 📚 References

- [Mongoose OS Documentation](https://mongoose-os.com/docs/)
- [Infinity Portal Repository](https://github.com/pewpi-infinity/infinity-portal)
- [C13B0 Intent](../C13B0_INTENT.md)
- [ESP32 Datasheet](https://www.espressif.com/en/products/socs/esp32)
- [MQTT Protocol](https://mqtt.org/)

## 🤝 Contributing

This project follows the **C13B0 additive-only** principle:

- ✅ Add new features
- ✅ Add new themes
- ✅ Add new device types
- ❌ Do NOT remove existing functionality
- ❌ Do NOT break backwards compatibility

## 📝 License

Part of the Infinity Portal project.  
Operator: Kris Watson  
Architecture: Legend  
Mode: Additive Only

---

**🧱 Built with C13B0 principles - Non-destructive, Always Growing**
