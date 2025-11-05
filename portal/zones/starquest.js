/**
 * Star Quest Zone Module
 * Karaoke and talent showcase with AI feedback
 */

class StarQuestZone {
  constructor() {
    this.id = 'starquest';
    this.name = 'Star Quest';
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
        <h2>⭐ Star Quest</h2>
        <p style="color: #666;">Karaoke, talent showcase & AI coaching</p>
      </div>

      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 40px; color: white; margin-bottom: 30px; text-align: center;">
          <h3 style="margin: 0 0 15px 0; font-size: 32px;">🎤 Ready to Shine?</h3>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Sing, perform, and get instant AI feedback</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="mode-card" onclick="starquestZone.selectMode('solo')">
            <div style="font-size: 48px; margin-bottom: 15px;">🎙️</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Solo Performance</h3>
            <p style="color: #666; font-size: 14px;">Sing your favorite songs with AI accompaniment</p>
          </div>
          <div class="mode-card" onclick="starquestZone.selectMode('duet')">
            <div style="font-size: 48px; margin-bottom: 15px;">👥</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Duet Mode</h3>
            <p style="color: #666; font-size: 14px;">Perform with friends or AI partners</p>
          </div>
          <div class="mode-card" onclick="starquestZone.selectMode('talent')">
            <div style="font-size: 48px; margin-bottom: 15px;">🌟</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Talent Show</h3>
            <p style="color: #666; font-size: 14px;">Showcase any talent and get AI judging</p>
          </div>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">🎵 Popular Songs</h3>
          <div style="display: grid; gap: 15px;">
            ${this.renderSongList()}
          </div>
        </div>

        <div style="background: white; border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px;">
          <h3 style="margin-top: 0; color: #333;">🏆 Your Progress</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div class="stat-card">
              <div style="font-size: 36px; font-weight: bold; color: #667eea;">0</div>
              <div style="color: #666; margin-top: 5px;">Performances</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 36px; font-weight: bold; color: #764ba2;">0</div>
              <div style="color: #666; margin-top: 5px;">Stars Earned</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 36px; font-weight: bold; color: #f093fb;">0</div>
              <div style="color: #666; margin-top: 5px;">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .mode-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .mode-card:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }
        .song-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .song-item:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }
        .stat-card {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }
      </style>
    `;
  }

  renderSongList() {
    const songs = [
      { title: 'Bohemian Rhapsody', artist: 'Queen', difficulty: 'Hard' },
      { title: 'Shape of You', artist: 'Ed Sheeran', difficulty: 'Medium' },
      { title: 'Shallow', artist: 'Lady Gaga', difficulty: 'Medium' },
      { title: 'Imagine', artist: 'John Lennon', difficulty: 'Easy' }
    ];

    return songs.map(song => `
      <div class="song-item" onclick="starquestZone.selectSong('${song.title}')">
        <div>
          <strong style="color: #333;">${song.title}</strong>
          <div style="font-size: 14px; color: #666; margin-top: 3px;">${song.artist}</div>
        </div>
        <span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
          ${song.difficulty}
        </span>
      </div>
    `).join('');
  }

  selectMode(mode) {
    console.log(`Selected mode: ${mode}`);
    alert(`Starting ${mode} mode...`);
  }

  selectSong(title) {
    console.log(`Selected song: ${title}`);
    alert(`Loading ${title}... Get ready to perform!`);
  }

  onEnter() {
    console.log('Entered Star Quest zone');
  }

  onExit() {
    console.log('Exited Star Quest zone');
  }
}

const starquestZone = new StarQuestZone();
window.starquestZone = starquestZone;
