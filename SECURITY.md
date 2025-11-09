# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by creating a private security advisory or contacting the maintainers directly. Do not create public issues for security vulnerabilities.

## API Key Security

### ⚠️ CRITICAL: Never Hardcode API Keys

**DO NOT** share or create bookmarklets, URIs, or code snippets containing real API keys. Examples of what NOT to do:

```javascript
// ❌ NEVER DO THIS
javascript:setOpenAIKey('sk-...')  // Never hardcode keys in URIs
const apiKey = 'sk-...';            // Never hardcode keys in code
```

### ✅ Secure API Key Management

1. **Use Environment Variables**: Store API keys in environment variables or secure configuration files
2. **Use Local Storage**: For browser applications, prompt users to enter their own keys, which are stored in localStorage
3. **Never Commit Keys**: Add `*.key`, `*.secret`, `apikey*.json` to `.gitignore`
4. **Rotate Keys Regularly**: Periodically rotate API keys and revoke old ones
5. **Use Service-Specific Keys**: Create separate API keys for different services/environments
6. **Monitor Usage**: Regularly check API key usage for anomalies

### Setting Your API Key Securely

To use this application with your own OpenAI API key:

1. Open the application in your browser
2. Open the browser console (F12)
3. Run: `setOpenAIKey('your-api-key-here')`
4. Your key is stored locally in your browser only

**Alternative**: Enter your key directly in the application UI if provided.

### If Your Key is Compromised

If an API key has been exposed:

1. **Immediately revoke the key** via [OpenAI's API Keys page](https://platform.openai.com/api-keys)
2. **Generate a new key** for your application
3. **Review usage logs** to check for unauthorized access
4. **Update all instances** where the old key was used

## Service Account Keys

Service account keys (starting with `sk-svcacct-`) are especially sensitive as they often have elevated permissions. Never share or hardcode these keys anywhere.

## Best Practices

- ✅ Keep API keys out of version control
- ✅ Use environment-specific keys (dev, staging, prod)
- ✅ Limit key permissions to minimum required
- ✅ Enable rate limiting and usage monitoring
- ✅ Regularly audit key usage and rotate keys
- ❌ Never hardcode keys in source code
- ❌ Never share keys in chat, email, or public forums
- ❌ Never commit keys to git repositories
- ❌ Never include keys in bookmarklets or javascript: URIs

## Automated Security Scanning

This repository may use automated security scanning to detect exposed secrets. If a key is detected:

1. The commit will be flagged
2. The key should be immediately revoked
3. The commit history should be cleaned (contact maintainers for help)

## Questions?

If you have questions about security practices, please open a discussion or contact the maintainers.
