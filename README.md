# Rogers Portal – Infinity

A full-featured AI chat portal with app drawer, voice input, file attachments, and customizable theming.

## Features

### 🎨 Customizable Theming
- Click the color square in the header to change the brand color
- Theme persists across sessions using localStorage
- All UI elements update dynamically

### ☰ App Drawer
- Left-side hamburger menu for quick app navigation
- Loads apps in an iframe without page refresh
- Supports HTML pages and PDF documents
- PDF files are automatically embedded fullscreen

### 🎤 Voice Input
- Web Speech API integration for voice-to-text
- Click the microphone button to start voice input
- Works on supported browsers (Chrome, Edge, Safari on iOS)
- Gracefully degrades on unsupported platforms

### 📎 File Attachments
- Multi-file selection support
- Thumbnail preview for images
- File type indicators for non-image files
- Ready for backend integration

### 📊 Token Counting
- Real-time token estimation (~4 chars per token)
- Displays user tokens, bot tokens, and total per message
- Helps track conversation length and API costs

### 🔐 Google Authentication
- Google OAuth integration ready
- Configure in `auth.json` with your client ID
- Shows user avatar when signed in
- Allowed emails list for owner identification

### 📱 Mobile-Optimized
- Fixed composer that stays above the mobile keyboard
- Responsive drawer with overlay
- Touch-friendly controls
- Works great on phones and tablets

### ∞ Built-in Favicon
- Inline SVG favicon (infinity symbol)
- Eliminates 404 errors
- No external file needed

## Configuration

### apps.json

Create or edit `apps.json` to add apps to the drawer:

```json
[
  {
    "title": "Pi Singer",
    "path": "pi_singer.html"
  },
  {
    "title": "Infinity Portal",
    "path": "index.html"
  },
  {
    "title": "Rogers Notes (PDF)",
    "path": "docs/rogers-notes.pdf"
  }
]
```

- Any `path` ending with `.pdf` is embedded fullscreen automatically
- Non-PDF links load directly in the stage iframe
- Apps can be local files or web URLs (if CORS allows)

### auth.json

Configure authentication and backend in `auth.json`:

```json
{
  "google_client_id": "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com",
  "allowed_emails": ["marvaseater@gmail.com"],
  "chat_endpoint": "https://your-api.example.com/chat"
}
```

- **google_client_id**: Your Google OAuth 2.0 client ID. Leave empty to hide the sign-in button
- **allowed_emails**: Array of email addresses for owner identification (doesn't block others)
- **chat_endpoint**: URL to your LLM backend. Leave empty to use the Watson-style stub

### Backend Integration

If you set a `chat_endpoint`, the portal will POST messages in this format:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your question here"
    }
  ]
}
```

Your backend should return JSON with a `reply` field:

```json
{
  "reply": "The AI's response here"
}
```

If `chat_endpoint` is empty, the portal uses a Watson-style stub that responds to greetings and mentions of "infinity" and "help".

## Usage

### Local Testing

```bash
# Start a simple HTTP server
python3 -m http.server 8080

# Or use Node.js
npx http-server -p 8080

# Open in browser
open http://localhost:8080
```

### GitHub Pages Deployment

1. Push `index.html`, `apps.json`, and `auth.json` to your repository
2. Enable GitHub Pages in repository settings
3. Select the branch containing your files
4. Access your portal at `https://<username>.github.io/<repository>/`

## Browser Compatibility

- **Desktop**: Chrome, Edge, Firefox, Safari
- **Mobile**: Chrome on Android, Safari on iOS
- **Voice Input**: Chrome, Edge (Desktop & Mobile), Safari on iOS
- **File Attachments**: All modern browsers

## File Structure

```
infinity-portal/
├── index.html           # Main Rogers Portal (single file, all features)
├── apps.json           # App navigation configuration
├── auth.json           # Authentication and backend settings
├── pi_singer.html      # Example app: Pi Singer
├── watson_divot_healer.html  # Example app
└── README.md           # This file
```

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift+Enter**: New line in message

## Tips

### Voice Input on Android
Some Android builds may have Web Speech API disabled. If the mic button shows "not available", you can still use the keyboard's built-in mic feature.

### Local Development
If you're running services on `localhost` or Termux, remember that GitHub Pages can't reach those. Use tunneling services (ngrok, localtunnel) or deploy to a publicly accessible URL.

### Theme Persistence
The theme color is stored in `localStorage` and will persist across browser sessions on the same device.

## Credits

Built with ❤️ for the **INFINITY** platform.

Powered by **INFINITY** ∞
