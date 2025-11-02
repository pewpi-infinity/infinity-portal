# Infinity Portal - Google Auth Integration

## Architecture

```
          ┌──────────────┐
          │ Google Auth  │
          └──────┬───────┘
                 │
                 ▼
       ┌────────────────────┐
       │ Infinity Core (Rogers) │
       └──────┬───────┬───────┘
              │       │
     ┌────────┘       └─────────┐
     ▼                          ▼
 Portal Realm           Marketplace Realm
     ▼                          ▼
 Socializer Realm       Future Realms (AI Builder, etc.)
```

## Overview

The Infinity Portal implements a multi-realm architecture where Google Authentication flows through a central **Rogers Core** hub, which then distributes authenticated sessions to various realm applications.

## Components

### 1. Google Authentication Layer
- **Purpose**: Primary authentication provider
- **Technology**: Google OAuth 2.0 / Google Identity Services
- **Implementation**: `infinity_core_auth.js`
- **Features**:
  - Google One Tap sign-in
  - OAuth 2.0 fallback flow
  - JWT token handling
  - Persistent authentication state

### 2. Infinity Core (Rogers)
- **Purpose**: Central authentication and orchestration hub
- **Technology**: Python Flask backend
- **Implementation**: `rogers_core.py`
- **Features**:
  - Google token verification
  - Session management
  - Realm-specific data storage
  - Contextual AI chat interface
  - Cross-realm authentication distribution

### 3. Realms

#### Portal Realm
- Home tools and utilities
- Calculator, alarms, and daily features
- Personal productivity tools

#### Marketplace Realm
- Token-based commerce platform
- Listings and trading
- Community marketplace

#### Socializer Realm
- Local community connections
- Location-based chat
- Social networking features

#### AI Builder Realm (Future)
- AI-powered creation tools
- Custom experience builder
- Developer tools

#### Future Realms
- Extensible architecture for additional realms
- Plugin-based realm system

## File Structure

```
infinity-portal/
├── infinity_core_auth.js              # Authentication module
├── rogers_core.py                      # Backend core service
├── infinity_portal_with_google_auth.html  # Main portal UI
├── requirements.txt                    # Python dependencies
├── README.md                          # This file
└── app.py                             # Legacy app (kept for compatibility)
```

## Setup

### Prerequisites
- Python 3.8+
- Google Cloud Project with OAuth 2.0 credentials
- Modern web browser with JavaScript enabled

### Google OAuth Setup

1. Create a Google Cloud Project at https://console.cloud.google.com/
2. Enable Google+ API
3. Create OAuth 2.0 credentials:
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:8080` (for local testing)
   - Authorized redirect URIs: `http://localhost:8080`
4. Copy your Client ID

### Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Rogers Core backend
python rogers_core.py
```

The server will start on `http://localhost:8080`

### Configuration

1. Open `infinity_portal_with_google_auth.html` in a web browser
2. Click the menu button (☰) to open settings
3. Enter your Google Client ID in the configuration panel
4. Click "Save Client ID"
5. (Optional) Configure Rogers Core endpoint if running on a different server

## Usage

### Authenticating

1. Click the authentication button (🔐) in the top-right corner
2. Choose "Sign in with Google"
3. Complete the Google authentication flow
4. Your authentication will be distributed to all realms through Rogers Core

### Accessing Realms

Once authenticated, you can access different realms:

- **Portal**: Click the "PORTAL" node for home tools
- **Market**: Click the "MARKET" node for marketplace features
- **Social**: Click the "SOCIAL" node for community features
- **Builder**: Click the "BUILDER" node for AI creation tools

### Rogers Core AI

The Rogers Core AI assistant is available in all realms:

1. Click the "R" button in the bottom-right corner
2. Type your message
3. Rogers will respond with context-aware assistance based on your current realm

## API Endpoints

### Rogers Core Backend

#### Health Check
```
GET /health
```
Returns service status and version info.

#### Verify Authentication
```
POST /auth/verify
Content-Type: application/json

{
  "token": "google-id-token"
}
```

#### Chat Interface
```
POST /chat
Content-Type: application/json

{
  "message": "your message",
  "context": "Realm: portal",
  "auth": "google-id-token",
  "user": {user-object}
}
```

#### Realm Data Access
```
GET /realm/{realm_name}
Authorization: Bearer {google-id-token}
```

```
POST /realm/{realm_name}
Authorization: Bearer {google-id-token}
Content-Type: application/json

{
  "data": {realm-specific-data}
}
```

#### User Dashboard
```
GET /dashboard
Authorization: Bearer {google-id-token}
```

## Security Considerations

### Current Implementation (Demo)
- JWT tokens are decoded without verification for demo purposes
- In-memory session storage (non-persistent)
- CORS enabled for all origins

### Production Recommendations
1. **Token Verification**: Use `google.oauth2.id_token.verify_oauth2_token()` for proper token verification
2. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
3. **CORS**: Restrict CORS to specific trusted origins
4. **HTTPS**: Always use HTTPS in production
5. **Session Management**: Implement secure session handling with expiration
6. **Rate Limiting**: Add rate limiting to prevent abuse
7. **Secret Management**: Use environment variables or secret management service for sensitive data

## Environment Variables

```bash
# Rogers Core
PORT=8080                    # Server port
DEBUG=false                  # Debug mode
SECRET_KEY=your-secret-key   # Flask secret key

# Google OAuth (optional for backend)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Development

### Running Locally

```bash
# Terminal 1: Start Rogers Core
python rogers_core.py

# Terminal 2: Serve the HTML file
python -m http.server 3000
```

Then open `http://localhost:3000/infinity_portal_with_google_auth.html` in your browser.

### Testing Authentication

For local testing without a real Google Client ID:
1. The portal will work in demo mode
2. Authentication features will be simulated
3. Configure a real Client ID to enable full Google Auth

## Architecture Benefits

1. **Centralized Authentication**: Single sign-on across all realms
2. **Scalability**: Easy to add new realms
3. **Security**: Authentication handled by Google and centralized in Rogers Core
4. **User Experience**: Seamless navigation between realms
5. **Context Awareness**: Rogers AI understands which realm you're in
6. **Future-Proof**: Extensible architecture for new features

## Troubleshooting

### Google Sign-In Not Working
- Verify your Client ID is correct
- Check that your domain is authorized in Google Cloud Console
- Ensure Google Identity Services script is loaded

### Rogers Core Connection Failed
- Verify the backend is running on the correct port
- Check CORS configuration
- Ensure the Rogers endpoint is configured correctly

### Authentication Token Expired
- Tokens expire after 1 hour by default
- Sign out and sign in again to refresh

## Future Enhancements

- [ ] Implement proper Google token verification
- [ ] Add database persistence
- [ ] Implement real-time updates with WebSockets
- [ ] Add more realms (Analytics, Admin, etc.)
- [ ] Enhanced AI capabilities in Rogers Core
- [ ] Multi-factor authentication
- [ ] User preferences and settings sync
- [ ] Realm permissions and access control

## License

This project is part of the Infinity Portal ecosystem.

## Contact

For questions or support: infinitystockinvesting@gmail.com
