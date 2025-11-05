/**
 * Shorts/Aura Zone Module
 * Create short-form content and visual experiences
 */

class ShortsZone {
  constructor() {
    this.id = 'shorts';
    this.name = 'Shorts/Aura';
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
        <h2>🎬 Shorts & Aura</h2>
        <p style="color: #666;">Create stunning short-form content</p>
      </div>

      <div style="max-width: 900px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="creation-card" onclick="shortsZone.createContent('video')">
            <div style="font-size: 48px; margin-bottom: 15px;">🎥</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Video Shorts</h3>
            <p style="color: #666; font-size: 14px;">Create engaging short videos with AI assistance</p>
          </div>
          <div class="creation-card" onclick="shortsZone.createContent('aura')">
            <div style="font-size: 48px; margin-bottom: 15px;">✨</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Aura Effects</h3>
            <p style="color: #666; font-size: 14px;">Generate stunning visual atmospheres and moods</p>
          </div>
          <div class="creation-card" onclick="shortsZone.createContent('story')">
            <div style="font-size: 48px; margin-bottom: 15px;">📖</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Story Slides</h3>
            <p style="color: #666; font-size: 14px;">Build compelling visual narratives</p>
          </div>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px;">
          <h3 style="margin-top: 0; color: #333;">Quick Tools</h3>
          <div style="display: grid; gap: 15px;">
            <div class="tool-item">
              <span style="font-size: 24px; margin-right: 15px;">🎨</span>
              <div style="flex: 1;">
                <strong>AI Style Transfer</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Apply artistic styles to your content</p>
              </div>
              <button class="tool-btn" onclick="shortsZone.useTool('style-transfer')">Use</button>
            </div>
            <div class="tool-item">
              <span style="font-size: 24px; margin-right: 15px;">🎵</span>
              <div style="flex: 1;">
                <strong>Auto Music Sync</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Match visuals to music beats automatically</p>
              </div>
              <button class="tool-btn" onclick="shortsZone.useTool('music-sync')">Use</button>
            </div>
            <div class="tool-item">
              <span style="font-size: 24px; margin-right: 15px;">💬</span>
              <div style="flex: 1;">
                <strong>Caption Generator</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">AI-powered captions and subtitles</p>
              </div>
              <button class="tool-btn" onclick="shortsZone.useTool('captions')">Use</button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .creation-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .creation-card:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }
        .tool-item {
          display: flex;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }
        .tool-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .tool-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      </style>
    `;
  }

  createContent(type) {
    console.log(`Creating ${type} content`);
    alert(`Opening ${type} creator...`);
  }

  useTool(tool) {
    console.log(`Using tool: ${tool}`);
    alert(`Launching ${tool} tool...`);
  }

  onEnter() {
    console.log('Entered Shorts zone');
  }

  onExit() {
    console.log('Exited Shorts zone');
  }
}

const shortsZone = new ShortsZone();
window.shortsZone = shortsZone;
