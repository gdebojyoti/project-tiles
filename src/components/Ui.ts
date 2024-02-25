import { CONFIG } from '../data/constants'
import Observer from '../interfaces/Observer'
import Cell from '../models/Cell'
import Game from './Game'
import CellData from '../types/CellData'
import MapData from '../types/MapData'

class Ui implements Observer {
  private _game: Game
  private _sceneTransform: { x: number, y: number } = { x: 0, y: 0 }

  constructor (game: Game) {
    this._game = game
    
    // Add the Ui instance to the observers array
    game.addObserver(this)
  }

  update(msg: string, data: any) {
    // Implementation of update method
    // This method is called by the Game class when it notifies observers
    const { isFirstStart } = data

    switch (msg) {
      case 'INIT_SCENE':
        // Call the initScene method with the data passed from the Game class
        this.initScene(data)
        this.addSceneListener()
        if (isFirstStart) {
          this.initButtons()
          this.initPanEvent()
        }
        break
    }
  }

  // initialize scene (set scene dimensions, render tiles); triggered during first start and game restarts
  private initScene ({ isFirstStart, mapData }: { isFirstStart: boolean, mapData: MapData }): void {
    const { TILE_SIZE, TILE_GAP } = CONFIG
    const { positionCompensation, cells } = mapData

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

  // add click listener on scene (instead of all cells, to improve performance), and apply move logic
  private addSceneListener (): void {
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
            this._game.restart()
            break
          case 'undo':
            // undo the last step
            this._game.undo()
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
        this._game.updateTokenPosition()
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

export default Ui