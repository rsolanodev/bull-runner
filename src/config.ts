export const SKY_PALETTE = {
  skyTop: '#0D6FD3',
  skyMain: '#208FE3',
  skyHorizon: '#74CFF5',
  atmosphericFog: '#91DAF2',
  cloud: '#EFFAFF',
  sunLight: '#FFE19A',
  sunHighlight: '#FFCD65',
  shadowBlue: '#2B5369',
  inkNavy: '#183043',
} as const;

export const CITY_PALETTE = {
  road: '#4C7180',
  roadLight: '#6995A2',
  roadDark: '#345462',
  sidewalk: '#D1DCCB',
  curb: '#F5E9BD',
  crosswalk: '#FFF8D9',

  cream: '#FFE1A3',
  sunnyYellow: '#F7BD3C',
  coral: '#F4755A',
  terracotta: '#D85748',
  vividPink: '#EC70A1',
  brightTurquoise: '#23BFC5',
  freshMint: '#68D5A9',
  clearBlue: '#438EE8',
  lavender: '#A386E6',

  windows: '#284B5E',
  roof: '#805146',

  tree: '#3EA25A',
  treeLight: '#80D96D',
  trunk: '#7E4F38',

  coinGold: '#FFD32E',
  coinShine: '#FFF4AB',
  dangerRed: '#F04745',
  dangerOrange: '#FF852E',
  accentPurple: '#8957DC',
} as const;

export const OUTLINE_THICKNESS = {
  player: 0.06,
  collectible: 0.055,
  obstacle: 0.045,
  npc: 0.035,
  prop: 0.02,
} as const;

export const BULL_PALETTE = {
  body: '#3A2418',
  bodyLight: '#5C3A26',
  belly: '#7A5236',
  horn: '#F3E3B5',
  hoof: '#241812',
  eye: '#F7F1DC',
  pupil: '#183043',
  nose: '#B06B4E',
} as const;

export const CONFIG = {
  render: {
    maxPixelRatio: 2,
    antialias: true,
    shadows: true,
    shadowMapSize: 1024,
  },
  camera: {
    fov: 68,
    near: 0.1,
    far: 500,
    height: 4.6,
    distance: 8.5,
    lookAhead: 3,
    lookHeight: 1.6,
    lateralFollow: 0.42,
    tiltFactor: 0.05,
    damping: 7,
    shakeDecay: 6,
  },
  fog: {
    near: 42,
    far: 150,
  },
  lanes: {
    positions: [-2.4, 0, 2.4] as number[],
    transitionSpeed: 11,
  },
  bull: {
    startLane: 1,
    bodyHalfWidth: 0.52,
    bodyHalfLength: 0.95,
    standingHeight: 1.55,
    slidingHeight: 0.72,
    baseY: 0,
  },
  jump: {
    height: 2.45,
    gravity: 27,
    clearance: 1.05,
  },
  slide: {
    duration: 0.72,
  },
  speed: {
    base: 14,
    max: 34,
    acceleration: 0.32,
  },
  spawn: {
    distanceAhead: 155,
    recycleZ: 26,
    gapTimeStart: 1.35,
    gapTimeMin: 0.78,
    difficultyDistance: 900,
    coinChance: 0.7,
    coinRunMin: 3,
    coinRunMax: 6,
    coinSpacing: 2.2,
  },
  score: {
    distancePerUnit: 1,
    coinValue: 10,
  },
  obstacles: {
    low: { halfWidth: 1.0, halfLength: 0.35, clearance: 1.05 },
    arch: { halfWidth: 5.6, halfLength: 0.55 },
    solid: { halfWidth: 0.72, halfLength: 0.72 },
  },
  coin: {
    radius: 0.34,
    height: 1.0,
    spinSpeed: 3.2,
  },
  world: {
    segmentCount: 9,
    segmentLength: 30,
    roadHalfWidth: 4.2,
    sidewalkWidth: 3.2,
    buildingMargin: 10,
  },
  pools: {
    obstacles: 48,
    coins: 64,
  },
  storage: {
    highScoreKey: 'toro-en-fuga:highscore:v1',
  },
  input: {
    swipeThreshold: 28,
    swipeMaxTime: 600,
    tapMaxTime: 250,
    keyCooldown: 0.12,
  },
} as const;

export type Config = typeof CONFIG;
