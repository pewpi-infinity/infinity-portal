# Quick Start Guide - Infinity Portal

## For Demo/Development

### 1. Quick Start (Demo Mode)

```bash
# Clone the repository
git clone https://github.com/pewpi-infinity/infinity-portal.git
cd infinity-portal

# Run the startup script
./start_infinity_portal.sh

# Open browser to:
# http://localhost:8080/infinity_portal_with_google_auth.html
```

The portal will run in demo mode with:
- Mock authentication (no real Google OAuth)
- In-memory storage
- CORS enabled for all origins

### 2. Configure Google Auth (Optional for Demo)

1. Get Google OAuth credentials:
   - Go to https://console.cloud.google.com/
   - Create a project
   - Enable Google+ API
   - Create OAuth 2.0 Client ID
   - Add `http://localhost:8080` to authorized origins

2. Configure in the portal:
   - Click menu (☰)
   - Enter your Google Client ID
   - Click "Save Client ID"

3. Sign in:
   - Click the lock icon (🔐)
   - Sign in with Google

## For Production

### 1. Prerequisites

- Python 3.8+
- PostgreSQL or MongoDB (for persistent storage)
- Google OAuth credentials
- Domain with HTTPS

### 2. Environment Setup

```bash
# Generate a secret key
export SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")

# Set Google OAuth credentials
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"

# Set allowed CORS origins
export ALLOWED_ORIGINS="https://yourdomain.com,https://app.yourdomain.com"

# Enable production mode
export PRODUCTION_MODE=true

# Optional: Custom port
export PORT=8080
```

### 3. Database Setup

Replace the in-memory storage in `rogers_core.py`:

```python
# Instead of:
AUTH_SESSIONS = {}
REALM_DATA = {...}

# Use a database:
from sqlalchemy import create_engine
db = create_engine('postgresql://user:pass@localhost/infinity')
# ... implement proper database models
```

### 4. Production Server

Don't use Flask's development server. Use Gunicorn:

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8080 rogers_core:app
```

### 5. Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Docker Deployment

```bash
# Build image
docker build -f Dockerfile.rogers -t infinity-portal .

# Run with docker-compose
docker-compose up -d
```

## Architecture Overview

```
┌──────────────┐
│ Google Auth  │
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│ Infinity Core      │ (Rogers - Python Flask)
│ (Rogers)           │
└──────┬─────┬───────┘
       │     │
   ┌───┘     └────┐
   ▼              ▼
Portal         Marketplace
Realm          Realm
   ▼              ▼
Socializer     AI Builder
Realm          Realm
```

## Testing

```bash
# Run integration tests
python3 rogers_core.py &
SERVER_PID=$!
python3 test_integration.py
kill $SERVER_PID
```

## API Endpoints

### Health Check
```
GET /health
```

### Chat (Rogers Core AI)
```
POST /chat
Content-Type: application/json

{
  "message": "hello",
  "context": "Realm: portal",
  "auth": "optional-google-token"
}
```

### Realm Data (Authenticated)
```
GET /realm/{realm_name}
Authorization: Bearer {google-id-token}
```

### User Dashboard (Authenticated)
```
GET /dashboard
Authorization: Bearer {google-id-token}
```

## Troubleshooting

### Google Sign-In Not Working
- Verify Client ID is correct
- Check authorized origins in Google Console
- Ensure Google Identity Services script loads

### CORS Errors
- Check ALLOWED_ORIGINS environment variable
- Verify your domain is in the allowed list
- In demo mode, CORS is open (check browser console)

### Token Verification Fails
- Ensure PRODUCTION_MODE=true is set
- Verify GOOGLE_CLIENT_ID is correct
- Check that google-auth package is installed

### Server Won't Start
- Check port 8080 is available
- Verify Python dependencies installed
- Check SECRET_KEY is set

## Security Checklist

Before production deployment:

- [ ] Set `PRODUCTION_MODE=true`
- [ ] Set `SECRET_KEY` (use: `python -c "import secrets; print(secrets.token_hex(32))"`)
- [ ] Set `GOOGLE_CLIENT_ID`
- [ ] Set `ALLOWED_ORIGINS` (comma-separated)
- [ ] Use PostgreSQL/MongoDB (not in-memory storage)
- [ ] Use Gunicorn (not Flask dev server)
- [ ] Enable HTTPS/TLS
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Regular security updates

## More Information

- Full documentation: [README.md](README.md)
- Security guide: [SECURITY.md](SECURITY.md)
- Architecture diagram: Open `architecture_diagram.html` in browser

## Support

For questions or issues: infinitystockinvesting@gmail.com
