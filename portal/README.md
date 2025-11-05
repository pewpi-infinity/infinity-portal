# Infinity Portal - AI-Augmented Vector Web Interface

## Overview

The Infinity Portal is a cutting-edge, immersive web interface that provides AI-driven navigation through various application zones. Built with a white background and animated vector web visualization, it offers a unique cyberspace experience.

## Features

- **Google Sign-In Authentication**: Secure entry point using Google OAuth
- **AI-Powered Navigation**: Gemini API integration for intelligent zone discovery
- **Animated Vector Web**: Smooth, animated transitions between app zones
- **Modular Zone System**: Extensible architecture for adding new zones

## Architecture

### Core Files

- `index.html` - Main entry point with authentication screen and vector web interface
- `auth.js` - Google Sign-In authentication manager
- `core/ai.js` - Gemini API integration for AI-driven interactions
- `core/vector-web.js` - Canvas-based vector web visualization
- `assets/js/app.js` - Main application controller

### Zones

Each zone is a self-contained module:

1. **Autopilot** (`zones/autopilot.js`) - Modular LLM builder for creating custom AI agents
2. **News** (`zones/news.js`) - Science and technology news feed
3. **Shorts/Aura** (`zones/shorts.js`) - Short-form content creation with visual effects
4. **Star Quest** (`zones/starquest.js`) - Karaoke and talent showcase with AI feedback
5. **Live** (`zones/live.js`) - Real-time logs, streams, and monitoring
6. **Economy** (`zones/economy.js`) - Economic metrics and analytics dashboard

## Configuration

### API Keys

- **Google Client ID**: `16937806382-leqbaginj3igrhei58nsab7tb4hsb7435.apps.googleusercontent.com`
- **Gemini API Key**: `AIzaSyDWKRhBjFEt752zC86X0aQOvRQHxM5XPlc`

## Usage

### Accessing the Portal

1. Navigate to the portal: `portal/index.html`
2. Sign in with Google account
3. Enter the vector web cyberspace
4. Use AI input or click on nodes to navigate between zones

### Adding New Zones

To add a new zone:

1. Create a new file in `zones/` directory (e.g., `zones/myzone.js`)
2. Implement the zone class with required methods:
   - `constructor()` - Initialize zone
   - `init()` - Register with zone manager
   - `render(container)` - Render zone content
   - `onEnter()` - Called when entering zone
   - `onExit()` - Called when exiting zone
3. Register the zone with AI manager in `core/ai.js`
4. Add script tag to `index.html`

### Example Zone Template

```javascript
class MyZone {
  constructor() {
    this.id = 'myzone';
    this.name = 'My Zone';
    this.init();
  }

  init() {
    if (window.zoneManager) {
      window.zoneManager.registerZone(this);
    }
  }

  render(container) {
    container.innerHTML = `
      <button class="back-btn" onclick="window.appController.returnToVectorWeb()">← Back</button>
      <div class="zone-header">
        <h2>My Zone</h2>
        <p>Zone description</p>
      </div>
      <!-- Zone content -->
    `;
  }

  onEnter() {
    console.log('Entered My Zone');
  }

  onExit() {
    console.log('Exited My Zone');
  }
}

const myZone = new MyZone();
window.myZone = myZone;
```

## Technologies

- **HTML5 Canvas** - Vector web visualization
- **Vanilla JavaScript** - No framework dependencies
- **Google Identity Services** - Authentication
- **Gemini API** - AI intelligence
- **CSS3** - Animations and styling

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

## Future Enhancements

- WebGL/Three.js for 3D vector web
- Real-time collaboration features
- Advanced AI conversation memory
- Zone-to-zone direct transitions
- Custom node positioning
- Voice navigation
- Progressive Web App (PWA) support

## License

See repository root LICENSE file.
