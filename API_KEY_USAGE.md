# How to Use Your OpenAI API Key Securely

This guide shows you how to use your own OpenAI API key with this application securely.

## ⚠️ NEVER Do This

```javascript
// ❌ WRONG - Never create bookmarklets with hardcoded keys
javascript:setOpenAIKey('sk-your-real-key-here')

// ❌ WRONG - Never hardcode keys in your code
const apiKey = 'sk-your-real-key-here';

// ❌ WRONG - Never commit keys to repositories
// apikey.json containing real keys
```

## ✅ Correct Methods

### Method 1: Browser Console (Recommended for Testing)

1. Open the application in your web browser
2. Press F12 to open Developer Tools
3. Click on the "Console" tab
4. Type the following command and press Enter:

```javascript
setOpenAIKey('YOUR_OPENAI_API_KEY_HERE')
```

5. Your key will be saved in your browser's localStorage
6. The key persists across sessions but only on your device

### Method 2: Application UI (If Available)

Some versions of the application may have a UI field to enter your API key directly. Use that if available.

### Method 3: Environment Variables (For Developers)

If you're running the application locally or on a server:

1. Create a `.env` file (this is git-ignored by default):
```dotenv
OPENAI_API_KEY=your_key_here
```

2. Use environment variable loaders in your application code:
```javascript
const apiKey = process.env.OPENAI_API_KEY;
```

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key immediately (you won't be able to see it again)
6. Store it securely using one of the methods above

## Security Best Practices

- ✅ Keep your API key private
- ✅ Never share your key with others
- ✅ Never post your key in public forums or chat
- ✅ Rotate your keys regularly
- ✅ Monitor your API usage on OpenAI's dashboard
- ✅ Use separate keys for development and production
- ❌ Never commit keys to git
- ❌ Never include keys in bookmarklets or URIs
- ❌ Never hardcode keys in source code

## Troubleshooting

### Key Not Working?

1. Check that you copied the entire key
2. Verify the key hasn't been revoked at https://platform.openai.com/api-keys
3. Check that you have API credits available
4. Check browser console for error messages

### Key Got Exposed?

If your API key was accidentally exposed:

1. **Immediately revoke it** at https://platform.openai.com/api-keys
2. Generate a new key
3. Update your application with the new key
4. Review usage logs for unauthorized access
5. See `SECURITY.md` for more details

## Questions?

For more information about security, see `SECURITY.md` in this repository.
