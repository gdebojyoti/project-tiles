import { CONFIG, DIR, IMAGE_PATHS } from '../data/constants'
import CellData from '../types/CellData'

class Cell {
  element: HTMLElement

  constructor(data: CellData, highestRow: number) {
    const { TILE_SIZE, TILE_GAP } = CONFIG
    const { id, row, col, dir } = data
    
    // create cell element
    this.element = document.createElement('div')

    // add class & style to cell element
    this.element.classList.add('cell')
    this.element.style.width = `${TILE_SIZE}px`
    this.element.style.height = `${TILE_SIZE}px`

    // set data attribute
    this.element.setAttribute('data-cell-id', `${id}`)

    // using `left` & `top` properties since `transform` will be used for animation
    this.element.style.left = `${(col - 1) * (TILE_SIZE + TILE_GAP)}px`
    this.element.style.top = `${(highestRow - row) * (TILE_SIZE + TILE_GAP)}px`
    
    // delay animation as the distance from "base" cell increases
    this.element.style.animationDelay = `${(row + col) * 0.05}s`

    // if direction exists, add arrow to cell
    if (dir) {
      // create image element to indicate direction in the cell
      const imgElm = document.createElement('img')

      let classNameSuffix = ''
      
      // add class & style to image element; and update classNameSuffix
      imgElm.classList.add('arrow')
      switch (dir) {
        case DIR.LEFT:
          classNameSuffix = 'left'
          imgElm.src = IMAGE_PATHS[DIR.LEFT]
          imgElm.style.transform = 'rotate(-90deg)'
          break
        case DIR.RIGHT:
          classNameSuffix = 'right'
          imgElm.src = IMAGE_PATHS[DIR.RIGHT]
          imgElm.style.transform = 'rotate(90deg)'
          break
        case DIR.UP:
          classNameSuffix = 'up'
          imgElm.src = IMAGE_PATHS[DIR.UP]
          break
        case DIR.DOWN:
          classNameSuffix = 'down'
          imgElm.src = IMAGE_PATHS[DIR.DOWN]
          imgElm.style.transform = 'rotate(180deg)'
          break
      }
      
      // add image element to cell element
      this.element.appendChild(imgElm)

      // add class name to cell element
      this.element.classList.add(`cell--${classNameSuffix}`)
    } else {
      // if direction does not exist, add color to cell
      this.element.classList.add('cell--base')
    }
  }
}

export default Cell
