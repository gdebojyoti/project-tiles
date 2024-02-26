import { CONFIG } from '../data/constants'
import Observer from '../interfaces/Observer'
import Cell from '../models/Cell'
import GameEngine from './GameEngine'
import CellData from '../types/CellData'
import MapData from '../types/MapData'

class UiEngine implements Observer {
  private _gameEngine: GameEngine
  private _sceneTransform: { x: number, y: number } = { x: 0, y: 0 }

  private _sceneElm: HTMLElement
  private _tokenElm!: HTMLElement

  constructor () {
    this._gameEngine = new GameEngine()
    
    // Add the Ui instance to the observers array
    this._gameEngine.addObserver(this)
  }

  update (msg: string, data: any) {
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
      case 'UPDATE_TOKEN':
        this.updateTokenPosition(data)
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
    // get scene element
    const sceneElm = document.getElementById('scene')
    if (!sceneElm) {
      console.error('Scene element not found')
      return
    }

    sceneElm.addEventListener('click', (e) => {
      // exit if game is not in progress
      if (!this._isInProgress) {
        return
      }

      const clickedCellElm = (e.target as Element).closest('.cell')
      if (!clickedCellElm) {
        return
      }

      const clickedCellId = clickedCellElm.getAttribute('data-cell-id')
      
      // get current & clicked cells data
      const currentCell = this._allCellData.find(({ id }) => id === this._currentlyOccupiedCell)
      const clickedCell = this._allCellData.find(({ id }) => id === clickedCellId)

      // exit if either cell is not found
      if (!currentCell || !clickedCell) {
        console.error('Cell not found')
        return
      }

      // if clicked cell is not adjacent to current cell, exit
      if (!Utils.isAdjacent(currentCell, clickedCell)) {
        console.warn('Not adjacent')
        return
      }

      this.updateCompletionStatus(currentCell, clickedCell)

      // add step to steps array
      this._steps.push(this._currentlyOccupiedCell)

      // update step count in UI
      this.updateStepCount()

      // update state of currently occupied cell
      this._currentlyOccupiedCell = clickedCell.id

      // move to token to clicked cell
      this.animateToken(clickedCellElm)

      // update cell UI
      Utils.updateCellUi(this._allCellData)

      // check game completion
      this.checkGameCompletion()
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
            // this._gameEngine.restart()
            break
          case 'undo':
            // undo the last step
            // this._gameEngine.undo()
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
        this._gameEngine.updateTokenPosition()
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

  // update position of token element, triggered by window resize, orientation change or any other event
  private updateTokenPosition ({ cellId }: { cellId: string }): void {
    const currentCellElm = document.querySelector(`[data-cell-id="${cellId}"]`)
    if (!currentCellElm) {
      console.error('Cell element not found')
      return
    }

    // disable animation for this update
    this._tokenElm?.classList.add('token--skip-transition')

    this.animateTokenTo(currentCellElm)

    // show token after the cells have finished rendering
    this._tokenElm?.classList.remove('token--skip-transition')
  }

  // animate the token element to the cell element provided
  private animateTokenTo (cellElm: Element): void {
    // get position of clicked cell
    const { top, left } = cellElm.getBoundingClientRect()

    // update transform property of token element
    if (!this._tokenElm) {
      // return
    }
    this._tokenElm.style.transform = `translate(${left}px, ${top}px)`
  }
}

export default UiEngine