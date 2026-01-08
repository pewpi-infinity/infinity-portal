// Theme portal definitions for remaining themes
// Math, Physics, Biology, Art, Music, Space

export const mathTheme = {
  id: 'math',
  name: 'Mathematics Realm',
  emoji: '📐',
  description: 'Geometric portal to equations',
  portal: {
    type: 'geometric',
    colors: ['#ffd700', '#ffa500', '#ff4500'],
    gradient: 'conic-gradient(from 45deg, #ffd700, #ffa500, #ff4500, #ffd700)',
    border: '3px solid #ffd700',
    animation: 'geometric-morph'
  },
  particles: ['📐', '∞', '∑', '∫', '√'],
  effects: { entry: 'equation-solve', ambient: ['number-cascade', 'formula-spin'], sound: 'calculate.mp3' },
  links: [
    { title: 'Math Arena', url: '#/arena/math' },
    { title: 'Calculators', url: '#/tools/calculators' },
    { title: 'Problem Sets', url: '#/database/problems' }
  ],
  arena: { layout: 'grid', zones: ['Algebra', 'Geometry', 'Calculus', 'Statistics'], collectibles: ['theorems', 'proofs', 'formulas'] }
};

export const physicsTheme = {
  id: 'physics',
  name: 'Physics Field',
  emoji: '⚛️',
  description: 'Quantum gateway to forces',
  portal: {
    type: 'quantum-gateway',
    colors: ['#9370db', '#4169e1', '#00ffff'],
    gradient: 'radial-gradient(ellipse, #9370db 0%, #4169e1 40%, #000033 100%)',
    border: '4px dashed #9370db',
    animation: 'quantum-flicker'
  },
  particles: ['⚛️', '🌊', '💫', '⚡', '🔭'],
  effects: { entry: 'quantum-tunnel', ambient: ['wave-interference', 'particle-stream'], sound: 'resonance.mp3' },
  links: [
    { title: 'Physics Arena', url: '#/arena/physics' },
    { title: 'Simulators', url: '#/tools/simulators' },
    { title: 'Experiments', url: '#/database/experiments' }
  ],
  arena: { layout: 'field', zones: ['Mechanics', 'Quantum', 'Relativity', 'Thermodynamics'], collectibles: ['laws', 'constants', 'experiments'] }
};

export const biologyTheme = {
  id: 'biology',
  name: 'Biology Center',
  emoji: '🧬',
  description: 'DNA helix to life sciences',
  portal: {
    type: 'dna-helix',
    colors: ['#32cd32', '#00ff00', '#228b22'],
    gradient: 'linear-gradient(90deg, #32cd32 0%, #00ff00 50%, #228b22 100%)',
    border: '5px double #32cd32',
    animation: 'helix-twist'
  },
  particles: ['🧬', '🦠', '🌱', '🔬', '🧫'],
  effects: { entry: 'cell-divide', ambient: ['dna-replicate', 'organism-grow'], sound: 'heartbeat.mp3' },
  links: [
    { title: 'Biology Arena', url: '#/arena/biology' },
    { title: 'Cell Simulator', url: '#/tools/cell-sim' },
    { title: 'Species Database', url: '#/database/species' }
  ],
  arena: { layout: 'ecosystem', zones: ['Cellular', 'Anatomy', 'Genetics', 'Ecology'], collectibles: ['cells', 'specimens', 'genomes'] }
};

export const artTheme = {
  id: 'art',
  name: 'Art Studio',
  emoji: '🎨',
  description: 'Canvas portal to creativity',
  portal: {
    type: 'canvas-portal',
    colors: ['#ff69b4', '#ffd700', '#00ced1', '#9370db'],
    gradient: 'linear-gradient(45deg, #ff69b4, #ffd700, #00ced1, #9370db)',
    border: '7px solid transparent',
    animation: 'color-splash'
  },
  particles: ['🎨', '🖌️', '🌈', '✨', '🖼️'],
  effects: { entry: 'paint-splash', ambient: ['color-blend', 'brush-stroke'], sound: 'brush.mp3' },
  links: [
    { title: 'Art Arena', url: '#/arena/art' },
    { title: 'Drawing Tools', url: '#/tools/drawing' },
    { title: 'Gallery', url: '#/database/gallery' }
  ],
  arena: { layout: 'studio', zones: ['Canvas', 'Sculpture', 'Digital', 'Mixed Media'], collectibles: ['paints', 'brushes', 'artworks'] }
};

export const musicTheme = {
  id: 'music',
  name: 'Music Studio',
  emoji: '🎵',
  description: 'Sound wave portal to melodies',
  portal: {
    type: 'sound-wave',
    colors: ['#ff00ff', '#00ffff', '#ffff00'],
    gradient: 'repeating-linear-gradient(90deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #ff00ff 100%)',
    border: '5px solid #ff00ff',
    animation: 'wave-motion'
  },
  particles: ['🎵', '🎶', '🎹', '🎧', '🎼'],
  effects: { entry: 'sound-burst', ambient: ['note-flow', 'rhythm-pulse'], sound: 'chord.mp3' },
  links: [
    { title: 'Music Arena', url: '#/arena/music' },
    { title: 'Composer', url: '#/tools/composer' },
    { title: 'Song Database', url: '#/database/songs' }
  ],
  arena: { layout: 'studio', zones: ['Recording', 'Mixing', 'Performance', 'Archive'], collectibles: ['notes', 'tracks', 'instruments'] }
};

export const spaceTheme = {
  id: 'space',
  name: 'Space Station',
  emoji: '🚀',
  description: 'Cosmic tunnel to the stars',
  portal: {
    type: 'cosmic-tunnel',
    colors: ['#000033', '#4169e1', '#ffffff'],
    gradient: 'radial-gradient(circle, #4169e1 0%, #000033 50%, #000000 100%)',
    border: '6px solid #4169e1',
    animation: 'cosmic-warp'
  },
  particles: ['🚀', '🌟', '🌙', '🪐', '✨'],
  effects: { entry: 'hyperspace-jump', ambient: ['star-drift', 'nebula-swirl'], sound: 'space-ambient.mp3' },
  links: [
    { title: 'Space Arena', url: '#/arena/space' },
    { title: 'Star Map', url: '#/tools/star-map' },
    { title: 'Mission Database', url: '#/database/missions' }
  ],
  arena: { layout: 'station', zones: ['Bridge', 'Laboratory', 'Observatory', 'Hangar'], collectibles: ['stars', 'planets', 'artifacts'] }
};

// Export all themes
export const allThemes = {
  math: mathTheme,
  physics: physicsTheme,
  biology: biologyTheme,
  art: artTheme,
  music: musicTheme,
  space: spaceTheme
};
