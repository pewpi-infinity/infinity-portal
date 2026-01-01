// 🧱 Mongoose Sync - Sync portal state with ESP32/ESP8266 devices
// Part of C13B0 autonomous system - additive only

/**
 * MongooseSync - Manages synchronization between Infinity Portal and Mongoose OS devices
 * Architecture: Legend (modular, extensible)
 * Mode: Non-destructive, additive only
 */

class MongooseSync {
  constructor(config = {}) {
    this.devices = new Map();
    this.mqttClient = null;
    this.portalState = null;
    this.syncInterval = config.syncInterval || 60000; // 60 seconds
    this.mqttTopic = config.mqttTopic || 'infinity-portal/devices';
    this.portalUrl = config.portalUrl || '';
    this.autoSync = config.autoSync !== false;
    
    // C13B0 tracking
    this.syncCount = 0;
    this.lastSync = null;
    this.errors = [];
    
    console.log('🔮 MongooseSync initialized');
    console.log('🧱 C13B0 Mode: ADDITIVE');
  }
  
  /**
   * Register a new device
   * @param {string} deviceId - Unique device identifier
   * @param {object} deviceInfo - Device information
   */
  registerDevice(deviceId, deviceInfo) {
    if (!this.devices.has(deviceId)) {
      this.devices.set(deviceId, {
        id: deviceId,
        ...deviceInfo,
        registered: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        syncCount: 0,
        online: true
      });
      
      console.log(`✅ Device registered: ${deviceId}`);
      this._saveRegistry();
    }
    
    return this.devices.get(deviceId);
  }
  
  /**
   * Update device state
   * @param {string} deviceId - Device identifier
   * @param {object} state - Device state update
   */
  updateDevice(deviceId, state) {
    if (this.devices.has(deviceId)) {
      const device = this.devices.get(deviceId);
      Object.assign(device, state, {
        lastSeen: new Date().toISOString(),
        online: true
      });
      
      this.devices.set(deviceId, device);
      this._saveRegistry();
    }
  }
  
  /**
   * Sync portal theme to device
   * @param {string} deviceId - Device identifier
   * @param {string} theme - Theme name
   */
  syncThemeToDevice(deviceId, theme) {
    const device = this.devices.get(deviceId);
    if (!device) {
      console.warn(`⚠️ Device not found: ${deviceId}`);
      return false;
    }
    
    // Send theme via MQTT
    if (this.mqttClient) {
      const topic = `${this.mqttTopic}/${deviceId}/theme`;
      this.mqttClient.publish(topic, theme);
      console.log(`🎨 Theme '${theme}' synced to device ${deviceId}`);
    }
    
    // Update device state
    this.updateDevice(deviceId, { theme: theme });
    
    return true;
  }
  
  /**
   * Sync portal state to all devices
   * @param {object} portalState - Current portal state
   */
  syncPortalState(portalState) {
    this.portalState = portalState;
    this.syncCount++;
    this.lastSync = new Date().toISOString();
    
    const theme = portalState.currentTheme || 'mario';
    let synced = 0;
    
    for (const [deviceId, device] of this.devices) {
      if (device.online) {
        if (this.syncThemeToDevice(deviceId, theme)) {
          device.syncCount = (device.syncCount || 0) + 1;
          synced++;
        }
      }
    }
    
    console.log(`📡 Portal state synced to ${synced} device(s)`);
    
    // Save manifest
    this._saveManifest();
    
    return synced;
  }
  
  /**
   * Send command to device
   * @param {string} deviceId - Device identifier
   * @param {string} action - Command action
   * @param {object} params - Command parameters
   */
  sendCommand(deviceId, action, params = {}) {
    if (!this.devices.has(deviceId)) {
      console.warn(`⚠️ Device not found: ${deviceId}`);
      return false;
    }
    
    if (this.mqttClient) {
      const topic = `${this.mqttTopic}/${deviceId}/cmd`;
      const command = JSON.stringify({ action, ...params });
      this.mqttClient.publish(topic, command);
      console.log(`📨 Command '${action}' sent to device ${deviceId}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Handle device status message
   * @param {string} deviceId - Device identifier
   * @param {object} status - Device status
   */
  handleDeviceStatus(deviceId, status) {
    try {
      const deviceData = typeof status === 'string' ? JSON.parse(status) : status;
      
      this.updateDevice(deviceId, {
        theme: deviceData.theme,
        uptime: deviceData.uptime,
        free_ram: deviceData.free_ram,
        total_ram: deviceData.total_ram,
        sync_count: deviceData.sync_count,
        firmware_version: deviceData.firmware_version
      });
      
      console.log(`💓 Device ${deviceId} status updated`);
    } catch (error) {
      console.error(`❌ Error parsing device status:`, error);
      this.errors.push({
        timestamp: new Date().toISOString(),
        device: deviceId,
        error: error.message
      });
    }
  }
  
  /**
   * Get all devices
   * @returns {Array} Array of device objects
   */
  getDevices() {
    return Array.from(this.devices.values());
  }
  
  /**
   * Get device by ID
   * @param {string} deviceId - Device identifier
   * @returns {object|null} Device object or null
   */
  getDevice(deviceId) {
    return this.devices.get(deviceId) || null;
  }
  
  /**
   * Get online devices count
   * @returns {number} Number of online devices
   */
  getOnlineCount() {
    return Array.from(this.devices.values()).filter(d => d.online).length;
  }
  
  /**
   * Mark device as offline if not seen recently
   * @param {number} timeout - Timeout in milliseconds
   */
  checkDeviceStatus(timeout = 300000) { // 5 minutes default
    const now = new Date().getTime();
    
    for (const [deviceId, device] of this.devices) {
      const lastSeen = new Date(device.lastSeen).getTime();
      if (now - lastSeen > timeout) {
        device.online = false;
        this.devices.set(deviceId, device);
        console.log(`⏰ Device ${deviceId} marked as offline`);
      }
    }
    
    this._saveRegistry();
  }
  
  /**
   * Get sync statistics
   * @returns {object} Sync statistics
   */
  getStats() {
    return {
      totalDevices: this.devices.size,
      onlineDevices: this.getOnlineCount(),
      totalSyncs: this.syncCount,
      lastSync: this.lastSync,
      errors: this.errors.length,
      c13b0: {
        mode: 'ADDITIVE',
        operator: 'Kris Watson',
        system: 'Infinity / Octave / Mongoose'
      }
    };
  }
  
  /**
   * Save device registry (to be implemented with file system)
   * @private
   */
  _saveRegistry() {
    // This would save to device-registry.json
    // Implementation depends on Node.js/browser environment
    const registry = {
      devices: Array.from(this.devices.values()),
      lastUpdate: new Date().toISOString()
    };
    
    // For now, just log
    // In real implementation: fs.writeFileSync('sync/device-registry.json', JSON.stringify(registry, null, 2));
  }
  
  /**
   * Save firmware manifest (to be implemented with file system)
   * @private
   */
  _saveManifest() {
    const manifest = {
      version: '1.0.0',
      syncCount: this.syncCount,
      lastSync: this.lastSync,
      devices: this.devices.size,
      portalState: this.portalState
    };
    
    // For now, just log
    // In real implementation: fs.writeFileSync('sync/firmware-manifest.json', JSON.stringify(manifest, null, 2));
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MongooseSync;
}

// Browser global
if (typeof window !== 'undefined') {
  window.MongooseSync = MongooseSync;
}
