/**
 * News Zone Module
 * Science and technology news feed
 */

class NewsZone {
  constructor() {
    this.id = 'news';
    this.name = 'News';
    this.articles = this.getMockArticles();
    this.init();
  }

  init() {
    if (window.zoneManager) {
      window.zoneManager.registerZone(this);
    }
  }

  getMockArticles() {
    return [
      {
        title: 'Breakthrough in Quantum Computing',
        summary: 'Scientists achieve new milestone in quantum error correction',
        category: 'Technology',
        date: '2025-11-05',
        source: 'Tech Journal'
      },
      {
        title: 'AI Models Reach New Capabilities',
        summary: 'Latest generation of language models show unprecedented understanding',
        category: 'AI',
        date: '2025-11-04',
        source: 'AI Weekly'
      },
      {
        title: 'Space Telescope Discovers Exoplanets',
        summary: 'New observations reveal potentially habitable worlds',
        category: 'Space',
        date: '2025-11-03',
        source: 'Space News'
      },
      {
        title: 'Clean Energy Innovation',
        summary: 'Breakthrough in solar cell efficiency promises cheaper renewable energy',
        category: 'Energy',
        date: '2025-11-02',
        source: 'Science Daily'
      }
    ];
  }

  render(container) {
    container.innerHTML = `
      <button class="back-btn" onclick="window.appController.returnToVectorWeb()">← Back to Vector Web</button>
      
      <div class="zone-header">
        <h2>📰 News</h2>
        <p style="color: #666;">Latest in science and technology</p>
      </div>

      <div style="max-width: 800px; margin: 0 auto;">
        <div style="background: #f8f9fa; border-radius: 16px; padding: 20px; margin-bottom: 30px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="filter-btn active" onclick="newsZone.filterBy('all')">All</button>
          <button class="filter-btn" onclick="newsZone.filterBy('technology')">Technology</button>
          <button class="filter-btn" onclick="newsZone.filterBy('ai')">AI</button>
          <button class="filter-btn" onclick="newsZone.filterBy('space')">Space</button>
          <button class="filter-btn" onclick="newsZone.filterBy('energy')">Energy</button>
        </div>

        <div id="news-feed">
          ${this.articles.map(article => this.renderArticle(article)).join('')}
        </div>
      </div>

      <style>
        .filter-btn {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 20px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .filter-btn:hover, .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }
        .article-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .article-card:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }
        .article-meta {
          display: flex;
          gap: 15px;
          font-size: 13px;
          color: #999;
          margin-top: 10px;
        }
        .category-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
      </style>
    `;
  }

  // Helper to escape HTML special characters
  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
  }

  renderArticle(article) {
    const title = this.escapeHtml(article.title);
    const category = this.escapeHtml(article.category);
    const summary = this.escapeHtml(article.summary);
    const date = this.escapeHtml(article.date);
    const source = this.escapeHtml(article.source);
    return `
      <div class="article-card" onclick="newsZone.openArticle('${title}')">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <h3 style="margin: 0; color: #333;">${title}</h3>
          <span class="category-tag">${category}</span>
        </div>
        <p style="color: #666; margin: 15px 0; line-height: 1.6;">${summary}</p>
        <div class="article-meta">
          <span>📅 ${date}</span>
          <span>📰 ${source}</span>
        </div>
      </div>
    `;
  }

  filterBy(category) {
    console.log(`Filtering by: ${category}`);
    // Update UI to show active filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
  }

  openArticle(title) {
    console.log(`Opening article: ${title}`);
    alert(`Opening article: ${title}`);
  }

  onEnter() {
    console.log('Entered News zone');
  }

  onExit() {
    console.log('Exited News zone');
  }
}

const newsZone = new NewsZone();
window.newsZone = newsZone;
