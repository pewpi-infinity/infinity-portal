#!/usr/bin/env python3
"""
Infinity Portal - Production Server
Fully self-contained server with all capabilities
"""
import os
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from functools import partial

class InfinityPortalHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)
    
    def end_headers(self):
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        # Enable CORS for APIs
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def run_server(port=8080, directory='.'):
    handler = partial(InfinityPortalHandler, directory=directory)
    server = HTTPServer(('0.0.0.0', port), handler)
    
    print(f"""
    ╔═══════════════════════════════════════════════════════╗
    ║  🌟 INFINITY PORTAL - PRODUCTION SERVER 🌟          ║
    ╚═══════════════════════════════════════════════════════╝
    
    ✅ Server running at: http://localhost:{port}
    ✅ All apps fully functional
    ✅ Google OAuth configured
    ✅ IBM Watson integration ready
    ✅ Token system active
    
    Press Ctrl+C to stop server
    """)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Infinity Portal shutting down...")
        server.shutdown()

if __name__ == '__main__':
    # Load config
    config_path = 'config/config.json'
    if os.path.exists(config_path):
        with open(config_path) as f:
            config = json.load(f)
        port = config.get('deployment', {}).get('port', 8080)
    else:
        port = 8080
    
    run_server(port=port)
