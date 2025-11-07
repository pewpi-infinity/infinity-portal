/**
 * Autopilot Zone Module
 * Modular LLM builder for creating custom AI agents
 */

class AutopilotZone {
  constructor() {
    this.id = 'autopilot';
    this.name = 'Autopilot';
    this.models = [];
    this.init();
  }

  init() {
    // Register this zone with the app, or defer registration if zoneManager is not yet available
    if (window.zoneManager) {
      window.zoneManager.registerZone(this);
    } else {
      window.pendingZones = window.pendingZones || [];
      window.pendingZones.push(this);
    }
  }

  render(container) {
    container.innerHTML = `
      <button class="back-btn" onclick="window.appController.returnToVectorWeb()">← Back to Vector Web</button>
      
      <div class="zone-header">
        <h2>🤖 Autopilot</h2>
        <p style="color: #666;">Build and customize your own AI agents</p>
      </div>

      <div style="max-width: 800px; margin: 0 auto;">
        <div style="background: #f8f9fa; border-radius: 16px; padding: 30px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">Modular LLM Builder</h3>
          <p style="color: #666; line-height: 1.6;">
            Create custom AI agents by combining different language models, prompts, and behaviors.
            Build agents for specific tasks, workflows, or creative applications.
          </p>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px; margin-bottom: 20px;">
          <h4 style="margin-top: 0; color: #333;">Quick Start Templates</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px;">
            <div class="template-card" onclick="autopilotZone.selectTemplate('assistant')">
              <div style="font-size: 32px; margin-bottom: 10px;">💬</div>
              <strong>Personal Assistant</strong>
              <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Helpful AI for daily tasks</p>
            </div>
            <div class="template-card" onclick="autopilotZone.selectTemplate('researcher')">
              <div style="font-size: 32px; margin-bottom: 10px;">🔬</div>
              <strong>Research Agent</strong>
              <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Deep analysis and insights</p>
            </div>
            <div class="template-card" onclick="autopilotZone.selectTemplate('creative')">
              <div style="font-size: 32px; margin-bottom: 10px;">🎨</div>
              <strong>Creative Writer</strong>
              <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Story and content creation</p>
            </div>
            <div class="template-card" onclick="autopilotZone.selectTemplate('custom')">
              <div style="font-size: 32px; margin-bottom: 10px;">⚙️</div>
              <strong>Custom Build</strong>
              <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Start from scratch</p>
            </div>
          </div>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px;">
          <h4 style="margin-top: 0; color: #333;">Available Models</h4>
          <div id="model-list" style="margin-top: 20px;">
            <div class="model-item">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Gemini Pro</strong>
                  <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Google's powerful general-purpose model</p>
                </div>
                <button class="action-btn" onclick="autopilotZone.selectModel('gemini-pro')">Select</button>
              </div>
            </div>
            <div class="model-item">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>GPT-4</strong>
                  <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Advanced reasoning and creativity</p>
                </div>
                <button class="action-btn" onclick="autopilotZone.selectModel('gpt-4')">Select</button>
              </div>
            </div>
            <div class="model-item">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Claude</strong>
                  <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Helpful, harmless, and honest AI</p>
                </div>
                <button class="action-btn" onclick="autopilotZone.selectModel('claude')">Select</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .template-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .template-card:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }
        .model-item {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        .model-item:last-child {
          border-bottom: none;
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
      </style>
    `;
  }

  selectTemplate(templateId) {
    console.log(`Selected template: ${templateId}`);
    alert(`Starting ${templateId} agent builder...`);
  }

  selectModel(modelId) {
    console.log(`Selected model: ${modelId}`);
    alert(`Model ${modelId} selected. Configure your agent settings to continue.`);
  }

  onEnter() {
    console.log('Entered Autopilot zone');
  }

  onExit() {
    console.log('Exited Autopilot zone');
  }
}

// Initialize the zone
const autopilotZone = new AutopilotZone();
window.autopilotZone = autopilotZone;
