# Copilot Instructions for Infinity Portal

## Project Overview
This is the Infinity Portal project, a web-based platform that integrates AI services including:
- Watson Discovery and Natural Language Understanding APIs
- OpenAI ChatGPT integration
- Real-time chat interfaces
- Cloudflare Workers for distributed processing
- Audio/signal processing capabilities

## Technologies Used
- **Backend**: Python 3.11+ with Flask framework
- **Frontend**: HTML, CSS, JavaScript (vanilla JS)
- **Deployment**: Docker, Cloudflare Workers
- **AI Services**: IBM Watson (Discovery, NLU), OpenAI
- **Package Management**: pip for Python dependencies

## Code Style and Standards
- Use Python 3.11+ features and syntax
- Follow PEP 8 style guidelines for Python code
- Use modern JavaScript (ES6+) for frontend code
- Keep single-file workers self-contained for Cloudflare deployment
- Use secure file handling practices (werkzeug's secure_filename)
- Always validate and sanitize user inputs

## Project Structure
- `app.py`: Main Flask application with file upload and AI orchestration
- `*.html`: HTML pages with embedded CSS and JavaScript
- `*_worker.js`: Cloudflare Workers (single-file deployments)
- `requirements.txt`: Python dependencies
- `dockerfile`: Docker configuration
- Various SVG files for UI graphics

## Development Guidelines
1. **Security First**: Never commit API keys or secrets to the repository
2. **Environment Variables**: Use environment variables for sensitive data (API keys, URLs)
3. **Error Handling**: Always include proper try-catch/except blocks
4. **File Safety**: Use secure_filename for uploaded files
5. **Single-File Workers**: Keep Cloudflare Workers as standalone single files
6. **Minimal Dependencies**: Only add new dependencies if absolutely necessary

## Testing Approach
- Test Flask endpoints manually or with integration tests
- Validate HTML/JavaScript functionality in browser
- Test Workers in Cloudflare environment or with wrangler CLI
- Verify Docker builds complete successfully

## Deployment Notes
- Flask app can run locally or via Docker
- Cloudflare Workers are deployed individually
- Use environment variables for configuration across environments
- Default Flask port is 8080

## Common Tasks
- **Adding endpoints**: Follow the pattern in app.py with proper error handling
- **Creating workers**: Use single-file format with export default { async fetch() {} }
- **UI updates**: Modify HTML files with embedded styles and scripts
- **Dependencies**: Update requirements.txt and rebuild Docker image

## What to Avoid
- Don't hardcode API keys or credentials in code
- Don't break existing single-file worker structure
- Don't add unnecessary build complexity
- Don't commit new API keys or secrets (use .gitignore and environment variables)
- Don't introduce breaking changes to public APIs without discussion

## Security Note
Some API key files are already committed in the repository. For new development:
- Always use environment variables for API keys and secrets
- Never commit new apikey*.json files or similar sensitive data
- Refer to existing keys only via environment variables in code
