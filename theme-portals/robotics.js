// 🤖 Robotics Theme Portal Definition
// Factory gate to automation world

export const roboticsTheme = {
  id: 'robotics',
  name: 'Robotics Factory',
  emoji: '🤖',
  description: 'Factory gate to automation world',
  
  portal: {
    type: 'factory-gate',
    colors: ['#c0c0c0', '#4169e1', '#ff6347'],
    gradient: 'linear-gradient(180deg, #c0c0c0 0%, #4169e1 50%, #1e3a5f 100%)',
    border: '6px solid #c0c0c0',
    animation: 'mechanical-rotate'
  },
  
  particles: ['🤖', '⚙️', '🔧', '🔩', '🏭'],
  
  effects: {
    entry: 'gear-assembly',
    ambient: ['conveyor-move', 'servo-whir'],
    sound: 'mechanical.mp3'
  },
  
  links: [
    { title: 'Robot Projects', url: '#/arena/robot-projects' },
    { title: 'Control Systems', url: '#/tools/control' },
    { title: 'Assembly Guide', url: '#/guide/assembly' }
  ],
  
  arena: {
    layout: 'factory',
    zones: ['Assembly Line', 'Control Room', 'Testing', 'Warehouse'],
    collectibles: ['parts', 'blueprints', 'tools']
  }
};
