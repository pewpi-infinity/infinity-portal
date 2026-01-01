// 🌀 Portal Morpher - Real-time theme morphing system
// Transforms the portal appearance based on detected interests

class PortalMorpher {
  constructor(container) {
    this.container = container || document.body;
    this.currentTheme = null;
    this.morphing = false;
    this.portalElement = null;
    
    this.themeStyles = {
      mario: {
        colors: ['#00a800', '#00d800', '#78ff00'],
        portalType: 'warp-pipe',
        particles: ['🍄', '⭐', '🪙'],
        gradient: 'radial-gradient(circle, #00d800 0%, #00a800 50%, #006400 100%)',
        border: '8px solid #00a800',
        animation: 'warp-spin'
      },
      rock: {
        colors: ['#8b0000', '#ff0000', '#ff4500'],
        portalType: 'backstage',
        particles: ['🎸', '🎤', '🥁'],
        gradient: 'linear-gradient(45deg, #000000 0%, #8b0000 50%, #ff0000 100%)',
        border: '6px solid #ff0000',
        animation: 'rock-pulse'
      },
      electronics: {
        colors: ['#00ffff', '#0080ff', '#00ff00'],
        portalType: 'circuit-board',
        particles: ['⚡', '🔌', '💡'],
        gradient: 'radial-gradient(circle, #00ffff 0%, #0080ff 50%, #001a33 100%)',
        border: '4px solid #00ffff',
        animation: 'circuit-flow'
      },
      chemistry: {
        colors: ['#ff1493', '#9400d3', '#00ced1'],
        portalType: 'airlock',
        particles: ['⚗️', '🧪', '🧬'],
        gradient: 'linear-gradient(135deg, #ff1493 0%, #9400d3 50%, #4b0082 100%)',
        border: '5px solid #ff1493',
        animation: 'molecule-spin'
      },
      robotics: {
        colors: ['#c0c0c0', '#4169e1', '#ff6347'],
        portalType: 'factory-gate',
        particles: ['🤖', '⚙️', '🔧'],
        gradient: 'linear-gradient(180deg, #c0c0c0 0%, #4169e1 50%, #1e3a5f 100%)',
        border: '6px solid #c0c0c0',
        animation: 'mechanical-rotate'
      },
      math: {
        colors: ['#ffd700', '#ffa500', '#ff4500'],
        portalType: 'geometric',
        particles: ['📐', '∞', '∑'],
        gradient: 'conic-gradient(from 45deg, #ffd700, #ffa500, #ff4500, #ffd700)',
        border: '3px solid #ffd700',
        animation: 'geometric-morph'
      },
      physics: {
        colors: ['#9370db', '#4169e1', '#00ffff'],
        portalType: 'quantum-gateway',
        particles: ['⚛️', '🌊', '💫'],
        gradient: 'radial-gradient(ellipse, #9370db 0%, #4169e1 40%, #000033 100%)',
        border: '4px dashed #9370db',
        animation: 'quantum-flicker'
      },
      biology: {
        colors: ['#32cd32', '#00ff00', '#228b22'],
        portalType: 'dna-helix',
        particles: ['🧬', '🦠', '🌱'],
        gradient: 'linear-gradient(90deg, #32cd32 0%, #00ff00 50%, #228b22 100%)',
        border: '5px double #32cd32',
        animation: 'helix-twist'
      },
      art: {
        colors: ['#ff69b4', '#ffd700', '#00ced1', '#9370db'],
        portalType: 'canvas-portal',
        particles: ['🎨', '🖌️', '🌈'],
        gradient: 'linear-gradient(45deg, #ff69b4, #ffd700, #00ced1, #9370db)',
        border: '7px solid transparent',
        animation: 'color-splash'
      },
      music: {
        colors: ['#ff00ff', '#00ffff', '#ffff00'],
        portalType: 'sound-wave',
        particles: ['🎵', '🎶', '🎹'],
        gradient: 'repeating-linear-gradient(90deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #ff00ff 100%)',
        border: '5px solid #ff00ff',
        animation: 'wave-motion'
      },
      space: {
        colors: ['#000033', '#4169e1', '#ffffff'],
        portalType: 'cosmic-tunnel',
        particles: ['🚀', '🌟', '🌙'],
        gradient: 'radial-gradient(circle, #4169e1 0%, #000033 50%, #000000 100%)',
        border: '6px solid #4169e1',
        animation: 'cosmic-warp'
      }
    };

    this.initAnimations();
  }

  initAnimations() {
    // Create style element for animations if not exists
    if (!document.getElementById('portal-morpher-animations')) {
      const style = document.createElement('style');
      style.id = 'portal-morpher-animations';
      style.textContent = `
        @keyframes warp-spin {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(5deg); }
        }
        
        @keyframes rock-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.02); filter: brightness(1.2); }
        }
        
        @keyframes circuit-flow {
          0% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 255, 1); }
          100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
        }
        
        @keyframes molecule-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes mechanical-rotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(2deg) scale(1.01); }
          75% { transform: rotate(-2deg) scale(1.01); }
        }
        
        @keyframes geometric-morph {
          0%, 100% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
          50% { clip-path: polygon(50% 25%, 75% 50%, 50% 75%, 25% 50%); }
        }
        
        @keyframes quantum-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes helix-twist {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes color-splash {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
        }
        
        @keyframes wave-motion {
          0% { transform: translateX(0); }
          100% { transform: translateX(-10px); }
        }
        
        @keyframes cosmic-warp {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        
        .portal-morph-transition {
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        .portal-particle {
          position: absolute;
          pointer-events: none;
          font-size: 24px;
          animation: particle-float 3s ease-in-out infinite;
        }
        
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createPortal(theme) {
    if (!this.themeStyles[theme]) {
      console.warn(`Theme ${theme} not found`);
      return null;
    }

    const style = this.themeStyles[theme];
    const portal = document.createElement('div');
    portal.className = 'infinity-portal portal-morph-transition';
    portal.dataset.theme = theme;
    
    portal.style.cssText = `
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: ${style.gradient};
      border: ${style.border};
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: ${style.animation} 3s ease-in-out infinite;
      cursor: pointer;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
    `;

    // Add portal center
    const center = document.createElement('div');
    center.className = 'portal-center';
    center.style.cssText = `
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: white;
    `;
    
    const themeInfo = new InterestDetector().getThemeInfo(theme);
    if (themeInfo) {
      center.textContent = themeInfo.emoji;
    }
    
    portal.appendChild(center);

    // Add particles
    this.addParticles(portal, style.particles);

    return portal;
  }

  addParticles(container, particleEmojis) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'portal-particle';
      particle.textContent = particleEmojis[i % particleEmojis.length];
      
      const angle = (360 / particleCount) * i;
      const radius = 130;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      
      particle.style.cssText = `
        left: calc(50% + ${x}px);
        top: calc(50% + ${y}px);
        animation-delay: ${i * 0.2}s;
      `;
      
      container.appendChild(particle);
    }
  }

  morph(theme) {
    if (this.morphing) {
      console.log('Already morphing, please wait...');
      return;
    }

    if (!this.themeStyles[theme]) {
      console.warn(`Theme ${theme} not found`);
      return;
    }

    this.morphing = true;
    const oldTheme = this.currentTheme;

    // Fade out old portal if exists
    if (this.portalElement) {
      this.portalElement.style.opacity = '0';
      this.portalElement.style.transform = 'scale(0.5)';
      
      setTimeout(() => {
        if (this.portalElement && this.portalElement.parentNode) {
          this.portalElement.remove();
        }
        this.createAndShowPortal(theme);
      }, 800);
    } else {
      this.createAndShowPortal(theme);
    }

    this.currentTheme = theme;

    // Dispatch morph event
    const event = new CustomEvent('portal-morphed', {
      detail: { from: oldTheme, to: theme }
    });
    document.dispatchEvent(event);
  }

  createAndShowPortal(theme) {
    this.portalElement = this.createPortal(theme);
    this.portalElement.style.opacity = '0';
    this.portalElement.style.transform = 'scale(0.5)';
    this.container.appendChild(this.portalElement);

    // Trigger reflow
    this.portalElement.offsetHeight;

    // Fade in
    this.portalElement.style.opacity = '1';
    this.portalElement.style.transform = 'scale(1)';

    setTimeout(() => {
      this.morphing = false;
    }, 800);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getPortalElement() {
    return this.portalElement;
  }

  // Apply theme to entire page background
  applyThemeBackground(theme) {
    if (!this.themeStyles[theme]) return;
    
    const style = this.themeStyles[theme];
    document.body.style.background = style.gradient;
    document.body.style.transition = 'background 1s ease';
  }

  // Reset portal
  reset() {
    if (this.portalElement && this.portalElement.parentNode) {
      this.portalElement.remove();
    }
    this.portalElement = null;
    this.currentTheme = null;
    this.morphing = false;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortalMorpher;
}
