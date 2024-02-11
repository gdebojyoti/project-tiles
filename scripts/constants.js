// configuration values for the game
export const CONFIG = {
  TILE_SIZE: 50,
  TILE_GAP: 10
}

// directions
export const DIR = {
	LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN'
}

// // access colors from CSS variables
// const computedStyle = getComputedStyle(document.documentElement)
// export const COLORS = {
//   [DIR.LEFT]: computedStyle.getPropertyValue('--azure'),
//   [DIR.RIGHT]: computedStyle.getPropertyValue('--crimson'),
//   [DIR.UP]: computedStyle.getPropertyValue('--amber'),
//   [DIR.DOWN]: computedStyle.getPropertyValue('--emerald')
// }

export const IMAGE_PATHS = {
  [DIR.LEFT]: './assets/blue.png',
  [DIR.RIGHT]: './assets/red.png',
  [DIR.UP]: './assets/yellow.png',
  [DIR.DOWN]: './assets/green.png'
}