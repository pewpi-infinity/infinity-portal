/**
 * Vector Web Module
 * Handles the animated vector web visualization and navigation
 */

class VectorWeb {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.links = [];
    this.animationFrame = null;
    this.centerX = 0;
    this.centerY = 0;
    this.time = 0;
    
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Create initial node network
    this.createNodeNetwork();
    
    // Start animation loop
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  createNodeNetwork() {
    // Get zones from AI manager
    const zones = window.aiManager ? window.aiManager.getZones() : {};
    const zoneIds = Object.keys(zones);
    
    // Clear existing nodes
    this.nodes = [];
    this.links = [];

    // Create nodes in a circular pattern around the center
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
    const angleStep = (Math.PI * 2) / zoneIds.length;

    zoneIds.forEach((zoneId, index) => {
      const angle = angleStep * index;
      const x = this.centerX + Math.cos(angle) * radius;
      const y = this.centerY + Math.sin(angle) * radius;
      
      this.nodes.push({
        id: zoneId,
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        radius: 40,
        color: this.getZoneColor(index),
        label: zones[zoneId]?.name || zoneId,
        visible: false,
        opacity: 0,
        pulse: 0
      });
    });

    // Create links between nodes
    this.nodes.forEach((node, i) => {
      // Connect to adjacent nodes
      const nextIndex = (i + 1) % this.nodes.length;
      this.links.push({
        from: i,
        to: nextIndex,
        opacity: 0
      });
    });

    // Gradually reveal nodes
    this.revealNodes();
  }

  getZoneColor(index) {
    const colors = [
      '#667eea', // Purple-blue
      '#764ba2', // Purple
      '#f093fb', // Pink
      '#4facfe', // Blue
      '#00f2fe', // Cyan
      '#43e97b', // Green
    ];
    return colors[index % colors.length];
  }

  revealNodes() {
    this.nodes.forEach((node, index) => {
      setTimeout(() => {
        node.visible = true;
      }, index * 200);
    });
  }

  animate() {
    this.time += 0.01;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw links
    this.drawLinks();
    
    // Update and draw nodes
    this.updateNodes();
    this.drawNodes();
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  drawLinks() {
    this.links.forEach(link => {
      const fromNode = this.nodes[link.from];
      const toNode = this.nodes[link.to];
      
      if (fromNode.visible && toNode.visible) {
        // Gradually increase link opacity
        link.opacity = Math.min(link.opacity + 0.02, 0.15);
        
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.strokeStyle = `rgba(102, 126, 234, ${link.opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    });
  }

  updateNodes() {
    this.nodes.forEach(node => {
      if (node.visible) {
        // Fade in
        node.opacity = Math.min(node.opacity + 0.05, 1);
        
        // Pulse animation
        node.pulse = Math.sin(this.time * 2) * 5;
        
        // Smooth movement towards target
        node.x += (node.targetX - node.x) * 0.1;
        node.y += (node.targetY - node.y) * 0.1;
      }
    });
  }

  drawNodes() {
    this.nodes.forEach(node => {
      if (node.opacity > 0) {
        const currentRadius = node.radius + node.pulse;
        
        // Draw glow
        const gradient = this.ctx.createRadialGradient(
          node.x, node.y, currentRadius * 0.5,
          node.x, node.y, currentRadius * 1.5
        );
        gradient.addColorStop(0, `${node.color}40`);
        gradient.addColorStop(1, `${node.color}00`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, currentRadius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw node circle
        this.ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.95})`;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = node.color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw label
        this.ctx.fillStyle = `rgba(51, 51, 51, ${node.opacity})`;
        this.ctx.font = '600 14px system-ui';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.label, node.x, node.y);
      }
    });
  }

  getNodeAt(x, y) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.radius && node.visible) {
        return node;
      }
    }
    return null;
  }

  highlightNode(nodeId) {
    this.nodes.forEach(node => {
      if (node.id === nodeId) {
        node.targetX = this.centerX;
        node.targetY = this.centerY;
        node.radius = 60;
      } else {
        node.opacity = 0.3;
      }
    });
  }

  resetNodes() {
    this.nodes.forEach((node, index) => {
      const zones = window.aiManager ? window.aiManager.getZones() : {};
      const zoneIds = Object.keys(zones);
      const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
      const angleStep = (Math.PI * 2) / zoneIds.length;
      const angle = angleStep * index;
      
      node.targetX = this.centerX + Math.cos(angle) * radius;
      node.targetY = this.centerY + Math.sin(angle) * radius;
      node.radius = 40;
      node.opacity = 1;
    });
  }

  transitionToZone(zoneId, callback) {
    // Animate corridor transition
    const targetNode = this.nodes.find(n => n.id === zoneId);
    if (!targetNode) return;

    // Zoom animation
    let zoomProgress = 0;
    const zoomInterval = setInterval(() => {
      zoomProgress += 0.05;
      
      this.nodes.forEach(node => {
        if (node.id === zoneId) {
          node.radius = 40 + (60 * zoomProgress);
          node.opacity = 1 - (zoomProgress * 0.7);
        } else {
          node.opacity = 1 - zoomProgress;
        }
      });

      if (zoomProgress >= 1) {
        clearInterval(zoomInterval);
        if (callback) callback();
      }
    }, 16);
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Export for use in other modules
window.VectorWeb = VectorWeb;
