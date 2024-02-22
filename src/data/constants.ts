import blueArrow from '../assets/blue.png'
import redArrow from '../assets/red.png'
import yellowArrow from '../assets/yellow.png'
import greenArrow from '../assets/green.png'

// configuration values for the game
export const CONFIG = {
  TILE_SIZE: 50,
  TILE_GAP: 10,
  LEVEL_COUNT: 3
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