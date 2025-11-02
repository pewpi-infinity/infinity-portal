# URGENT: API Key Exposure Incident

## Date: 2025-11-02

## Issue
A javascript: URI containing a hardcoded OpenAI service account API key was exposed:

```
javascript:setOpenAIKey('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')
```

## Immediate Actions Required

### 1. ✅ Code Changes (Completed)
- [x] Added SECURITY.md with security best practices
- [x] Added .gitignore to prevent future key commits
- [x] Enhanced setOpenAIKey function with security warnings
- [x] Added validation for service account keys
- [x] Added security documentation in code

### 2. ⚠️ Key Revocation (REQUIRED - Manual Action)

**The exposed API key MUST be revoked immediately by the key owner.**

Steps to revoke the key:
1. Go to https://platform.openai.com/api-keys
2. Find the service account key `sk-svcacct-6HCwiLwx589zapEXnoK8x8ZTkpGNDjKoFRrnHVOMsfVKe...`
3. Click "Revoke" or "Delete"
4. Generate a new key if needed
5. Update any applications using the old key with the new key (via secure methods)

### 3. ⚠️ Usage Audit (RECOMMENDED)

Check the API usage logs for the exposed key:
1. Go to https://platform.openai.com/usage
2. Filter by the compromised key's date range
3. Look for any suspicious or unauthorized usage
4. Review billing for unexpected charges

### 4. ⚠️ Communication (If Applicable)

If the key was shared publicly or with others:
- Notify relevant parties that the key has been revoked
- Provide them with secure methods to obtain a new key
- Do NOT share new keys via insecure channels

## Root Cause

The `setOpenAIKey()` function is designed to allow users to set their own API keys locally. However, someone created a bookmarklet or shared a javascript: URI with a hardcoded service account key, which is a critical security violation.

## Prevention Measures Implemented

1. **Client-side validation**: The `setOpenAIKey()` function now warns users when they attempt to use service account keys
2. **Security documentation**: Created SECURITY.md with comprehensive security guidelines
3. **Git ignore rules**: Added .gitignore to prevent accidental commits of keys
4. **Code comments**: Added security warnings in the code itself

## Security Best Practices Going Forward

- ✅ Never hardcode API keys in source code
- ✅ Never share API keys in bookmarklets, URIs, or public messages
- ✅ Use environment variables or secure configuration for server-side keys
- ✅ Use localStorage for client-side keys (user-provided only)
- ✅ Rotate keys regularly
- ✅ Use least-privilege principles for API keys
- ✅ Monitor API usage for anomalies

## Related Files

- `SECURITY.md` - Comprehensive security policy and best practices
- `.gitignore` - Prevents accidental key commits
- `infinity-all-in-one.live.capture.rogers.html` - Enhanced with security validation

## Questions?

For security-related questions, see SECURITY.md or contact the repository maintainers.

---

**Note**: This incident response document should be kept for reference and can be removed once the incident is fully resolved and the key has been confirmed as revoked.
