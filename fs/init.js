// 🧱 Infinity Portal Gateway - Main Firmware Entry Point
// Compatible with ESP32/ESP8266 via Mongoose OS
// Part of C13B0 autonomous system - additive only

load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_sys.js');
load('api_portal.js');

// Portal device state
let state = {
  theme: 'mario',
  connected: false,
  lastSync: 0,
  syncCount: 0,
  errors: 0,
  uptime: 0,
  portalUrl: '',
  deviceId: ''
};

// LED pins for theme indication (customize per board)
let LED_PIN = 2; // Built-in LED for ESP32/ESP8266
let THEME_INDICATORS = {
  mario: [0, 255, 0],      // Green
  rock: [255, 0, 0],       // Red
  electronics: [0, 255, 255], // Cyan
  chemistry: [255, 20, 147],  // Deep pink
  robotics: [192, 192, 192],  // Silver
  math: [255, 215, 0],        // Gold
  physics: [147, 112, 219],   // Purple
  biology: [50, 205, 50],     // Lime green
  art: [255, 105, 180],       // Hot pink
  music: [255, 0, 255],       // Magenta
  space: [65, 105, 225]       // Royal blue
};

// Initialize GPIO
GPIO.set_mode(LED_PIN, GPIO.MODE_OUTPUT);

// Get device configuration
state.portalUrl = Cfg.get('portal.url') || '';
state.deviceId = Cfg.get('device.id') || Sys.ro_vars.mac_address;
state.theme = Cfg.get('portal.theme') || 'mario';

print('🔮 Infinity Portal Gateway Starting...');
print('Device ID:', state.deviceId);
print('Portal URL:', state.portalUrl);
print('Default Theme:', state.theme);

// Blink LED to indicate startup
function blinkLED(times, interval) {
  let count = 0;
  Timer.set(interval, Timer.REPEAT, function() {
    GPIO.toggle(LED_PIN);
    count++;
    if (count >= times * 2) {
      return false; // Stop timer
    }
  }, null);
}

// Sync with portal server
function syncWithPortal() {
  if (state.portalUrl === '') {
    print('⚠️ No portal URL configured');
    return;
  }
  
  state.syncCount++;
  let timestamp = Timer.now();
  
  // Send device state to portal
  let payload = JSON.stringify({
    device_id: state.deviceId,
    theme: state.theme,
    uptime: Sys.uptime(),
    free_ram: Sys.free_ram(),
    total_ram: Sys.total_ram(),
    sync_count: state.syncCount,
    timestamp: timestamp,
    firmware_version: '1.0.0'
  });
  
  // Publish to MQTT if enabled
  if (Cfg.get('mqtt.enable')) {
    let topic = Cfg.get('portal.mqtt_topic') + '/' + state.deviceId + '/status';
    MQTT.pub(topic, payload, 1);
    print('📡 Published to MQTT:', topic);
  }
  
  state.lastSync = timestamp;
  state.connected = true;
}

// Handle theme changes from portal
function handleThemeChange(newTheme) {
  if (THEME_INDICATORS[newTheme] !== undefined) {
    state.theme = newTheme;
    print('🎨 Theme changed to:', newTheme);
    
    // Save to config for persistence
    Cfg.set({portal: {theme: newTheme}});
    
    // Blink LED to acknowledge
    blinkLED(3, 200);
  } else {
    print('⚠️ Unknown theme:', newTheme);
  }
}

// MQTT message handler
MQTT.setEventHandler(function(conn, ev, edata) {
  if (ev === MQTT.EV_CONNACK) {
    print('✅ MQTT connected');
    
    // Subscribe to theme changes
    let topic = Cfg.get('portal.mqtt_topic') + '/' + state.deviceId + '/theme';
    MQTT.sub(topic, function(conn, topic, msg) {
      print('📨 Received theme:', msg);
      handleThemeChange(msg);
    }, null);
    
    // Subscribe to commands
    let cmdTopic = Cfg.get('portal.mqtt_topic') + '/' + state.deviceId + '/cmd';
    MQTT.sub(cmdTopic, function(conn, topic, msg) {
      print('📨 Received command:', msg);
      
      try {
        let cmd = JSON.parse(msg);
        if (cmd.action === 'sync') {
          syncWithPortal();
        } else if (cmd.action === 'restart') {
          print('🔄 Restarting device...');
          Sys.reboot(1000);
        }
      } catch (e) {
        print('❌ Failed to parse command:', e);
      }
    }, null);
    
    // Initial sync
    syncWithPortal();
    
  } else if (ev === MQTT.EV_CLOSE) {
    print('❌ MQTT disconnected');
    state.connected = false;
  }
}, null);

// Periodic sync timer
Timer.set(Cfg.get('portal.sync_interval') * 1000, Timer.REPEAT, function() {
  syncWithPortal();
}, null);

// Heartbeat LED
Timer.set(5000, Timer.REPEAT, function() {
  GPIO.toggle(LED_PIN);
}, null);

// Status update timer
Timer.set(10000, Timer.REPEAT, function() {
  state.uptime = Sys.uptime();
  print('💓 Uptime:', state.uptime, 's | Theme:', state.theme, '| Syncs:', state.syncCount);
}, null);

// Startup sequence
blinkLED(5, 100);
print('✅ Infinity Portal Gateway initialized');
print('🧱 C13B0 Mode: ADDITIVE');
