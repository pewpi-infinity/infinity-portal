// 🧱 Portal API - REST API for Mongoose OS devices
// Provides HTTP endpoints for device-portal communication
// Part of C13B0 autonomous system - additive only

/**
 * PortalAPI - REST API server for device communication
 * Architecture: Legend (modular, extensible)
 * Mode: Non-destructive, additive only
 */

class PortalAPI {
  constructor(mongooseSync, config = {}) {
    this.sync = mongooseSync;
    this.port = config.port || 8080;
    this.host = config.host || 'localhost';
    this.prefix = config.prefix || '/api/devices';
    
    console.log('🔮 PortalAPI initialized');
    console.log(`📡 Listening on ${this.host}:${this.port}${this.prefix}`);
  }
  
  /**
   * Handle device registration
   * POST /api/devices/register
   * Body: { device_id, device_info }
   */
  handleRegister(req, res) {
    try {
      const { device_id, ...deviceInfo } = req.body;
      
      if (!device_id) {
        return res.status(400).json({
          error: 'device_id required',
          c13b0: 'ADDITIVE'
        });
      }
      
      const device = this.sync.registerDevice(device_id, deviceInfo);
      
      res.json({
        success: true,
        device: device,
        message: 'Device registered successfully'
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        message: error.message
      });
    }
  }
  
  /**
   * Handle device status update
   * POST /api/devices/:deviceId/status
   * Body: { theme, uptime, free_ram, etc. }
   */
  handleStatus(req, res) {
    try {
      const { deviceId } = req.params;
      const status = req.body;
      
      this.sync.handleDeviceStatus(deviceId, status);
      
      res.json({
        success: true,
        message: 'Status updated'
      });
    } catch (error) {
      console.error('❌ Status update error:', error);
      res.status(500).json({
        error: 'Status update failed',
        message: error.message
      });
    }
  }
  
  /**
   * Get device info
   * GET /api/devices/:deviceId
   */
  handleGetDevice(req, res) {
    try {
      const { deviceId } = req.params;
      const device = this.sync.getDevice(deviceId);
      
      if (!device) {
        return res.status(404).json({
          error: 'Device not found',
          device_id: deviceId
        });
      }
      
      res.json({
        success: true,
        device: device
      });
    } catch (error) {
      console.error('❌ Get device error:', error);
      res.status(500).json({
        error: 'Failed to get device',
        message: error.message
      });
    }
  }
  
  /**
   * Get all devices
   * GET /api/devices
   */
  handleGetDevices(req, res) {
    try {
      const devices = this.sync.getDevices();
      const stats = this.sync.getStats();
      
      res.json({
        success: true,
        devices: devices,
        stats: stats
      });
    } catch (error) {
      console.error('❌ Get devices error:', error);
      res.status(500).json({
        error: 'Failed to get devices',
        message: error.message
      });
    }
  }
  
  /**
   * Sync theme to device
   * POST /api/devices/:deviceId/theme
   * Body: { theme }
   */
  handleSyncTheme(req, res) {
    try {
      const { deviceId } = req.params;
      const { theme } = req.body;
      
      if (!theme) {
        return res.status(400).json({
          error: 'theme required'
        });
      }
      
      const success = this.sync.syncThemeToDevice(deviceId, theme);
      
      if (success) {
        res.json({
          success: true,
          device_id: deviceId,
          theme: theme,
          message: 'Theme synced'
        });
      } else {
        res.status(404).json({
          error: 'Device not found or offline',
          device_id: deviceId
        });
      }
    } catch (error) {
      console.error('❌ Theme sync error:', error);
      res.status(500).json({
        error: 'Theme sync failed',
        message: error.message
      });
    }
  }
  
  /**
   * Send command to device
   * POST /api/devices/:deviceId/command
   * Body: { action, params }
   */
  handleCommand(req, res) {
    try {
      const { deviceId } = req.params;
      const { action, ...params } = req.body;
      
      if (!action) {
        return res.status(400).json({
          error: 'action required'
        });
      }
      
      const success = this.sync.sendCommand(deviceId, action, params);
      
      if (success) {
        res.json({
          success: true,
          device_id: deviceId,
          action: action,
          message: 'Command sent'
        });
      } else {
        res.status(404).json({
          error: 'Device not found',
          device_id: deviceId
        });
      }
    } catch (error) {
      console.error('❌ Command error:', error);
      res.status(500).json({
        error: 'Command failed',
        message: error.message
      });
    }
  }
  
  /**
   * Get API info
   * GET /api/devices/info
   */
  handleInfo(req, res) {
    res.json({
      name: 'Infinity Portal Device API',
      version: '1.0.0',
      endpoints: {
        register: 'POST /api/devices/register',
        status: 'POST /api/devices/:deviceId/status',
        getDevice: 'GET /api/devices/:deviceId',
        getDevices: 'GET /api/devices',
        syncTheme: 'POST /api/devices/:deviceId/theme',
        command: 'POST /api/devices/:deviceId/command'
      },
      c13b0: {
        mode: 'ADDITIVE',
        operator: 'Kris Watson',
        system: 'Infinity / Octave / Mongoose'
      },
      stats: this.sync.getStats()
    });
  }
  
  /**
   * Setup routes (Express.js example)
   * @param {object} app - Express app instance
   */
  setupRoutes(app) {
    const prefix = this.prefix;
    
    // Info endpoint
    app.get(`${prefix}/info`, (req, res) => this.handleInfo(req, res));
    
    // Device management
    app.post(`${prefix}/register`, (req, res) => this.handleRegister(req, res));
    app.get(`${prefix}`, (req, res) => this.handleGetDevices(req, res));
    app.get(`${prefix}/:deviceId`, (req, res) => this.handleGetDevice(req, res));
    
    // Device operations
    app.post(`${prefix}/:deviceId/status`, (req, res) => this.handleStatus(req, res));
    app.post(`${prefix}/:deviceId/theme`, (req, res) => this.handleSyncTheme(req, res));
    app.post(`${prefix}/:deviceId/command`, (req, res) => this.handleCommand(req, res));
    
    console.log('✅ Portal API routes configured');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortalAPI;
}

// Browser global
if (typeof window !== 'undefined') {
  window.PortalAPI = PortalAPI;
}
