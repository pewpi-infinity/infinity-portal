# .infinity Directory

This directory contains configuration and metadata for the Infinity Portal multi-theme gateway system.

## Purpose

The `.infinity` directory stores:
- Portal configuration files
- Theme customization settings
- User interest history
- Arena metadata
- Gateway state information

## Structure

```
.infinity/
├── config.json          # Main portal configuration
├── themes/              # Theme-specific configurations
├── user-data/           # User preferences and history
└── arena-metadata/      # Arena connection information
```

## Configuration

### config.json

Main configuration file for the portal system:

```json
{
  "version": "1.0.0",
  "portal": {
    "defaultTheme": "mario",
    "enableAutoDetect": true,
    "enableMRWEffects": true,
    "enableJoystick": true
  },
  "themes": {
    "enabled": ["mario", "rock", "electronics", "chemistry", "robotics", "math", "physics", "biology", "art", "music", "space"]
  },
  "animations": {
    "transitionDuration": 800,
    "particleCount": 8,
    "enableSound": false
  },
  "mrw": {
    "characterInterval": 3000,
    "carInterval": 5000,
    "mushroomCount": 5
  }
}
```

## Theme Customization

Each theme can be customized by adding files to the `themes/` directory:

- `themes/{theme-id}.json` - Theme override configuration
- `themes/{theme-id}-custom.css` - Custom CSS for theme
- `themes/{theme-id}-sounds/` - Audio files for theme

## User Data

User preferences and interaction history are stored in `user-data/`:

- `interests.json` - Detected user interests over time
- `preferences.json` - User-set preferences
- `energy.json` - Collected energy and progress

## Arena Metadata

Connection information for theme arenas:

- `arena-metadata/{theme-id}.json` - Arena configuration and endpoints

## Integration

The `.infinity` directory integrates with:

- `interest-detector.js` - Reads user data
- `portal-morpher.js` - Loads theme configurations
- `gateway-animations.js` - Loads animation settings

## Security

- User data is stored locally (localStorage + file backup)
- No sensitive information should be stored here
- Config files are version controlled
- User data files are gitignored

## Future Extensions

- Multiplayer portal connections
- Cloud sync for user data
- Custom theme marketplace
- Arena-specific plugins
- Advanced analytics

---

Part of the Infinity Portal multi-theme gateway system
Built with 🧱 by Kris Watson
