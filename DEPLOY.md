# Infinity Portal - Deployment Guide

## 🚀 Quick Deploy (Worldwide Access)

### Option 1: Auto-Deploy Script (Recommended)
```bash
chmod +x auto-deploy.sh
./auto-deploy.sh
```
**This will:**
- ✅ Start server automatically
- ✅ Keep running in background
- ✅ Create systemd service for permanent deployment
- ✅ Make portal accessible worldwide on port 8080

### Option 2: Cloud Platform Deployment

#### Deploy to Vercel (Fastest - 1 Click)
1. Go to https://vercel.com
2. Connect your GitHub repo: `pewpi-infinity/infinity-portal`
3. Select branch: `copilot/design-locals-chat-app-again`
4. Click "Deploy"
5. ✅ Live in 30 seconds at: `https://your-project.vercel.app`

#### Deploy to Netlify (Easiest)
1. Go to https://netlify.com
2. Drag & drop the `infinity-portal-complete` folder
3. ✅ Instant deployment
4. Custom domain available

#### Deploy to Railway (Backend Support)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select `pewpi-infinity/infinity-portal`
4. ✅ Automatic HTTPS, custom domains

#### Deploy to Google Cloud Run (Scalable)
```bash
cd infinity-portal-complete
gcloud run deploy infinity-portal \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Deploy to AWS (Production)
```bash
# Using Elastic Beanstalk
cd infinity-portal-complete
eb init -p python-3.11 infinity-portal
eb create infinity-portal-prod
eb deploy
```

### Option 3: Keep Running Locally (Background)

The `auto-deploy.sh` script already does this, but manually:

```bash
cd infinity-portal-complete
nohup python3 server.py > /tmp/infinity.log 2>&1 &
```

Server will keep running even if you close terminal.

## 🌍 Making It Accessible Worldwide

### Current Status
- ✅ Server runs on port 8080
- ✅ Accessible locally at http://localhost:8080

### For Public Access

**1. Using ngrok (Instant Public URL)**
```bash
# Install ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Run (get free token from ngrok.com)
ngrok config add-authtoken YOUR_TOKEN
ngrok http 8080
```
You'll get a public URL like: `https://abc123.ngrok.io`

**2. Using Cloudflare Tunnel (Free, Permanent)**
```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Create tunnel
cloudflared tunnel login
cloudflared tunnel create infinity-portal
cloudflared tunnel route dns infinity-portal your-domain.com
cloudflared tunnel run infinity-portal
```

**3. Port Forwarding (If you own the network)**
- Forward port 8080 to your public IP
- Access via: `http://YOUR_PUBLIC_IP:8080`

## ✅ Verification

After deployment, verify:
```bash
# Check if server is running
ps aux | grep server.py

# Check logs
tail -f /tmp/infinity-portal.log

# Test locally
curl http://localhost:8080

# Test remotely (replace with your domain)
curl https://your-domain.com
```

## 🔄 Auto-Restart on Reboot

The `auto-deploy.sh` script creates a systemd service. To enable:

```bash
sudo cp /tmp/infinity-portal.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable infinity-portal
sudo systemctl start infinity-portal
```

Now portal will:
- ✅ Start automatically on boot
- ✅ Restart if it crashes
- ✅ Run continuously 24/7

## 📊 Monitoring

Check status:
```bash
# If using systemd
sudo systemctl status infinity-portal

# If using manual deployment
ps aux | grep server.py
tail -f /tmp/infinity-portal.log
```

## 🎉 Success Indicators

Portal is LIVE when you see:
- ✅ Server running at: http://localhost:8080
- ✅ All apps fully functional
- ✅ Voice UI operational
- ✅ Badge system working
- ✅ Token economy active

## 💡 Notes

- No configuration needed - everything works out of the box
- No API keys to replace - all integrated
- Scales automatically on cloud platforms
- Free tier available on most platforms

**Powered by Infinity** • infinitystockinvesting@gmail.com
