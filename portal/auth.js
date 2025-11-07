/**
 * Authentication Module
 * Handles Google Sign-In authentication
 * 
 * SECURITY NOTE: Google OAuth client IDs are public and must be present in client-side code.
 * For production, use environment variables or secure configuration management to allow rotation.
 * The real security concern is ensuring proper domain and redirect URI restrictions in the Google Cloud Console.
 */

// Use environment variable or global for client ID, fallback to hardcoded value for demo
const GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || '16937806382-leqbaginj3igrhei58nsab7tb4hsb7435.apps.googleusercontent.com';

const AUTH_CONFIG = {
  clientId: GOOGLE_CLIENT_ID,
  redirectUri: window.location.origin + window.location.pathname
};

class AuthManager {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.initGoogleAuth();
  }

  initGoogleAuth() {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.setupGoogleSignIn();
    };
    script.onerror = () => {
      // Fallback if Google script fails to load
      console.log('Google Sign-In script failed to load, using fallback');
      this.setupFallbackAuth();
    };
    document.head.appendChild(script);
  }

  setupGoogleSignIn() {
    // Initialize Google Sign-In
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: AUTH_CONFIG.clientId,
        callback: (response) => this.handleCredentialResponse(response)
      });

      // Render the sign-in button
      const signInBtn = document.getElementById('google-signin-btn');
      if (signInBtn) {
        signInBtn.addEventListener('click', () => {
          google.accounts.id.prompt();
        });
      }

      // Check for existing session
      this.checkExistingSession();
    } else {
      console.error('Google Identity Services not loaded');
      // Fallback: allow manual sign-in for demo purposes
      this.setupFallbackAuth();
    }
  }

  setupFallbackAuth() {
    // Fallback authentication for demo/testing
    const signInBtn = document.getElementById('google-signin-btn');
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        // Simulate successful authentication
        this.handleCredentialResponse({
          credential: 'demo-token',
          select_by: 'btn'
        });
      });
    }
  }

  handleCredentialResponse(response) {
    try {
      // Decode JWT token (in production, validate on server)
      if (response.credential && response.credential !== 'demo-token') {
        const payload = this.parseJwt(response.credential);
        this.user = {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          picture: payload.picture
        };
      } else {
        // Demo user
        this.user = {
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@infinity-portal.com',
          picture: null
        };
      }

      this.isAuthenticated = true;
      this.saveSession();
      this.onAuthSuccess();
    } catch (error) {
      console.error('Authentication error:', error);
      this.onAuthFailure(error);
    }
  }

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  saveSession() {
    if (this.user) {
      sessionStorage.setItem('infinity_user', JSON.stringify(this.user));
      sessionStorage.setItem('infinity_auth', 'true');
    }
  }

  checkExistingSession() {
    const savedUser = sessionStorage.getItem('infinity_user');
    const isAuth = sessionStorage.getItem('infinity_auth');
    
    if (savedUser && isAuth === 'true') {
      this.user = JSON.parse(savedUser);
      this.isAuthenticated = true;
      this.onAuthSuccess();
    }
  }

  signOut() {
    this.user = null;
    this.isAuthenticated = false;
    sessionStorage.removeItem('infinity_user');
    sessionStorage.removeItem('infinity_auth');
    
    // Sign out from Google
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    
    // Reload to show auth screen
    window.location.reload();
  }

  onAuthSuccess() {
    // Hide auth screen
    const authScreen = document.getElementById('auth-screen');
    const vectorWeb = document.getElementById('vector-web');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    if (authScreen) authScreen.style.display = 'none';
    if (vectorWeb) vectorWeb.style.display = 'block';
    if (userInfo) userInfo.style.display = 'block';
    if (userName && this.user) userName.textContent = this.user.name;

    // Trigger custom event for app initialization
    window.dispatchEvent(new CustomEvent('auth-success', { 
      detail: { user: this.user } 
    }));
  }

  onAuthFailure(error) {
    console.error('Authentication failed:', error);
    alert('Authentication failed. Please try again.');
  }

  getUser() {
    return this.user;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other modules
window.authManager = authManager;
