# Security Policy

## Current Implementation Status

This project is currently in **DEMO MODE** with the following security limitations:

### ⚠️ Known Security Limitations

#### 1. JWT Token Verification (CRITICAL)
- **Issue**: JWT tokens are decoded without signature verification in demo mode
- **Impact**: Allows potential token forgery
- **Location**: 
  - `rogers_core.py`: `verify_google_token()` function
  - `infinity_core_auth.js`: `decodeJWT()` method
- **Mitigation**: Set `PRODUCTION_MODE=true` environment variable to enable proper verification

#### 2. Secret Key Management
- **Issue**: Default secret key used if `SECRET_KEY` not set
- **Impact**: Sessions may be compromised
- **Location**: `rogers_core.py` line 30
- **Mitigation**: Set `SECRET_KEY` environment variable with a strong random value

#### 3. Calculator Code Injection
- **Issue**: Uses `eval()` for math expression evaluation
- **Impact**: Potential code injection despite input sanitization
- **Location**: `infinity_portal_with_google_auth.html`: `calcRun()` function
- **Mitigation**: Input is sanitized to only allow math operations. For production, use a proper math parser library like `math.js`

#### 4. In-Memory Storage
- **Issue**: All data stored in memory, lost on restart
- **Impact**: No persistence, no scalability
- **Location**: `rogers_core.py`: `AUTH_SESSIONS` and `REALM_DATA` dictionaries
- **Mitigation**: Implement database storage (PostgreSQL, MongoDB, Redis)

#### 5. CORS Configuration
- **Issue**: CORS enabled for all origins
- **Impact**: Potential CSRF attacks
- **Location**: `rogers_core.py` line 35
- **Mitigation**: Restrict CORS to specific trusted origins

## Production Security Checklist

Before deploying to production, ensure:

- [ ] Set `PRODUCTION_MODE=true` environment variable
- [ ] Set `GOOGLE_CLIENT_ID` environment variable with your Google OAuth client ID
- [ ] Set `SECRET_KEY` environment variable with a strong random value (use: `python -c "import secrets; print(secrets.token_hex(32))"`)
- [ ] Replace in-memory storage with a proper database
- [ ] Configure CORS to allow only trusted origins
- [ ] Implement rate limiting (use Flask-Limiter)
- [ ] Add request validation and sanitization
- [ ] Enable HTTPS/TLS for all connections
- [ ] Implement proper logging and monitoring
- [ ] Add session timeout and refresh mechanisms
- [ ] Implement CSRF protection
- [ ] Add input validation for all endpoints
- [ ] Use environment-specific configuration files
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Add security headers (use Flask-Talisman)

## Enabling Production Mode

### Environment Variables

```bash
# Required for production
export PRODUCTION_MODE=true
export SECRET_KEY="your-secret-key-here"
export GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# Optional
export PORT=8080
export DEBUG=false
```

### Production Token Verification

When `PRODUCTION_MODE=true`, the system will:
1. Use Google's official token verification library
2. Verify token signatures cryptographically
3. Validate token issuer
4. Check token expiration
5. Reject invalid tokens

### Installing Production Dependencies

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email: infinitystockinvesting@gmail.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

## Security Best Practices

### For Developers

1. **Never commit secrets**: Use environment variables or secret management services
2. **Validate all inputs**: Never trust user input
3. **Use parameterized queries**: Prevent SQL injection when adding database
4. **Implement proper authentication**: Always verify tokens server-side
5. **Use HTTPS**: Never transmit sensitive data over HTTP
6. **Keep dependencies updated**: Regularly update all packages
7. **Follow principle of least privilege**: Grant minimal necessary permissions

### For Deployment

1. **Use a production WSGI server**: Don't use Flask's development server (use Gunicorn, uWSGI)
2. **Set up a reverse proxy**: Use Nginx or Apache
3. **Enable firewall**: Only expose necessary ports
4. **Regular backups**: Implement automated backup strategy
5. **Monitor and log**: Set up proper logging and alerting
6. **Security updates**: Keep OS and packages updated

## Security Features

### Current Implementation

✓ Google OAuth 2.0 authentication  
✓ Session management  
✓ CORS support  
✓ Input sanitization  
✓ Secure file upload with filename sanitization  
✓ Environment-based configuration  

### Planned Enhancements

- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Request signing
- [ ] API key management
- [ ] Multi-factor authentication
- [ ] Audit logging
- [ ] Intrusion detection

## Compliance

This project is designed for educational and demo purposes. For production use in regulated environments:

- Implement data encryption at rest and in transit
- Add audit trails for all user actions
- Implement data retention policies
- Add user consent management
- Ensure GDPR/CCPA compliance if handling EU/CA user data

## Security Updates

Security updates will be released as needed. Check the repository for the latest version.

Last updated: 2025-11-02
