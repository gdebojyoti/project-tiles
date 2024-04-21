import blueArrow from 'public/tiles/blue.png'
import redArrow from 'public/tiles/red.png'
import yellowArrow from 'public/tiles/yellow.png'
import greenArrow from 'public/tiles/green.png'

// configuration values for the game
export const CONFIG = {
  TILE_SIZE: 50,
  TILE_GAP: 10,
  AVAILABLE_LEVEL_COUNT: 11
}

// directions
export const DIR = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN'
}

// assets
export const IMAGE_PATHS = {
  [DIR.LEFT]: blueArrow,
  [DIR.RIGHT]: redArrow,
  [DIR.UP]: yellowArrow,
  [DIR.DOWN]: greenArrow
}

// success modal titles
export const SUCCESS_TITLES = [
  'Good job!', // for 1 star
  'Well done!', // for 2 stars
  'Excellent!' // for 3 stars
]
