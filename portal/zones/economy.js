/**
 * Economy Zone Module
 * Dashboard for economic metrics and analytics
 */

class EconomyZone {
  constructor() {
    this.id = 'economy';
    this.name = 'Economy';
    this.init();
  }

  init() {
    if (window.zoneManager) {
      window.zoneManager.registerZone(this);
    }
  }

  render(container) {
    container.innerHTML = `
      <button class="back-btn" onclick="window.appController.returnToVectorWeb()">← Back to Vector Web</button>
      
      <div class="zone-header">
        <h2>💰 Economy</h2>
        <p style="color: #666;">Analytics and metrics dashboard</p>
      </div>

      <div style="max-width: 1000px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="eco-stat-card" style="border-left: 4px solid #667eea;">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Total Revenue</div>
            <div style="font-size: 32px; font-weight: bold; color: #333;">$0</div>
            <div style="font-size: 12px; color: #43e97b; margin-top: 5px;">↗ +0% this month</div>
          </div>
          <div class="eco-stat-card" style="border-left: 4px solid #764ba2;">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Active Users</div>
            <div style="font-size: 32px; font-weight: bold; color: #333;">1</div>
            <div style="font-size: 12px; color: #43e97b; margin-top: 5px;">↗ New user</div>
          </div>
          <div class="eco-stat-card" style="border-left: 4px solid #f093fb;">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Transactions</div>
            <div style="font-size: 32px; font-weight: bold; color: #333;">0</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">No change</div>
          </div>
          <div class="eco-stat-card" style="border-left: 4px solid #43e97b;">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Growth Rate</div>
            <div style="font-size: 32px; font-weight: bold; color: #333;">0%</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">Month over month</div>
          </div>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 20px 0; color: #333;">📈 Performance Overview</h3>
          <div style="height: 250px; background: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #666;">
            Chart Visualization Area
            <br/>
            <span style="font-size: 12px;">(Revenue trends over time)</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
          <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 25px;">
            <h4 style="margin: 0 0 20px 0; color: #333;">💳 Recent Transactions</h4>
            <div style="color: #999; text-align: center; padding: 40px 20px;">
              No transactions yet
            </div>
          </div>

          <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 25px;">
            <h4 style="margin: 0 0 20px 0; color: #333;">🎯 Top Zones</h4>
            <div style="display: grid; gap: 15px;">
              ${this.renderTopZones()}
            </div>
          </div>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px;">
          <h3 style="margin: 0 0 20px 0; color: #333;">⚙️ Settings & Tools</h3>
          <div style="display: grid; gap: 15px;">
            <div class="tool-row">
              <div style="flex: 1;">
                <strong>Export Data</strong>
                <div style="font-size: 14px; color: #666; margin-top: 5px;">Download analytics reports</div>
              </div>
              <button class="action-btn" onclick="economyZone.exportData()">Export</button>
            </div>
            <div class="tool-row">
              <div style="flex: 1;">
                <strong>API Access</strong>
                <div style="font-size: 14px; color: #666; margin-top: 5px;">Manage API keys and integrations</div>
              </div>
              <button class="action-btn" onclick="economyZone.manageAPI()">Manage</button>
            </div>
            <div class="tool-row">
              <div style="flex: 1;">
                <strong>Billing</strong>
                <div style="font-size: 14px; color: #666; margin-top: 5px;">View invoices and payment methods</div>
              </div>
              <button class="action-btn" onclick="economyZone.viewBilling()">View</button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .eco-stat-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
        }
        .tool-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }
        .action-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .zone-rank {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }
      </style>
    `;
  }

  renderTopZones() {
    const zones = [
      { name: 'Autopilot', visits: 0, color: '#667eea' },
      { name: 'News', visits: 0, color: '#764ba2' },
      { name: 'Star Quest', visits: 0, color: '#f093fb' }
    ];

    return zones.map(zone => `
      <div class="zone-rank">
        <div>
          <span style="width: 8px; height: 8px; background: ${zone.color}; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
          <strong>${zone.name}</strong>
        </div>
        <span style="color: #666;">${zone.visits} visits</span>
      </div>
    `).join('');
  }

  exportData() {
    console.log('Exporting data...');
    alert('Preparing analytics export...');
  }

  manageAPI() {
    console.log('Managing API...');
    alert('Opening API management...');
  }

  viewBilling() {
    console.log('Viewing billing...');
    alert('Opening billing dashboard...');
  }

  onEnter() {
    console.log('Entered Economy zone');
  }

  onExit() {
    console.log('Exited Economy zone');
  }
}

const economyZone = new EconomyZone();
window.economyZone = economyZone;
