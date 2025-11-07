/**
 * Live Zone Module
 * Real-time logs, streams, and monitoring
 */

class LiveZone {
  constructor() {
    this.id = 'live';
    this.name = 'Live';
    this.logs = [];
    this.init();
  }

  init() {
    if (window.zoneManager) {
      window.zoneManager.registerZone(this);
    }
    this.generateMockLogs();
  }

  generateMockLogs() {
    const logTypes = ['info', 'warning', 'error', 'success'];
    const messages = [
      'System initialized successfully',
      'User authentication completed',
      'API request processed',
      'Cache updated',
      'Database connection established',
      'New zone loaded',
      'AI query processed'
    ];

    for (let i = 0; i < 10; i++) {
      this.logs.push({
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        type: logTypes[Math.floor(Math.random() * logTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        source: 'System'
      });
    }
    
    this.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  render(container) {
    container.innerHTML = `
      <button class="back-btn" onclick="window.appController.returnToVectorWeb()">← Back to Vector Web</button>
      
      <div class="zone-header">
        <h2>📡 Live</h2>
        <p style="color: #666;">Real-time monitoring and streams</p>
      </div>

      <div style="max-width: 1000px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="metric-card">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Active Sessions</div>
            <div style="font-size: 32px; font-weight: bold; color: #667eea;">1</div>
          </div>
          <div class="metric-card">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">API Calls</div>
            <div style="font-size: 32px; font-weight: bold; color: #764ba2;">247</div>
          </div>
          <div class="metric-card">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Uptime</div>
            <div style="font-size: 32px; font-weight: bold; color: #43e97b;">99.9%</div>
          </div>
          <div class="metric-card">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Response Time</div>
            <div style="font-size: 32px; font-weight: bold; color: #4facfe;">24ms</div>
          </div>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #333;">📊 Activity Monitor</h3>
            <div style="display: flex; gap: 10px;">
              <button class="filter-btn" onclick="liveZone.filterLogs('all')">All</button>
              <button class="filter-btn" onclick="liveZone.filterLogs('error')">Errors</button>
              <button class="filter-btn" onclick="liveZone.filterLogs('warning')">Warnings</button>
            </div>
          </div>
          
          <div id="log-stream" style="background: #1a1a1a; border-radius: 12px; padding: 20px; max-height: 400px; overflow-y: auto; font-family: monospace;">
            ${this.renderLogs()}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 25px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">🔴 Live Streams</h4>
            <div class="stream-item">
              <span style="color: #ff4444;">●</span>
              <span>Main System Stream</span>
            </div>
            <div class="stream-item">
              <span style="color: #44ff44;">●</span>
              <span>AI Processing</span>
            </div>
            <div class="stream-item">
              <span style="color: #4444ff;">●</span>
              <span>User Activity</span>
            </div>
          </div>

          <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 25px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">⚙️ System Health</h4>
            <div class="health-item">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>CPU Usage</span>
                <span style="font-weight: 600;">23%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 23%; background: #43e97b;"></div>
              </div>
            </div>
            <div class="health-item">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Memory</span>
                <span style="font-weight: 600;">45%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 45%; background: #4facfe;"></div>
              </div>
            </div>
            <div class="health-item">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Storage</span>
                <span style="font-weight: 600;">67%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 67%; background: #f093fb;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .metric-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .filter-btn {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 6px 14px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .filter-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
        .log-entry {
          padding: 8px 0;
          border-bottom: 1px solid #333;
          color: #e0e0e0;
          font-size: 13px;
        }
        .log-entry:last-child {
          border-bottom: none;
        }
        .log-timestamp {
          color: #888;
          margin-right: 10px;
        }
        .log-type {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-right: 10px;
        }
        .stream-item {
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }
        .health-item {
          margin-bottom: 20px;
          font-size: 14px;
        }
        .health-item:last-child {
          margin-bottom: 0;
        }
        .progress-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      </style>
    `;
  }

  renderLogs() {
    return this.logs.map(log => {
      const typeColors = {
        info: '#4facfe',
        warning: '#f093fb',
        error: '#ff6b6b',
        success: '#43e97b'
      };
      
      const time = new Date(log.timestamp).toLocaleTimeString();
      return `
        <div class="log-entry">
          <span class="log-timestamp">[${time}]</span>
          <span class="log-type" style="background: ${typeColors[log.type]};">${log.type.toUpperCase()}</span>
          <span>${log.message}</span>
        </div>
      `;
    }).join('');
  }

  filterLogs(type) {
    console.log(`Filtering logs by: ${type}`);
  }

  onEnter() {
    console.log('Entered Live zone');
  }

  onExit() {
    console.log('Exited Live zone');
  }
}

const liveZone = new LiveZone();
window.liveZone = liveZone;
