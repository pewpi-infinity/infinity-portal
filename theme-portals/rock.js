// 🎸 Rock Theme Portal Definition
// Backstage entrance to music world

export const rockTheme = {
  id: 'rock',
  name: 'Rock Arena',
  emoji: '🎸',
  description: 'Backstage entrance to music world',
  
  portal: {
    type: 'backstage',
    colors: ['#8b0000', '#ff0000', '#ff4500'],
    gradient: 'linear-gradient(45deg, #000000 0%, #8b0000 50%, #ff0000 100%)',
    border: '6px solid #ff0000',
    animation: 'rock-pulse'
  },
  
  particles: ['🎸', '🎤', '🥁', '🎵', '⚡'],
  
  effects: {
    entry: 'stage-lights',
    ambient: ['crowd-wave', 'spotlight-sweep'],
    sound: 'guitar-riff.mp3'
  },
  
  links: [
    { title: 'Rock History', url: '#/arena/rock-history' },
    { title: 'Band Database', url: '#/database/bands' },
    { title: 'Guitar Tabs', url: '#/tools/guitar-tabs' }
  ],
  
  arena: {
    layout: 'stage',
    zones: ['Main Stage', 'Backstage', 'VIP', 'Mosh Pit'],
    collectibles: ['picks', 'setlists', 'merch']
  }
};
