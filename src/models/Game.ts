import { CONFIG } from '../data/constants'
import Cell from './Cell'

import CellData from '../types/CellData'

class Game {
  // private _currentlyOccupiedCell: any = 5
  private _mapData: any = null

  async init (): Promise<void> {
    console.log("I got in!")

    this._mapData = await this.loadMap(-1)
    console.log("mapData", this._mapData)

    this.initScene()

    this.initButtons()
  }

  private async loadMap (level: number): Promise<any> {
    console.log("level", level)

    // sample map data for the game
    const sampleMapData = await import('../data/sample.json')

    return sampleMapData.default
  }

  private initScene (): void {
    const { TILE_SIZE, TILE_GAP } = CONFIG
    const { positionCompensation, cells } = this._mapData

    // get scene element
    const sceneElm = document.getElementById('scene')

    if (sceneElm === null) {
      console.error('Scene element not found')
      return
    }

    // identify highest column
    const highestCol = cells.reduce((acc: number, data: CellData) => {
      return data.col > acc ? data.col : acc
    }, 0)

    // identify highest row
    const highestRow = cells.reduce((acc: number, data: CellData) => {
      return data.row > acc ? data.row : acc
    }, 0)

    // set scene width & height
    sceneElm.style.width = `${highestCol * (TILE_SIZE + TILE_GAP)}px`
    sceneElm.style.height = `${highestRow * (TILE_SIZE + TILE_GAP)}px`

    // add position compensation to scene's transform property
    sceneElm.style.transform = `${getComputedStyle(sceneElm).transform} translate(${positionCompensation.x}px, ${positionCompensation.y}px)`

    // empty scene element
    sceneElm.innerHTML = ''

    // loop through cells data; create & add cells to scene
    cells.forEach((data: CellData) => {
      const cellElm = new Cell(data, highestRow)
      sceneElm.appendChild(cellElm.element)
    })
  }

  private initButtons (): void {
    // get all UI elements with icon data attributes
    const iconElms = document.querySelectorAll('[data-icon]')

    // loop through icon elements; add click event listener
    iconElms.forEach(elm => {
      elm.addEventListener('click', () => {
        const icon = elm.getAttribute('data-icon')

        switch (icon) {
          case 'mute':
            // toggle mute icon by toggling "icon--mute" & "icon--unmute" classes
            elm.classList.toggle('icon--mute')
            elm.classList.toggle('icon--unmute')
            break
          case 'reset':
            // reset the game
            this.initScene()
            break
          default:
            console.log('icon clicked:', icon)
        }
      })
    })
  }
}

export default Game