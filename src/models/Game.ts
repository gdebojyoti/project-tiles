import { CONFIG } from '../data/constants'
import Cell from './Cell'
import Engine from './Engine'

import CellData from '../types/CellData'

class Game {
  private _mapData: any = null
  private _engine: Engine | null = null
  private _sceneTransform: { x: number, y: number } = { x: 0, y: 0 }

  async init (): Promise<void> {
    console.log("I got in!")

    this._mapData = await this.loadMap(-1)
    console.log("mapData", this._mapData)

    this.initScene(true)

    this.initButtons()

    this.initPanEvent()

    this._engine = new Engine(this._mapData.cells)
  }

  private async loadMap (level: number): Promise<any> {
    console.log("level", level)

    // sample map data for the game
    const sampleMapData = await import('../data/maps/sample-1.json')

    return sampleMapData.default
  }

  // initialize scene; triggered during first start and game restarts
  private initScene (isFirstStart: boolean): void {
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

    // add position compensation to scene's transform property (first time only, and not during "restarts")
    if (isFirstStart) {
      sceneElm.style.transform = `${getComputedStyle(sceneElm).transform} translate(${positionCompensation.x}px, ${positionCompensation.y}px)`
    }

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
          case 'restart':
            // restart the game
            this.initScene(false)
            this._engine?.restart()
            break
          case 'undo':
            // undo the last step
            this._engine?.undo()
            break
          default:
            console.log('icon clicked:', icon)
        }
      })
    })
  }

  // add support for panning the "scene-container"
  private initPanEvent (): void {
    // identify element with "pan-surface" ID
    const panSurfaceElm = document.getElementById('pan-surface')
    if (!panSurfaceElm) {
      console.error('Pan surface element not found')
      return
    }

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      onPointerDown(touch)
    }

    const onMouseDown = (e: MouseEvent) => {
      onPointerDown(e)
    }

    const onPointerDown = (e: MouseEvent | Touch) => {
      const sceneContainerElm = document.getElementById('scene-container')
      if (!sceneContainerElm) {
        console.error('Scene container element not found')
        return
      }

      const initialX = e.clientX
      const initialY = e.clientY

      let movedX = 0
      let movedY = 0

      const onTouchMove = (e: TouchEvent) => {
        onPointerMove(e.touches[0])
      }

      const onMouseMove = (e: MouseEvent) => {
        onPointerMove(e)
      }

      const onPointerMove = (e: MouseEvent | Touch) => {
        movedX = e.clientX - initialX
        movedY = e.clientY - initialY

        sceneContainerElm.style.transform = `translate(${this._sceneTransform.x + movedX}px, ${this._sceneTransform.y + movedY}px)`

        // update token position
        this._engine?.updateTokenPosition()
      }

      // remove event listeners on mouse up, and update local scene transform variable
      const onPointerUp = () => {
        this._sceneTransform.x += movedX
        this._sceneTransform.y += movedY

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onPointerUp)
        document.removeEventListener('touchmove', onTouchMove)
        document.removeEventListener('touchend', onPointerUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onPointerUp)
      document.addEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onPointerUp)
    }

    panSurfaceElm.addEventListener('mousedown', onMouseDown)
    panSurfaceElm.addEventListener('touchstart', onTouchStart)
  }
}

export default Game