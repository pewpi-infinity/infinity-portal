// 🧱 MQTT Handler - Pub/Sub for device communication
// Manages MQTT connections and message routing
// Part of C13B0 autonomous system - additive only

/**
 * MQTTHandler - Manages MQTT communication with devices
 * Architecture: Legend (modular, extensible)
 * Mode: Non-destructive, additive only
 */

class MQTTHandler {
  constructor(mongooseSync, config = {}) {
    this.sync = mongooseSync;
    this.broker = config.broker || 'mqtt://localhost:1883';
    this.topic = config.topic || 'infinity-portal/devices';
    this.client = null;
    this.connected = false;
    this.messageCount = 0;
    
    console.log('🔮 MQTTHandler initialized');
    console.log(`📡 Broker: ${this.broker}`);
    console.log(`📬 Topic: ${this.topic}`);
  }
  
  /**
   * Connect to MQTT broker
   * @param {object} mqttClient - MQTT client instance (e.g., from mqtt.js)
   */
  connect(mqttClient) {
    this.client = mqttClient;
    
    this.client.on('connect', () => {
      console.log('✅ MQTT connected');
      this.connected = true;
      this._subscribeToTopics();
    });
    
    this.client.on('disconnect', () => {
      console.log('❌ MQTT disconnected');
      this.connected = false;
    });
    
    this.client.on('message', (topic, message) => {
      this._handleMessage(topic, message);
    });
    
    this.client.on('error', (error) => {
      console.error('❌ MQTT error:', error);
    });
    
    return this;
  }
  
  /**
   * Subscribe to device topics
   * @private
   */
  _subscribeToTopics() {
    // Subscribe to all device status messages
    const statusTopic = `${this.topic}/+/status`;
    this.client.subscribe(statusTopic, (err) => {
      if (err) {
        console.error('❌ Subscribe error:', err);
      } else {
        console.log(`📬 Subscribed to ${statusTopic}`);
      }
    });
    
    // Subscribe to device registrations
    const registerTopic = `${this.topic}/+/register`;
    this.client.subscribe(registerTopic, (err) => {
      if (err) {
        console.error('❌ Subscribe error:', err);
      } else {
        console.log(`📬 Subscribed to ${registerTopic}`);
      }
    });
  }
  
  /**
   * Handle incoming MQTT message
   * @private
   * @param {string} topic - Message topic
   * @param {Buffer} message - Message payload
   */
  _handleMessage(topic, message) {
    this.messageCount++;
    
    try {
      const parts = topic.split('/');
      if (parts.length < 3) {
        console.warn('⚠️ Invalid topic format:', topic);
        return;
      }
      
      const deviceId = parts[parts.length - 2];
      const messageType = parts[parts.length - 1];
      const payload = message.toString();
      
      console.log(`📨 Received ${messageType} from ${deviceId}`);
      
      switch (messageType) {
        case 'status':
          this.sync.handleDeviceStatus(deviceId, payload);
          break;
          
        case 'register':
          try {
            const deviceInfo = JSON.parse(payload);
            this.sync.registerDevice(deviceId, deviceInfo);
            
            // Send acknowledgment
            this.publish(`${this.topic}/${deviceId}/ack`, JSON.stringify({
              success: true,
              message: 'Registration confirmed'
            }));
          } catch (parseError) {
            console.error('❌ Failed to parse registration payload:', parseError);
            // Send error acknowledgment
            this.publish(`${this.topic}/${deviceId}/ack`, JSON.stringify({
              success: false,
              error: 'Invalid registration data'
            }));
          }
          break;
          
        default:
          console.warn('⚠️ Unknown message type:', messageType);
      }
    } catch (error) {
      console.error('❌ Message handling error:', error);
    }
  }
  
  /**
   * Publish message to topic
   * @param {string} topic - Target topic
   * @param {string} message - Message payload
   * @param {object} options - MQTT publish options
   */
  publish(topic, message, options = {}) {
    if (!this.connected) {
      console.warn('⚠️ MQTT not connected, message not sent');
      return false;
    }
    
    this.client.publish(topic, message, options, (err) => {
      if (err) {
        console.error('❌ Publish error:', err);
      } else {
        console.log(`📤 Published to ${topic}`);
      }
    });
    
    return true;
  }
  
  /**
   * Broadcast theme to all devices
   * @param {string} theme - Theme name
   */
  broadcastTheme(theme) {
    const devices = this.sync.getDevices();
    let sent = 0;
    
    for (const device of devices) {
      if (device.online) {
        const topic = `${this.topic}/${device.id}/theme`;
        this.publish(topic, theme);
        sent++;
      }
    }
    
    console.log(`🎨 Theme '${theme}' broadcast to ${sent} device(s)`);
    return sent;
  }
  
  /**
   * Send command to device
   * @param {string} deviceId - Device identifier
   * @param {string} action - Command action
   * @param {object} params - Command parameters
   */
  sendCommand(deviceId, action, params = {}) {
    const topic = `${this.topic}/${deviceId}/cmd`;
    const command = JSON.stringify({ action, ...params });
    return this.publish(topic, command);
  }
  
  /**
   * Request sync from device
   * @param {string} deviceId - Device identifier
   */
  requestSync(deviceId) {
    return this.sendCommand(deviceId, 'sync');
  }
  
  /**
   * Request device restart
   * @param {string} deviceId - Device identifier
   */
  requestRestart(deviceId) {
    return this.sendCommand(deviceId, 'restart');
  }
  
  /**
   * Get MQTT statistics
   * @returns {object} MQTT statistics
   */
  getStats() {
    return {
      connected: this.connected,
      broker: this.broker,
      topic: this.topic,
      messageCount: this.messageCount,
      c13b0: {
        mode: 'ADDITIVE',
        operator: 'Kris Watson',
        system: 'Infinity / Octave / Mongoose'
      }
    };
  }
  
  /**
   * Disconnect from MQTT broker
   */
  disconnect() {
    if (this.client && this.connected) {
      this.client.end();
      this.connected = false;
      console.log('👋 MQTT disconnected');
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MQTTHandler;
}

// Browser global
if (typeof window !== 'undefined') {
  window.MQTTHandler = MQTTHandler;
}
