"""
Rogers Core - Infinity Portal Authentication Hub
Handles Google Auth and distributes authentication to all realms

SECURITY NOTES:
- For production, implement proper Google token verification using google.auth
- Use environment variables for sensitive configuration
- Replace in-memory storage with a proper database
- Implement rate limiting and request validation
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
import json
import time
from datetime import datetime, timedelta, timezone
from functools import wraps
import warnings

app = Flask(__name__)

# Use environment variable for secret key, warn if not set
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    warnings.warn(
        "SECRET_KEY environment variable not set. Using a default key. "
        "This is insecure for production! Set SECRET_KEY environment variable.",
        RuntimeWarning
    )
    SECRET_KEY = 'dev-secret-key-change-in-production'

app.secret_key = SECRET_KEY

# Configure CORS - restrict origins in production
# For production, set ALLOWED_ORIGINS environment variable with comma-separated origins
allowed_origins = os.getenv('ALLOWED_ORIGINS', '*')
if allowed_origins == '*':
    warnings.warn(
        "CORS configured to allow all origins. For production, set ALLOWED_ORIGINS environment variable.",
        RuntimeWarning
    )
    CORS(app, supports_credentials=True)
else:
    origins_list = [origin.strip() for origin in allowed_origins.split(',')]
    CORS(app, supports_credentials=True, origins=origins_list)

# In-memory storage for demo (use database in production)
AUTH_SESSIONS = {}
REALM_DATA = {
    'portal': {},
    'marketplace': {},
    'socializer': {},
    'builder': {}
}


def verify_google_token(token):
    """
    Verify Google OAuth token
    
    SECURITY WARNING: This is a DEMO implementation that does NOT verify token signatures.
    
    For PRODUCTION use, implement proper verification:
    
    from google.oauth2 import id_token
    from google.auth.transport import requests
    
    try:
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            os.getenv('GOOGLE_CLIENT_ID')
        )
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
            
        return idinfo
    except ValueError:
        return None
    
    CURRENT BEHAVIOR: Decodes JWT without signature verification (INSECURE for production)
    """
    # Check if we should use production verification
    if os.getenv('PRODUCTION_MODE', '').lower() == 'true':
        # In production mode, we require proper verification
        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests as google_requests
            
            client_id = os.getenv('GOOGLE_CLIENT_ID')
            if not client_id:
                print("ERROR: GOOGLE_CLIENT_ID not set in production mode")
                return None
            
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                client_id
            )
            
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                print("ERROR: Invalid token issuer")
                return None
                
            return idinfo
        except Exception as e:
            print(f"Production token verification error: {e}")
            return None
    else:
        # DEMO MODE: Decode without verification (INSECURE)
        warnings.warn(
            "Running in DEMO mode with insecure token verification. "
            "Set PRODUCTION_MODE=true and GOOGLE_CLIENT_ID for secure operation.",
            RuntimeWarning
        )
        try:
            import base64
            parts = token.split('.')
            if len(parts) != 3:
                return None
            
            payload = parts[1]
            # Add padding if needed
            padding = len(payload) % 4
            if padding:
                payload += '=' * (4 - padding)
            
            decoded = base64.urlsafe_b64decode(payload)
            user_data = json.loads(decoded)
            return user_data
        except Exception as e:
            print(f"Token verification error: {e}")
            return None


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        auth_data = None
        
        # Try to get auth from JSON body for POST requests
        if request.method == 'POST' and request.is_json:
            auth_data = request.json.get('auth') if request.json else None
        
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        elif auth_data:
            token = auth_data
        
        if not token:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Verify token
        user_data = verify_google_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid token'}), 401
        
        # Store user in request context
        request.user = user_data
        return f(*args, **kwargs)
    
    return decorated_function


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Rogers Core',
        'version': '1.0.0',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })


@app.route('/auth/verify', methods=['POST'])
def verify_auth():
    """Verify Google authentication token"""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Token required'}), 400
    
    user_data = verify_google_token(token)
    if not user_data:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Create session
    session_id = str(uuid.uuid4())
    AUTH_SESSIONS[session_id] = {
        'user': user_data,
        'token': token,
        'created': time.time(),
        'expires': time.time() + 3600  # 1 hour
    }
    
    return jsonify({
        'status': 'success',
        'session_id': session_id,
        'user': {
            'id': user_data.get('sub'),
            'email': user_data.get('email'),
            'name': user_data.get('name'),
            'picture': user_data.get('picture')
        }
    })


@app.route('/chat', methods=['POST'])
def chat():
    """Rogers AI chat endpoint - main interface for all realms"""
    data = request.json
    message = data.get('message', '')
    context = data.get('context', '')
    auth = data.get('auth')
    user = data.get('user')
    
    # Extract realm from context
    realm = 'core'
    if 'Realm:' in context:
        realm = context.split('Realm:')[1].strip().lower()
    
    # Authenticate if token provided
    authenticated = False
    if auth:
        user_data = verify_google_token(auth)
        if user_data:
            authenticated = True
            user = user_data
    
    # Generate response based on context
    response = generate_rogers_response(message, realm, authenticated, user)
    
    return jsonify({
        'reply': response,
        'realm': realm,
        'authenticated': authenticated,
        'timestamp': datetime.now(timezone.utc).isoformat()
    })


def generate_rogers_response(message, realm, authenticated, user):
    """Generate contextual response from Rogers Core"""
    
    # Realm-specific responses
    realm_intros = {
        'portal': 'Portal Realm active. I can help with calculations, alarms, and daily tools.',
        'marketplace': 'Marketplace Realm active. I can assist with listings and token commerce.',
        'socializer': 'Socializer Realm active. I can help you connect with your local community.',
        'builder': 'AI Builder Realm active. I can help you create and build new experiences.',
        'future': 'Future Realms are coming soon! Stay tuned for AI-powered innovations.',
    }
    
    msg_lower = message.lower()
    
    # Authentication-aware responses
    if authenticated and user:
        user_name = user.get('name', 'there')
        greeting = f"Hello {user_name}! "
    else:
        greeting = "Hello! "
    
    # Context-aware responses
    if 'hello' in msg_lower or 'hi' in msg_lower:
        intro = realm_intros.get(realm, 'Rogers Core ready.')
        return f"{greeting}{intro}"
    
    elif 'help' in msg_lower:
        if realm == 'portal':
            return f"{greeting}In the Portal Realm, you can use the calculator, set alarms, and access daily tools."
        elif realm == 'marketplace':
            return f"{greeting}In the Marketplace Realm, you can create listings and browse token-based commerce."
        elif realm == 'socializer':
            return f"{greeting}In the Socializer Realm, you can join local communities and connect with neighbors."
        elif realm == 'builder':
            return f"{greeting}In the AI Builder Realm, you can create new experiences and tools."
        else:
            return f"{greeting}I'm Rogers Core, your AI assistant across all Infinity realms. Navigate to a realm to get started!"
    
    elif 'auth' in msg_lower or 'login' in msg_lower or 'sign in' in msg_lower:
        if authenticated:
            return f"{greeting}You're already authenticated with Google! Your identity is verified across all realms."
        else:
            return f"{greeting}Click the authentication button to sign in with Google. This will unlock personalized features across all realms."
    
    elif 'realm' in msg_lower:
        realms = ', '.join(realm_intros.keys())
        return f"{greeting}Available realms: {realms}. Each realm has unique features accessible through Rogers Core."
    
    else:
        # Default intelligent response
        return f"{greeting}I'm processing your request in the {realm} realm. How can I assist you further?"


@app.route('/realm/<realm_name>', methods=['GET', 'POST'])
@require_auth
def realm_endpoint(realm_name):
    """Realm-specific endpoints with authentication"""
    
    if realm_name not in REALM_DATA:
        return jsonify({'error': 'Unknown realm'}), 404
    
    user = request.user
    user_id = user.get('sub')
    
    if request.method == 'GET':
        # Get user's data for this realm
        user_realm_data = REALM_DATA[realm_name].get(user_id, {})
        return jsonify({
            'realm': realm_name,
            'data': user_realm_data,
            'user': {
                'id': user_id,
                'email': user.get('email'),
                'name': user.get('name')
            }
        })
    
    elif request.method == 'POST':
        # Save data for this realm
        data = request.json.get('data', {})
        
        if user_id not in REALM_DATA[realm_name]:
            REALM_DATA[realm_name][user_id] = {}
        
        REALM_DATA[realm_name][user_id].update(data)
        REALM_DATA[realm_name][user_id]['last_updated'] = time.time()
        
        return jsonify({
            'status': 'success',
            'realm': realm_name,
            'message': f'Data saved in {realm_name} realm'
        })


@app.route('/upload', methods=['POST'])
@require_auth
def upload_file():
    """Upload endpoint with authentication"""
    try:
        if "file" not in request.files:
            return jsonify({"status": "error", "message": "Missing file field"}), 400
        
        file = request.files["file"]
        metadata = request.form
        fname = secure_filename(file.filename or "upload.zip")
        tmp_path = os.path.join("/tmp", fname)
        file.save(tmp_path)
        
        orchestration_id = str(uuid.uuid4())
        result = {
            "service": "Rogers Core",
            "status": "success",
            "file": fname,
            "user": request.user.get('email')
        }
        
        return jsonify({
            "status": "success",
            "orchestrationId": orchestration_id,
            "result": result
        }), 200
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/dashboard', methods=['GET'])
@require_auth
def dashboard():
    """User dashboard with data from all realms"""
    user = request.user
    user_id = user.get('sub')
    
    dashboard_data = {
        'user': {
            'id': user_id,
            'email': user.get('email'),
            'name': user.get('name'),
            'picture': user.get('picture')
        },
        'realms': {}
    }
    
    # Aggregate data from all realms
    for realm_name, realm_data in REALM_DATA.items():
        user_realm_data = realm_data.get(user_id, {})
        dashboard_data['realms'][realm_name] = {
            'has_data': bool(user_realm_data),
            'last_updated': user_realm_data.get('last_updated'),
            'data_keys': list(user_realm_data.keys())
        }
    
    return jsonify(dashboard_data)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    
    print(f"""
    ╔═══════════════════════════════════════════╗
    ║   ROGERS CORE - INFINITY AUTHENTICATION   ║
    ╚═══════════════════════════════════════════╝
    
    Architecture:
      Google Auth → Rogers Core → Realms
      
    Realms:
      • Portal Realm
      • Marketplace Realm
      • Socializer Realm
      • AI Builder Realm
      
    Starting on port {port}...
    """)
    
    app.run(host="0.0.0.0", port=port, debug=debug)
