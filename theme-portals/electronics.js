// 🔌 Electronics Theme Portal Definition
// Lab door to circuits and technology

export const electronicsTheme = {
  id: 'electronics',
  name: 'Electronics Lab',
  emoji: '🔌',
  description: 'Lab door to circuits and technology',
  
  portal: {
    type: 'circuit-board',
    colors: ['#00ffff', '#0080ff', '#00ff00'],
    gradient: 'radial-gradient(circle, #00ffff 0%, #0080ff 50%, #001a33 100%)',
    border: '4px solid #00ffff',
    animation: 'circuit-flow'
  },
  
  particles: ['⚡', '🔌', '💡', '🔋', '⚙️'],
  
  effects: {
    entry: 'circuit-trace',
    ambient: ['electric-pulse', 'led-blink'],
    sound: 'electric-hum.mp3'
  },
  
  links: [
    { title: 'Arduino Projects', url: '#/arena/arduino' },
    { title: 'Circuit Simulator', url: '#/tools/circuit-sim' },
    { title: 'Component Database', url: '#/database/electronics' }
  ],
  
  arena: {
    layout: 'laboratory',
    zones: ['Workbench', 'Test Lab', 'Storage', 'PCB Design'],
    collectibles: ['components', 'schematics', 'tools']
  }
};
