// 🧪 Chemistry Theme Portal Definition
// Airlock to molecular world

export const chemistryTheme = {
  id: 'chemistry',
  name: 'Chemistry Lab',
  emoji: '🧪',
  description: 'Airlock to molecular world',
  
  portal: {
    type: 'airlock',
    colors: ['#ff1493', '#9400d3', '#00ced1'],
    gradient: 'linear-gradient(135deg, #ff1493 0%, #9400d3 50%, #4b0082 100%)',
    border: '5px solid #ff1493',
    animation: 'molecule-spin'
  },
  
  particles: ['⚗️', '🧪', '🧬', '💧', '🔬'],
  
  effects: {
    entry: 'molecular-dissolve',
    ambient: ['bubble-rise', 'vapor-drift'],
    sound: 'bubbling.mp3'
  },
  
  links: [
    { title: 'Periodic Table', url: '#/arena/periodic-table' },
    { title: 'Reactions Database', url: '#/database/reactions' },
    { title: 'Lab Safety', url: '#/guide/safety' }
  ],
  
  arena: {
    layout: 'laboratory',
    zones: ['Wet Lab', 'Fume Hood', 'Storage', 'Analysis'],
    collectibles: ['elements', 'compounds', 'formulas']
  }
};
