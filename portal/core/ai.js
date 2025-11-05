/**
 * AI Interface Module
 * Handles Gemini API integration for AI-driven navigation and suggestions
 */

const AI_CONFIG = {
  apiKey: 'AIzaSyDWKRhBjFEt752zC86X0aQOvRQHxM5XPlc',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};

class AIManager {
  constructor() {
    this.conversationHistory = [];
    this.currentContext = null;
    this.zones = {};
    this.init();
  }

  init() {
    // Register available zones
    this.registerZone('autopilot', {
      name: 'Autopilot',
      description: 'Modular LLM builder for creating custom AI agents',
      keywords: ['llm', 'ai', 'build', 'create', 'agent', 'model']
    });

    this.registerZone('news', {
      name: 'News',
      description: 'Science and technology news feed',
      keywords: ['news', 'science', 'tech', 'technology', 'updates', 'feed']
    });

    this.registerZone('shorts', {
      name: 'Shorts/Aura',
      description: 'Create short-form content and visual experiences',
      keywords: ['shorts', 'video', 'aura', 'create', 'content', 'media']
    });

    this.registerZone('starquest', {
      name: 'Star Quest',
      description: 'Karaoke and talent showcase with AI feedback',
      keywords: ['karaoke', 'sing', 'music', 'talent', 'perform', 'duet']
    });

    this.registerZone('live', {
      name: 'Live',
      description: 'Real-time logs, streams, and monitoring',
      keywords: ['live', 'logs', 'stream', 'monitor', 'watch', 'real-time']
    });

    this.registerZone('economy', {
      name: 'Economy',
      description: 'Dashboard for economic metrics and analytics',
      keywords: ['economy', 'finance', 'metrics', 'dashboard', 'analytics', 'stats']
    });
  }

  registerZone(id, metadata) {
    this.zones[id] = metadata;
  }

  async query(userInput, context = null) {
    this.currentContext = context;
    
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userInput }]
    });

    try {
      // Prepare system context about available zones
      const systemPrompt = this.buildSystemPrompt();
      
      // Call Gemini API
      const response = await this.callGeminiAPI(systemPrompt, userInput);
      
      // Add AI response to history
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: response }]
      });

      // Process response for zone navigation
      const navigationAction = this.extractNavigationAction(response, userInput);

      return {
        text: response,
        navigation: navigationAction,
        suggestions: this.generateSuggestions(response)
      };
    } catch (error) {
      console.error('AI query error:', error);
      return {
        text: 'I apologize, but I encountered an error. Please try again.',
        navigation: null,
        suggestions: []
      };
    }
  }

  buildSystemPrompt() {
    const zoneList = Object.entries(this.zones)
      .map(([id, meta]) => `- ${meta.name}: ${meta.description}`)
      .join('\n');

    return `You are the AI assistant for Infinity Portal, an immersive vector web interface. 
Available zones/apps:
${zoneList}

Your role is to help users navigate and discover these zones. When users ask about capabilities or want to do something:
1. Suggest relevant zones
2. Provide helpful information
3. Guide them through the interface naturally

Keep responses concise and friendly. If a user wants to access a specific zone, indicate it clearly.`;
  }

  async callGeminiAPI(systemPrompt, userInput) {
    try {
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt + '\n\nUser: ' + userInput }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };

      const response = await fetch(`${AI_CONFIG.apiUrl}?key=${AI_CONFIG.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback to local processing
      return this.fallbackResponse(userInput);
    }
  }

  fallbackResponse(userInput) {
    const input = userInput.toLowerCase();
    
    // Simple keyword matching for offline fallback
    for (const [zoneId, zoneMeta] of Object.entries(this.zones)) {
      for (const keyword of zoneMeta.keywords) {
        if (input.includes(keyword)) {
          return `It sounds like you're interested in ${zoneMeta.name}. ${zoneMeta.description}. Would you like to navigate there?`;
        }
      }
    }

    return "I can help you explore various zones like Autopilot, News, Shorts, Star Quest, Live streams, and Economy dashboard. What would you like to explore?";
  }

  extractNavigationAction(aiResponse, userInput) {
    const responseLower = aiResponse.toLowerCase();
    const inputLower = userInput.toLowerCase();
    
    // Check if user wants to navigate to a specific zone
    for (const [zoneId, zoneMeta] of Object.entries(this.zones)) {
      const zoneNameLower = zoneMeta.name.toLowerCase();
      
      // Check in both user input and AI response
      if (inputLower.includes(zoneNameLower) || 
          inputLower.includes(zoneId) ||
          responseLower.includes(`navigate to ${zoneNameLower}`) ||
          responseLower.includes(`open ${zoneNameLower}`) ||
          responseLower.includes(`go to ${zoneNameLower}`)) {
        
        return {
          type: 'navigate',
          zone: zoneId,
          zoneName: zoneMeta.name
        };
      }
    }

    // Check for keywords in user input
    for (const [zoneId, zoneMeta] of Object.entries(this.zones)) {
      for (const keyword of zoneMeta.keywords) {
        if (inputLower.includes(keyword) && 
            (inputLower.includes('open') || 
             inputLower.includes('show') || 
             inputLower.includes('go to') ||
             inputLower.includes('navigate'))) {
          return {
            type: 'navigate',
            zone: zoneId,
            zoneName: zoneMeta.name
          };
        }
      }
    }

    return null;
  }

  generateSuggestions(response) {
    const suggestions = [];
    const responseLower = response.toLowerCase();
    
    // Generate suggestions based on mentioned zones
    for (const [zoneId, zoneMeta] of Object.entries(this.zones)) {
      if (responseLower.includes(zoneMeta.name.toLowerCase())) {
        suggestions.push({
          text: `Explore ${zoneMeta.name}`,
          action: 'navigate',
          zone: zoneId
        });
      }
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getZones() {
    return this.zones;
  }
}

// Initialize AI manager
const aiManager = new AIManager();

// Export for use in other modules
window.aiManager = aiManager;
