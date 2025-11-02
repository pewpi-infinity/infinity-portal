# Infinity Portal

A web-based portal application with AI integration capabilities.

## 🔒 Security

**IMPORTANT**: This repository implements strict security measures for API key management. Please review the following documents before contributing:

- **[SECURITY.md](SECURITY.md)** - Security policy and best practices
- **[API_KEY_USAGE.md](API_KEY_USAGE.md)** - How to securely use API keys
- **[INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md)** - Recent security incident details

### Key Security Rules

- ❌ **NEVER** hardcode API keys in source code
- ❌ **NEVER** commit API keys to the repository
- ❌ **NEVER** share API keys in bookmarklets or URIs
- ✅ **ALWAYS** use environment variables for server-side keys
- ✅ **ALWAYS** use localStorage for client-side keys (user-provided only)
- ✅ **ALWAYS** review SECURITY.md before making changes

### Quick Start - Secure API Key Setup

For client-side usage:
```javascript
// Open browser console (F12) and run:
setOpenAIKey('your-api-key-here')
```

For server-side usage:
```bash
# Create .env file (git-ignored)
export OPENAI_API_KEY=your-api-key-here
export DISCOVERY_API_KEY=your-watson-key-here
export NLU_API_KEY=your-nlu-key-here
```

See [API_KEY_USAGE.md](API_KEY_USAGE.md) for detailed instructions.

## Installation

### Prerequisites

- Python 3.7+
- Flask
- IBM Watson SDK (optional)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/pewpi-infinity/infinity-portal.git
cd infinity-portal
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables (see `.env.example`):
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Run the application:
```bash
python app.py
```

## Usage

Open `index.html` or the specific HTML file you want to use in a web browser.

For AI features, you'll need to provide your own API keys using the secure methods described in [API_KEY_USAGE.md](API_KEY_USAGE.md).

## Development

### Security Scanning

This repository uses automated security scanning:
- GitHub Secret Scanning
- TruffleHog (in CI/CD)
- Gitleaks (in CI/CD)

### Pre-commit Hooks (Optional)

Install the pre-commit hook to check for API key leaks before committing:

```bash
cp .git-hooks/pre-commit.example .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Contributing

1. Read [SECURITY.md](SECURITY.md) before making changes
2. Never commit API keys or secrets
3. Use environment variables for sensitive data
4. Follow existing code style
5. Test your changes before submitting PR

## Security Incidents

If you discover a security vulnerability:
1. Do NOT create a public issue
2. Contact the maintainers privately
3. See [SECURITY.md](SECURITY.md) for reporting instructions

## License

[Add your license here]

## Support

For questions or issues:
- Review existing documentation
- Check [SECURITY.md](SECURITY.md) for security questions
- Open an issue (for non-security topics only)
