/**
 * Main Application Controller
 * Orchestrates the entire Infinity Portal experience
 */

class AppController {
  constructor() {
    this.vectorWeb = null;
    this.initialized = false;
    this.currentZoneView = null;
  }

  init() {
    if (this.initialized) return;

    // Zone manager is already created in index.html

    // Wait for authentication
    window.addEventListener('auth-success', () => {
      this.onAuthSuccess();
    });

    // Setup AI interface
    this.setupAIInterface();

    // Setup canvas click handlers
    this.setupCanvasInteraction();

    this.initialized = true;
  }

  onAuthSuccess() {
    // Initialize vector web visualization
    this.vectorWeb = new VectorWeb('canvas-layer');

    console.log('App initialized successfully');
  }

  setupAIInterface() {
    const aiInput = document.getElementById('ai-input');
    const aiSubmit = document.getElementById('ai-submit');

    const handleSubmit = async () => {
      const query = aiInput.value.trim();
      if (!query) return;

      console.log('User query:', query);
      
      // Show loading state
      aiSubmit.textContent = '...';
      aiSubmit.disabled = true;

      try {
        // Query AI
        const response = await window.aiManager.query(query);
        
        console.log('AI response:', response);

        // Handle navigation if suggested
        if (response.navigation) {
          this.navigateToZone(response.navigation.zone);
        } else {
          // Show response (in a real app, would show in a chat interface)
          alert(response.text);
        }
      } catch (error) {
        console.error('AI query failed:', error);
        let userMessage = 'Sorry, I encountered an error. Please try again.';
        if (error) {
          if (error.message) {
            if (error.message.includes('Network')) {
              userMessage = 'Network error: Please check your internet connection and try again.';
            } else if (error.message.includes('Authentication') || error.message.includes('401')) {
              userMessage = 'Authentication error: Please log in again.';
            } else if (error.message.includes('rate limit') || error.message.includes('429')) {
              userMessage = 'Rate limit exceeded: Please wait a moment before trying again.';
            } else {
              userMessage = `Error: ${error.message}`;
            }
          }
        }
        alert(userMessage);
      } finally {
        // Reset input
        aiInput.value = '';
        aiSubmit.textContent = 'Send';
        aiSubmit.disabled = false;
      }
    };

    if (aiSubmit) {
      aiSubmit.addEventListener('click', handleSubmit);
    }

    if (aiInput) {
      aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });
    }
  }

  setupCanvasInteraction() {
    const canvas = document.getElementById('canvas-layer');
    if (!canvas) return;

    canvas.addEventListener('click', (e) => {
      if (!this.vectorWeb) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const node = this.vectorWeb.getNodeAt(x, y);
      if (node) {
        console.log('Clicked node:', node.id);
        this.navigateToZone(node.id);
      }
    });

    // Hover effect
    canvas.addEventListener('mousemove', (e) => {
      if (!this.vectorWeb) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const node = this.vectorWeb.getNodeAt(x, y);
      canvas.style.cursor = node ? 'pointer' : 'default';
    });
  }

  navigateToZone(zoneId) {
    console.log(`Navigating to zone: ${zoneId}`);

    if (!this.vectorWeb || !window.zoneManager) {
      console.error('App not fully initialized');
      return;
    }

    // Transition animation
    this.vectorWeb.transitionToZone(zoneId, () => {
      // Hide vector web canvas
      const canvas = document.getElementById('canvas-layer');
      const backBtn = document.getElementById('back-btn');
      
      if (canvas) canvas.style.display = 'none';
      if (backBtn) backBtn.style.display = 'block';

      // Create or get zone view
      let zoneView = document.getElementById(`zone-${zoneId}`);
      if (!zoneView) {
        zoneView = document.createElement('div');
        zoneView.id = `zone-${zoneId}`;
        zoneView.className = 'zone-view';
        document.getElementById('zone-container').appendChild(zoneView);
      }

      // Enter the zone
      window.zoneManager.enterZone(zoneId, zoneView);
      zoneView.classList.add('active');
      this.currentZoneView = zoneView;
    });
  }

  returnToVectorWeb() {
    console.log('Returning to vector web');

    // Exit current zone
    if (window.zoneManager) {
      window.zoneManager.exitCurrentZone();
    }

    // Hide zone view
    if (this.currentZoneView) {
      this.currentZoneView.classList.remove('active');
      this.currentZoneView = null;
    }

    // Show vector web
    const canvas = document.getElementById('canvas-layer');
    const backBtn = document.getElementById('back-btn');
    
    if (canvas) canvas.style.display = 'block';
    if (backBtn) backBtn.style.display = 'none';

    // Reset vector web nodes
    if (this.vectorWeb) {
      this.vectorWeb.resetNodes();
    }
  }
}

// Initialize app controller
const appController = new AppController();
window.appController = appController;

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    appController.init();
  });
} else {
  appController.init();
}
