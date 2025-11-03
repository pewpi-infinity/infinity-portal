# Infinity Portal - Installation & Running Guide

## 🚀 Quick Start

### For Termux (Android)
```bash
# 1. Install dependencies
pkg install python -y
pip install flask flask-cors requests beautifulsoup4 lxml

# 2. Navigate to repository
cd ~/infinity-portal

# 3. Run the startup script
bash start_infinity.sh
```

### For Linux/Mac
```bash
# 1. Install dependencies
python3 -m pip install -r InfinityOS/requirements.txt

# 2. Run the startup script
./start_infinity.sh
```

### Manual Start
```bash
cd InfinityOS
python3 spa_server.py
```

## 📱 Access the Application

Once started, open your browser to:
**http://127.0.0.1:8080**

## 🎯 Features

### Single Page Application
- All features accessible from one URL
- No page reloads - smooth transitions
- Google OAuth integration
- Mobile-optimized design

### Portal Realm
- Calculator & Scientific Calculator
- Alarm Clock
- Bible Verse (Infinity style)
- Physical Therapy & Exercise tracker
- Pet Feed Schedule
- Gardening & Seed Swap

### Marketplace Realm
- Token-only eBay-like platform
- Clothing Design CAD
- Food/Textiles Trade Network
- Leather Craft marketplace
- Glass Packaging Registry
- Banned & Corrupt Products Ledger

### Social Realm
- Locals Chat (ZIP code based)
- Video Game Generator
- School (newborn to adult education)
- DIY Platform
- Channel Generator & Auditions

### Rogers AI
- Integrated AI chat assistant
- Web intelligence (DuckDuckGo, Wikipedia, Wikidata)
- OpenAI GPT integration (when API key provided)

### PayPal Bridge
- USD to Infinity token conversion
- Historical currency collection system

## 🔧 Configuration

### Google OAuth (Already Configured)
The application comes pre-configured with Google OAuth credentials:
- Client ID: `16937806382-leqbaginj3igrhei58nsab7tb4hsb435.apps.googleusercontent.com`
- API Key: `AIzaSyDWKRhBjFEt752zC86X0aQOvRQHxM5XPlc`

### OpenAI Integration (Already Configured)
Rogers AI includes OpenAI GPT integration with a service account key already configured in the code.

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## 🔄 Keeping Server Running (Background)

### Using nohup (Termux/Linux)
```bash
cd InfinityOS
nohup python3 spa_server.py > ../infinity.log 2>&1 &
```

### Using screen (if available)
```bash
screen -S infinity
cd InfinityOS
python3 spa_server.py
# Press Ctrl+A then D to detach
```

### Using tmux (if available)
```bash
tmux new -s infinity
cd InfinityOS
python3 spa_server.py
# Press Ctrl+B then D to detach
```

## 📝 Troubleshooting

### Port 8080 already in use
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9

# Or use a different port
PORT=8081 python3 spa_server.py
```

### Missing dependencies
```bash
pip install -r InfinityOS/requirements.txt
```

### Can't access from other devices
The server runs on `127.0.0.1` (localhost only). To access from other devices:

Edit `spa_server.py`, find the line:
```python
app.run(host="0.0.0.0", port=8080, debug=False)
```

Then restart the server and access via your device's IP address.

## 🌐 Structure

```
InfinityOS/
├── spa_server.py          # Main SPA server (run this!)
├── requirements.txt       # Python dependencies
├── portal/
│   └── rogers_paypal_demo.py
└── Rogers/
    ├── index.html
    ├── rogers_white.py
    └── rogers_white_nokeys.py
```

## 💡 Tips

- The application auto-saves your progress in browser localStorage
- Sign in with Google to access all features
- Earn Infinity tokens by interacting with the platform
- All marketplace transactions use tokens only (no USD)

## 📧 Contact

Email: infinitystockinvesting@gmail.com

---

**Powered by Infinity** • Token Economy • Rogers AI
