// 🧱 Portal API for Device - RPC handlers for Mongoose OS
// Provides REST-like API on the device itself

load('api_rpc.js');
load('api_config.js');
load('api_sys.js');

// RPC: Get device status
RPC.addHandler('Portal.GetStatus', function(args) {
  return {
    device_id: Cfg.get('device.id') || Sys.ro_vars.mac_address,
    theme: Cfg.get('portal.theme') || 'mario',
    uptime: Sys.uptime(),
    free_ram: Sys.free_ram(),
    total_ram: Sys.total_ram(),
    arch: Sys.ro_vars.arch,
    fw_version: Sys.ro_vars.fw_version,
    fw_id: Sys.ro_vars.fw_id,
    portal_version: '1.0.0',
    c13b0_mode: 'ADDITIVE'
  };
});

// RPC: Set theme
RPC.addHandler('Portal.SetTheme', function(args) {
  if (!args || !args.theme) {
    return {error: 'theme parameter required'};
  }
  
  let validThemes = ['mario', 'rock', 'electronics', 'chemistry', 'robotics', 
                     'math', 'physics', 'biology', 'art', 'music', 'space'];
  
  if (validThemes.indexOf(args.theme) === -1) {
    return {error: 'invalid theme', valid_themes: validThemes};
  }
  
  Cfg.set({portal: {theme: args.theme}});
  
  return {
    success: true,
    theme: args.theme,
    message: 'Theme updated successfully'
  };
});

// RPC: Get portal configuration
RPC.addHandler('Portal.GetConfig', function(args) {
  return {
    portal_url: Cfg.get('portal.url'),
    sync_interval: Cfg.get('portal.sync_interval'),
    theme: Cfg.get('portal.theme'),
    mqtt_topic: Cfg.get('portal.mqtt_topic'),
    mqtt_enabled: Cfg.get('mqtt.enable'),
    mqtt_server: Cfg.get('mqtt.server')
  };
});

// RPC: Update portal configuration
RPC.addHandler('Portal.SetConfig', function(args) {
  if (!args) {
    return {error: 'configuration parameters required'};
  }
  
  let updates = {};
  
  if (args.portal_url !== undefined) {
    updates['portal.url'] = args.portal_url;
  }
  if (args.sync_interval !== undefined) {
    updates['portal.sync_interval'] = args.sync_interval;
  }
  if (args.theme !== undefined) {
    updates['portal.theme'] = args.theme;
  }
  if (args.mqtt_server !== undefined) {
    updates['mqtt.server'] = args.mqtt_server;
  }
  
  Cfg.set(updates);
  
  return {
    success: true,
    updated: updates,
    message: 'Configuration updated'
  };
});

// RPC: Trigger sync
RPC.addHandler('Portal.Sync', function(args) {
  // This will be called by init.js syncWithPortal function
  return {
    success: true,
    message: 'Sync triggered',
    timestamp: Timer.now()
  };
});

// RPC: Get available themes
RPC.addHandler('Portal.GetThemes', function(args) {
  return {
    themes: [
      {id: 'mario', name: 'Mario World', emoji: '🍄'},
      {id: 'rock', name: 'Rock Arena', emoji: '🎸'},
      {id: 'electronics', name: 'Electronics Lab', emoji: '🔌'},
      {id: 'chemistry', name: 'Chemistry Lab', emoji: '🧪'},
      {id: 'robotics', name: 'Robotics Factory', emoji: '🤖'},
      {id: 'math', name: 'Mathematics Realm', emoji: '📐'},
      {id: 'physics', name: 'Physics Field', emoji: '⚛️'},
      {id: 'biology', name: 'Biology Center', emoji: '🧬'},
      {id: 'art', name: 'Art Studio', emoji: '🎨'},
      {id: 'music', name: 'Music Studio', emoji: '🎵'},
      {id: 'space', name: 'Space Station', emoji: '🚀'}
    ]
  };
});

// RPC: Device info (extended)
RPC.addHandler('Portal.GetDeviceInfo', function(args) {
  return {
    device_id: Cfg.get('device.id') || Sys.ro_vars.mac_address,
    mac_address: Sys.ro_vars.mac_address,
    architecture: Sys.ro_vars.arch,
    firmware_version: Sys.ro_vars.fw_version,
    firmware_id: Sys.ro_vars.fw_id,
    app_name: Sys.ro_vars.app,
    portal_version: '1.0.0',
    uptime: Sys.uptime(),
    ram: {
      free: Sys.free_ram(),
      total: Sys.total_ram(),
      min_free: Sys.ro_vars.min_free_ram
    },
    c13b0: {
      mode: 'ADDITIVE',
      operator: 'Kris Watson',
      system: 'Infinity / Octave / Mongoose'
    }
  };
});

print('📡 Portal API handlers registered');
