// 🍄 Mario Theme Portal Definition
// Warp pipe entrance to gaming realm

export const marioTheme = {
  id: 'mario',
  name: 'Mario World',
  emoji: '🍄',
  description: 'Warp pipe entrance to gaming realm',
  
  portal: {
    type: 'warp-pipe',
    colors: ['#00a800', '#00d800', '#78ff00'],
    gradient: 'radial-gradient(circle, #00d800 0%, #00a800 50%, #006400 100%)',
    border: '8px solid #00a800',
    animation: 'warp-spin'
  },
  
  particles: ['🍄', '⭐', '🪙', '🎮', '👾'],
  
  effects: {
    entry: 'pipe-warp',
    ambient: ['mushroom-float', 'coin-sparkle'],
    sound: 'warp-pipe.mp3'
  },
  
  links: [
    { title: 'Super Mario Wiki', url: 'https://www.mariowiki.com/' },
    { title: 'Mario Games', url: '#/arena/mario-games' },
    { title: 'Power-ups Guide', url: '#/guide/mario-powerups' }
  ],
  
  arena: {
    layout: 'platform',
    zones: ['World 1-1', 'Castle', 'Underground', 'Sky'],
    collectibles: ['coins', 'stars', 'mushrooms']
  }
};
