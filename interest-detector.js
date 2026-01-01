// 🔍 Interest Detector - Detects user interests on portal arrival
// Part of the Infinity Portal multi-theme gateway system

class InterestDetector {
  constructor() {
    this.interests = [];
    this.detectedTheme = null;
    this.keywords = {
      mario: ['game', 'mario', 'mushroom', 'warp', 'nintendo', 'platform', 'jump', '🍄'],
      rock: ['rock', 'music', 'guitar', 'band', 'concert', 'metal', 'backstage', '🎸'],
      electronics: ['circuit', 'electronic', 'arduino', 'led', 'sensor', 'transistor', 'pcb', '🔌'],
      chemistry: ['chemistry', 'molecule', 'reaction', 'lab', 'compound', 'element', 'atomic', '🧪'],
      robotics: ['robot', 'automation', 'mechanical', 'servo', 'motor', 'assembly', 'factory', '🤖'],
      math: ['math', 'equation', 'geometry', 'algebra', 'calculus', 'formula', 'theorem', '📐'],
      physics: ['physics', 'quantum', 'energy', 'force', 'particle', 'wave', 'relativity', '⚛️'],
      biology: ['biology', 'cell', 'dna', 'gene', 'organism', 'evolution', 'life', '🧬'],
      art: ['art', 'paint', 'canvas', 'design', 'creative', 'color', 'visual', '🎨'],
      music: ['music', 'sound', 'note', 'melody', 'harmony', 'audio', 'compose', '🎵'],
      space: ['space', 'rocket', 'planet', 'star', 'cosmos', 'astronomy', 'galaxy', '🚀']
    };
  }

  // Detect interests from various sources
  detectFromStorage() {
    const storedInterests = localStorage.getItem('pewpi_interests');
    if (storedInterests) {
      try {
        this.interests = JSON.parse(storedInterests);
        return this.interests;
      } catch (e) {
        console.warn('Failed to parse stored interests:', e);
      }
    }
    return [];
  }

  detectFromURL() {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme');
    const interest = params.get('interest');
    
    if (theme && this.keywords[theme]) {
      return theme;
    }
    
    if (interest) {
      return this.detectFromText(interest);
    }
    
    return null;
  }

  detectFromText(text) {
    if (!text) return null;
    
    const lowerText = text.toLowerCase();
    const scores = {};
    
    // Score each theme based on keyword matches
    for (const [theme, keywords] of Object.entries(this.keywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          score++;
        }
      }
      if (score > 0) {
        scores[theme] = score;
      }
    }
    
    // Return theme with highest score
    if (Object.keys(scores).length > 0) {
      return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    }
    
    return null;
  }

  detectFromTime() {
    // Time-based theme suggestions
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 9) return 'chemistry'; // Morning lab work
    if (hour >= 9 && hour < 12) return 'electronics'; // Morning tech work
    if (hour >= 12 && hour < 14) return 'art'; // Afternoon creativity
    if (hour >= 14 && hour < 17) return 'robotics'; // Afternoon building
    if (hour >= 17 && hour < 20) return 'rock'; // Evening entertainment
    if (hour >= 20 && hour < 23) return 'space'; // Night exploration
    return 'mario'; // Late night gaming
  }

  detectFromUserAgent() {
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mario'; // Mobile users might enjoy gaming
    }
    
    if (ua.includes('linux')) {
      return 'electronics'; // Linux users often into tech
    }
    
    return null;
  }

  detectFromReferrer() {
    const referrer = document.referrer.toLowerCase();
    
    if (referrer.includes('github')) return 'electronics';
    if (referrer.includes('youtube')) return 'music';
    if (referrer.includes('reddit')) return 'rock';
    if (referrer.includes('stackoverflow')) return 'math';
    if (referrer.includes('wikipedia')) return 'physics';
    
    return null;
  }

  // Main detection logic - combines all methods
  detect() {
    // Priority order:
    // 1. URL parameters (explicit user choice)
    // 2. Stored interests (returning user)
    // 3. Referrer (where they came from)
    // 4. User agent (device/platform)
    // 5. Time of day (contextual)
    
    let detected = this.detectFromURL();
    if (detected) {
      this.detectedTheme = detected;
      this.saveInterest(detected);
      return detected;
    }
    
    const storedInterests = this.detectFromStorage();
    if (storedInterests.length > 0) {
      detected = storedInterests[storedInterests.length - 1]; // Most recent
      this.detectedTheme = detected;
      return detected;
    }
    
    detected = this.detectFromReferrer();
    if (detected) {
      this.detectedTheme = detected;
      this.saveInterest(detected);
      return detected;
    }
    
    detected = this.detectFromUserAgent();
    if (detected) {
      this.detectedTheme = detected;
      this.saveInterest(detected);
      return detected;
    }
    
    // Fallback to time-based
    detected = this.detectFromTime();
    this.detectedTheme = detected;
    return detected;
  }

  saveInterest(theme) {
    if (!this.interests.includes(theme)) {
      this.interests.push(theme);
    }
    
    // Keep only last 10 interests
    if (this.interests.length > 10) {
      this.interests.shift();
    }
    
    try {
      localStorage.setItem('pewpi_interests', JSON.stringify(this.interests));
    } catch (e) {
      console.warn('Failed to save interests:', e);
    }
  }

  getAllInterests() {
    return this.interests;
  }

  getDetectedTheme() {
    return this.detectedTheme || this.detect();
  }

  // Manually set a theme interest
  setInterest(theme) {
    if (this.keywords[theme]) {
      this.detectedTheme = theme;
      this.saveInterest(theme);
      return true;
    }
    return false;
  }

  // Get all available themes
  getAvailableThemes() {
    return Object.keys(this.keywords);
  }

  // Get theme metadata
  getThemeInfo(theme) {
    const info = {
      mario: { name: 'Mario World', emoji: '🍄', description: 'Warp pipe entrance to gaming realm' },
      rock: { name: 'Rock Arena', emoji: '🎸', description: 'Backstage entrance to music world' },
      electronics: { name: 'Electronics Lab', emoji: '🔌', description: 'Lab door to circuits and tech' },
      chemistry: { name: 'Chemistry Lab', emoji: '🧪', description: 'Airlock to molecular world' },
      robotics: { name: 'Robotics Factory', emoji: '🤖', description: 'Factory gate to automation' },
      math: { name: 'Mathematics Realm', emoji: '📐', description: 'Geometric portal to equations' },
      physics: { name: 'Physics Field', emoji: '⚛️', description: 'Quantum gateway to forces' },
      biology: { name: 'Biology Center', emoji: '🧬', description: 'DNA helix to life sciences' },
      art: { name: 'Art Studio', emoji: '🎨', description: 'Canvas portal to creativity' },
      music: { name: 'Music Studio', emoji: '🎵', description: 'Sound wave portal to melodies' },
      space: { name: 'Space Station', emoji: '🚀', description: 'Cosmic tunnel to the stars' }
    };
    return info[theme] || null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InterestDetector;
}
