// 🎬 Gateway Animations - Visual effects for portal transitions
// MRW Terminal Integration: Characters, Cars, Mushrooms, Joystick navigation

class GatewayAnimations {
  constructor() {
    this.activeAnimations = new Set();
    this.mrwElements = {
      characters: [],
      cars: [],
      mushrooms: []
    };
    this.joystickActive = false;
    this.initStyles();
  }

  initStyles() {
    if (!document.getElementById('gateway-animations-styles')) {
      const style = document.createElement('style');
      style.id = 'gateway-animations-styles';
      style.textContent = `
        /* MRW Terminal Characters */
        .mrw-character {
          position: absolute;
          font-size: 32px;
          animation: character-walk 4s linear infinite;
          z-index: 100;
          pointer-events: none;
        }
        
        @keyframes character-walk {
          0% { transform: translateX(-100px) scaleX(-1); }
          50% { transform: translateX(calc(50vw - 16px)) scaleX(-1); }
          51% { transform: translateX(calc(50vw - 16px)) scaleX(1); }
          100% { transform: translateX(calc(100vw + 100px)) scaleX(1); }
        }
        
        /* MRW Cars */
        .mrw-car {
          position: absolute;
          font-size: 48px;
          animation: car-drive 6s linear infinite;
          z-index: 95;
          pointer-events: none;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        
        @keyframes car-drive {
          0% { transform: translateX(-150px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 150px)); opacity: 0; }
        }
        
        /* Floating Mushrooms */
        .mrw-mushroom {
          position: absolute;
          font-size: 28px;
          animation: mushroom-float 5s ease-in-out infinite;
          z-index: 90;
          pointer-events: none;
        }
        
        @keyframes mushroom-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.8;
          }
          25% { 
            transform: translateY(-30px) rotate(10deg); 
            opacity: 1;
          }
          50% { 
            transform: translateY(-50px) rotate(-5deg); 
            opacity: 0.9;
          }
          75% { 
            transform: translateY(-30px) rotate(5deg); 
            opacity: 1;
          }
        }
        
        /* Joystick Navigation */
        .joystick-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 120px;
          height: 120px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          touch-action: none;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255, 255, 255, 0.3);
        }
        
        .joystick-handle {
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, #00ff00, #00aa00);
          border-radius: 50%;
          cursor: grab;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 255, 0, 0.5);
          transition: transform 0.1s ease;
        }
        
        .joystick-handle:active {
          cursor: grabbing;
          transform: scale(0.95);
        }
        
        .joystick-direction {
          position: absolute;
          font-size: 20px;
          color: white;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .joystick-direction.up { top: 5px; left: 50%; transform: translateX(-50%); }
        .joystick-direction.down { bottom: 5px; left: 50%; transform: translateX(-50%); }
        .joystick-direction.left { left: 5px; top: 50%; transform: translateY(-50%); }
        .joystick-direction.right { right: 5px; top: 50%; transform: translateY(-50%); }
        
        /* Gateway transition effects */
        .gateway-transition {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1000;
        }
        
        .gateway-ripple {
          position: absolute;
          border: 3px solid currentColor;
          border-radius: 50%;
          animation: ripple-expand 1.5s ease-out forwards;
          pointer-events: none;
        }
        
        @keyframes ripple-expand {
          0% { 
            width: 0; 
            height: 0; 
            opacity: 1; 
          }
          100% { 
            width: 200vmax; 
            height: 200vmax; 
            opacity: 0; 
          }
        }
        
        .gateway-particles {
          position: absolute;
          font-size: 20px;
          animation: particle-burst 1s ease-out forwards;
          pointer-events: none;
        }
        
        @keyframes particle-burst {
          0% { 
            transform: translate(0, 0) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translate(var(--tx), var(--ty)) scale(0); 
            opacity: 0; 
          }
        }
        
        /* Energy collection animation */
        .energy-collect {
          position: absolute;
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
          animation: energy-rise 1s ease-out forwards;
          pointer-events: none;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        }
        
        @keyframes energy-rise {
          0% { 
            transform: translateY(0) scale(0.5); 
            opacity: 0; 
          }
          20% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(-100px) scale(1.5); 
            opacity: 0; 
          }
        }
        
        /* Portal entrance animation */
        .portal-entrance {
          animation: portal-zoom 1.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }
        
        @keyframes portal-zoom {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.5); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(10); 
            opacity: 0; 
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // MRW Terminal: Add walking characters
  addCharacter(emoji = '🚶', startY = '50%') {
    const character = document.createElement('div');
    character.className = 'mrw-character';
    character.textContent = emoji;
    character.style.top = startY;
    character.style.left = '-100px';
    
    document.body.appendChild(character);
    this.mrwElements.characters.push(character);
    
    // Remove after animation
    setTimeout(() => {
      character.remove();
      const index = this.mrwElements.characters.indexOf(character);
      if (index > -1) {
        this.mrwElements.characters.splice(index, 1);
      }
    }, 4000);
    
    return character;
  }

  // MRW Terminal: Add driving car
  addCar(emoji = '🚗', startY = '60%') {
    const car = document.createElement('div');
    car.className = 'mrw-car';
    car.textContent = emoji;
    car.style.top = startY;
    car.style.left = '-150px';
    
    document.body.appendChild(car);
    this.mrwElements.cars.push(car);
    
    // Remove after animation
    setTimeout(() => {
      car.remove();
      const index = this.mrwElements.cars.indexOf(car);
      if (index > -1) {
        this.mrwElements.cars.splice(index, 1);
      }
    }, 6000);
    
    return car;
  }

  // MRW Terminal: Add floating mushroom
  addMushroom(x = '50%', y = '30%') {
    const mushroom = document.createElement('div');
    mushroom.className = 'mrw-mushroom';
    mushroom.textContent = '🍄';
    mushroom.style.left = x;
    mushroom.style.top = y;
    mushroom.style.animationDelay = `${Math.random() * 2}s`;
    
    document.body.appendChild(mushroom);
    this.mrwElements.mushrooms.push(mushroom);
    
    return mushroom;
  }

  // Remove all mushrooms
  clearMushrooms() {
    this.mrwElements.mushrooms.forEach(m => m.remove());
    this.mrwElements.mushrooms = [];
  }

  // MRW Terminal: Create joystick navigation
  createJoystick(onMove) {
    if (this.joystickActive) return;
    
    const container = document.createElement('div');
    container.className = 'joystick-container';
    container.innerHTML = `
      <div class="joystick-direction up">▲</div>
      <div class="joystick-direction down">▼</div>
      <div class="joystick-direction left">◄</div>
      <div class="joystick-direction right">►</div>
      <div class="joystick-handle"></div>
    `;
    
    const handle = container.querySelector('.joystick-handle');
    let isDragging = false;
    let startX, startY;
    
    const handleStart = (e) => {
      isDragging = true;
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
    };
    
    const handleMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const touch = e.touches ? e.touches[0] : e;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // Limit movement to container
      const maxMove = 35;
      const limitedX = Math.max(-maxMove, Math.min(maxMove, deltaX));
      const limitedY = Math.max(-maxMove, Math.min(maxMove, deltaY));
      
      handle.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
      
      // Determine direction
      const threshold = 10;
      let direction = null;
      if (Math.abs(limitedX) > Math.abs(limitedY)) {
        direction = limitedX > threshold ? 'right' : limitedX < -threshold ? 'left' : null;
      } else {
        direction = limitedY > threshold ? 'down' : limitedY < -threshold ? 'up' : null;
      }
      
      if (direction && onMove) {
        onMove(direction, { x: limitedX, y: limitedY });
      }
    };
    
    const handleEnd = () => {
      isDragging = false;
      handle.style.transform = 'translate(0, 0)';
    };
    
    handle.addEventListener('mousedown', handleStart);
    handle.addEventListener('touchstart', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
    
    document.body.appendChild(container);
    this.joystickActive = true;
    
    return container;
  }

  // Gateway transition effect
  playGatewayTransition(x, y, color = '#00ff00') {
    const overlay = document.createElement('div');
    overlay.className = 'gateway-transition';
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'gateway-ripple';
    ripple.style.color = color;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.marginLeft = '-100vmax';
    ripple.style.marginTop = '-100vmax';
    
    overlay.appendChild(ripple);
    document.body.appendChild(overlay);
    
    // Add particle burst
    this.createParticleBurst(x, y, ['✨', '⭐', '💫', '🌟']);
    
    setTimeout(() => overlay.remove(), 1500);
  }

  // Create particle burst effect
  createParticleBurst(x, y, particles) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'gateway-particles';
      particle.textContent = particles[i % particles.length];
      
      const angle = (360 / count) * i;
      const distance = 150;
      const tx = Math.cos(angle * Math.PI / 180) * distance;
      const ty = Math.sin(angle * Math.PI / 180) * distance;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }

  // Show energy collection animation
  showEnergyCollect(x, y, amount = '+10') {
    const energy = document.createElement('div');
    energy.className = 'energy-collect';
    energy.textContent = amount;
    energy.style.left = `${x}px`;
    energy.style.top = `${y}px`;
    
    document.body.appendChild(energy);
    
    setTimeout(() => energy.remove(), 1000);
  }

  // Portal entrance animation
  animatePortalEntrance(portalElement) {
    if (!portalElement) return;
    
    portalElement.classList.add('portal-entrance');
    
    // Play sound effect (if available)
    this.playSound('portal-enter');
    
    setTimeout(() => {
      portalElement.classList.remove('portal-entrance');
    }, 1500);
  }

  // Start continuous MRW effects for a theme
  startMRWEffects(theme) {
    // Add periodic characters and cars
    const characterInterval = setInterval(() => {
      if (theme === 'mario') {
        this.addCharacter('🚶‍♂️', `${30 + Math.random() * 40}%`);
      } else if (theme === 'rock') {
        this.addCharacter('🎸', `${30 + Math.random() * 40}%`);
      } else {
        this.addCharacter('🚶', `${30 + Math.random() * 40}%`);
      }
    }, 3000);
    
    const carInterval = setInterval(() => {
      const cars = ['🚗', '🚙', '🚕', '🏎️'];
      this.addCar(cars[Math.floor(Math.random() * cars.length)], `${50 + Math.random() * 20}%`);
    }, 5000);
    
    // Add mushrooms for Mario theme
    if (theme === 'mario') {
      for (let i = 0; i < 5; i++) {
        this.addMushroom(`${20 + i * 15}%`, `${20 + Math.random() * 40}%`);
      }
    }
    
    this.activeAnimations.add(characterInterval);
    this.activeAnimations.add(carInterval);
    
    return { characterInterval, carInterval };
  }

  // Stop all MRW effects
  stopMRWEffects() {
    this.activeAnimations.forEach(interval => clearInterval(interval));
    this.activeAnimations.clear();
    this.clearMushrooms();
  }

  // Play sound (placeholder for future implementation)
  playSound(soundName) {
    // Future: implement Web Audio API sounds
    console.log(`Playing sound: ${soundName}`);
  }

  // Cleanup
  destroy() {
    this.stopMRWEffects();
    this.mrwElements.characters.forEach(c => c.remove());
    this.mrwElements.cars.forEach(c => c.remove());
    this.clearMushrooms();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GatewayAnimations;
}
