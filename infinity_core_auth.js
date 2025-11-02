/**
 * Infinity Core Authentication Module (Rogers)
 * Handles Google OAuth and distributes auth state to all realms
 */

class InfinityCoreAuth {
  constructor(config = {}) {
    this.clientId = config.clientId || '';
    this.redirectUri = config.redirectUri || window.location.origin;
    this.scopes = config.scopes || ['openid', 'email', 'profile'];
    this.storageKey = 'INFINITY_CORE_AUTH';
    this.listeners = [];
  }

  /**
   * Initialize Google OAuth
   */
  async initGoogleAuth() {
    if (typeof google === 'undefined' || !google.accounts) {
      console.warn('Google Identity Services not loaded');
      return false;
    }

    // Initialize Google Identity Services
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response) => this.handleGoogleCallback(response),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    return true;
  }

  /**
   * Handle Google OAuth callback
   */
  handleGoogleCallback(response) {
    if (!response.credential) {
      console.error('No credential in Google response');
      return;
    }

    // Decode JWT token (basic parsing without verification for demo)
    const payload = this.decodeJWT(response.credential);
    
    const authData = {
      provider: 'google',
      token: response.credential,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      },
      timestamp: Date.now()
    };

    this.saveAuth(authData);
    this.notifyListeners('login', authData);
  }

  /**
   * Decode JWT token (simple base64 decode, no verification)
   */
  decodeJWT(token) {
    try {
      const parts = token.split('.');
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return {};
    }
  }

  /**
   * Show Google Sign-In prompt
   */
  signInWithGoogle() {
    if (typeof google === 'undefined' || !google.accounts) {
      // Fallback to OAuth 2.0 flow
      this.signInWithOAuth2();
      return;
    }

    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Try One Tap with custom UI
        this.renderGoogleButton();
      }
    });
  }

  /**
   * Render Google Sign-In button
   */
  renderGoogleButton(elementId = 'googleSignInButton') {
    const element = document.getElementById(elementId);
    if (!element || typeof google === 'undefined') {
      this.signInWithOAuth2();
      return;
    }

    google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular'
    });
  }

  /**
   * Fallback OAuth 2.0 flow (without Google Identity Services)
   */
  signInWithOAuth2() {
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'token id_token',
      scope: this.scopes.join(' '),
      nonce: this.generateNonce(),
      state: this.generateState()
    });

    window.location.href = `${authUrl}?${params.toString()}`;
  }

  /**
   * Handle OAuth redirect callback
   */
  handleOAuthRedirect() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');
    
    if (idToken) {
      const payload = this.decodeJWT(idToken);
      const authData = {
        provider: 'google',
        token: idToken,
        accessToken: accessToken,
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        },
        timestamp: Date.now()
      };

      this.saveAuth(authData);
      this.notifyListeners('login', authData);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  /**
   * Sign out
   */
  signOut() {
    const auth = this.getAuth();
    this.clearAuth();
    this.notifyListeners('logout', auth);
    
    // Sign out from Google
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
  }

  /**
   * Save authentication data
   */
  saveAuth(authData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(authData));
    } catch (e) {
      console.error('Failed to save auth:', e);
    }
  }

  /**
   * Get authentication data
   */
  getAuth() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get auth:', e);
      return null;
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.error('Failed to clear auth:', e);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const auth = this.getAuth();
    if (!auth || !auth.timestamp) return false;
    
    // Check if token is expired (1 hour default)
    const expiryTime = 60 * 60 * 1000; // 1 hour
    return (Date.now() - auth.timestamp) < expiryTime;
  }

  /**
   * Get current user
   */
  getUser() {
    const auth = this.getAuth();
    return auth ? auth.user : null;
  }

  /**
   * Add auth state listener
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove auth state listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (e) {
        console.error('Listener error:', e);
      }
    });
  }

  /**
   * Generate random nonce
   */
  generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate random state
   */
  generateState() {
    return this.generateNonce();
  }

  /**
   * Initialize and check for OAuth redirect
   */
  async initialize() {
    // Check for OAuth redirect
    if (window.location.hash.includes('id_token')) {
      this.handleOAuthRedirect();
    }

    // Initialize Google Auth
    await this.initGoogleAuth();
    
    return this.isAuthenticated();
  }
}

// Create singleton instance
const infinityCoreAuth = new InfinityCoreAuth({
  clientId: '', // Will be set by configuration
  redirectUri: window.location.origin
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = infinityCoreAuth;
}
