import { CONFIG } from '../data/constants'
import Observer from '../interfaces/Observer'
import Cell from '../models/Cell'
import GameEngine from './GameEngine'
import MenuUiEngine from './MenuUiEngine'
import CellData from '../types/CellData'
import MapData from '../types/MapData'

class UiEngine implements Observer {
  private _gameEngine: GameEngine
  private _menuUiEngine: MenuUiEngine
  private _sceneTransform: { x: number, y: number } = { x: 0, y: 0 }

  private _gameScreenElm!: HTMLElement
  private _sceneElm!: HTMLElement
  private _tokenElm!: HTMLElement

  constructor (game: GameEngine, menuUi: MenuUiEngine) {
    this._gameEngine = game
    this._menuUiEngine = menuUi
    
    // Add the Ui instance to the observers array
    this._gameEngine.addObserver(this)
    this._menuUiEngine.addObserver(this)
  }

  update (msg: string, data: any) {
    // Implementation of update method
    // This method is called by the Game class when it notifies observers
    const { isFirstStart } = data

    switch (msg) {
      case 'START_GAME':
        this.startGame()
        break

      case 'INIT_SCENE':
        // Call the initScene method with the data passed from the Game class
        this.initScene(data)
        if (isFirstStart) {
          this.addSceneListener()
          this.initButtons()
          this.initPanEvent()
        }
        break

      case 'RESET_TOKEN_POSITION':
        this.moveTokenToBaseCell(data.baseCell)
        break

      case 'UPDATE_TOKEN':
        this.updateTokenPosition(data)
        break
      
      case 'UPDATE_STEP_COUNT':
        this.updateStepCount(data.stepCount)
        break

      case 'UPDATE_ALL_CELLS':
        this.updateAllCells(data.allCellData)
        break

      case 'CLOSE_GAME':
        this._gameScreenElm.classList.remove('screen--visible')
        this._tokenElm.classList.remove('token--visible')
        break
    }
  }

  private startGame (): void {
    // since mostly everything is already initialized, just show the "game screen" element
    this._gameScreenElm.classList.add('screen--visible')

    this._gameEngine.startGame()
  }

  // initialize scene (set scene dimensions, render tiles); triggered during first start and game restarts
  private initScene ({ isFirstStart, mapData }: { isFirstStart: boolean, mapData: MapData }): void {
    const { TILE_SIZE, TILE_GAP } = CONFIG
    const { positionCompensation, cells } = mapData

    // get game screen element
    this._gameScreenElm = document.getElementById('screen') as HTMLElement

    // get scene element
    this._sceneElm = document.getElementById('scene') as HTMLElement

    // get token element
    this._tokenElm = document.getElementById('token') as HTMLElement

    if (this._sceneElm === null) {
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
    this._sceneElm.style.width = `${highestCol * (TILE_SIZE + TILE_GAP)}px`
    this._sceneElm.style.height = `${highestRow * (TILE_SIZE + TILE_GAP)}px`

    // add position compensation to scene's transform property (first time only, and not during "restarts")
    if (isFirstStart) {
      this._sceneElm.style.transform = `${getComputedStyle(this._sceneElm).transform} translate(${positionCompensation.x}px, ${positionCompensation.y}px)`
    }

    // empty scene element
    this._sceneElm.innerHTML = ''

    // loop through cells data; create & add cells to scene
    cells.forEach((data: CellData) => {
      const cellElm = new Cell(data, highestRow)
      this._sceneElm.appendChild(cellElm.element)
    })
  }

  // add click listener on scene (instead of all cells, to improve performance), and apply move logic
  private addSceneListener (): void {
    // exit if scene element is not found
    if (!this._sceneElm) {
      console.error('Scene element not found')
      return
    }

    this._sceneElm.addEventListener('click', (e) => {
      const clickedCellElm = (e.target as Element).closest('.cell')
      if (!clickedCellElm) {
        return
      }

      const clickedCellId = clickedCellElm.getAttribute('data-cell-id')

      this._gameEngine.onTileClick(clickedCellId)
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
            this._gameEngine.restart()
            break
          case 'undo':
            // undo the last step
            this._gameEngine.undo()
            break
          case 'tutorial':
            // show tutorial modal
            this._menuUiEngine.showTutorialModal()
            break
          case 'home':
            // go to home screen
            this._gameEngine.close()
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

  private moveTokenToBaseCell (baseCell: CellData): void {
    // get base cell element
    const baseCellElm = document.querySelector(`[data-cell-id="${baseCell.id}"]`)

    if (!baseCellElm) {
      console.error('Base cell element not found')
      return
    }
    
    this.animateTokenTo(baseCellElm)

    // show token after the cells have finished rendering
    setTimeout(() => {
      if (!this._tokenElm) {
        return
      }
      this._tokenElm.classList.add('token--visible')
    }, 750)
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

  // update the steps count in the UI
  private updateStepCount (stepCount: number): void {
    // get step count element
    const stepCountElm = document.getElementById('step-counter')

    if (!stepCountElm) {
      console.error('Step count element not found')
      return
    }

    // update step count in the UI
    stepCountElm.textContent = `${stepCount}`
  }

  private updateAllCells (allCellData: CellData[]) {
    // loop through allCellData; update cell UI for each cell
    allCellData.forEach(cell => {
      const { id, stepResults } = cell
  
      // get cell element
      const cellElm = document.querySelector(`[data-cell-id="${id}"]`)

      if (!cellElm) {
        console.error('Cell element not found')
        return
      }

      // cell is complete if the last step is true
      const isCellComplete = stepResults ? stepResults[stepResults.length - 1] : false
      
      // if cell is complete, add color to cell and remove arrow
      if (isCellComplete) {
        cellElm.classList.add('cell--complete')
        // cellElm.style.backgroundColor = COLORS[dir]
      } else {
        // if cell is incomplete, remove color from cell and add arrow
        cellElm.classList.remove('cell--complete')
      }
    })
  }
}

export default UiEngine
