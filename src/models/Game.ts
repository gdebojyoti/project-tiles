import { CONFIG } from '../data/constants'
import Cell from './Cell'
import Engine from './Engine'
import UiService from '../services/Ui'

import CellData from '../types/CellData'

class Game {
  private _currentLevel: number = 1
  private _mapData: any = null
  private _engine: Engine | null = null
  private _sceneTransform: { x: number, y: number } = { x: 0, y: 0 }

  async init (): Promise<void> {
    console.log("I got in!")
    
    try {
      // load the first map
      await this.loadMap(this._currentLevel)
      console.log("mapData", this._mapData)

      this.initScene(true)

      this.initButtons()

      this.initPanEvent()

      this._engine = new Engine(this, this._mapData.cells)

      // initialize the UI
      UiService.init({ onRestart: this.restart.bind(this), onNextLevel: this.checkAndLoadNextLevel.bind(this)})
    } catch (error) {
      console.error('Error loading map:', error)
    }
  }

  private async loadMap (level: number): Promise<void> {
    console.log("level", level)

    // sample map data for the game
    let mapData = null

    switch (level) {
      case 1:
        mapData = await import('../data/maps/level-1.json')
        break
      case 2:
        mapData = await import('../data/maps/level-2.json')
        break
      case 3:
        mapData = await import('../data/maps/level-3.json')
        break
    }

    this._mapData = mapData?.default
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
            this.restart()
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

  restart (): void {
    this.initScene(false)
    this._engine?.restart()
  }

  onLevelComplete (): void {
    // get steps
    const userStepCount = this._engine?.stepsCount || 0

    // get optimum steps
    const optimumStepCount = this._mapData.optimum

    // calculate score
    const score = Math.floor((optimumStepCount / userStepCount) * 100 * optimumStepCount)
    console.log("score", score)

    let starCount = 1 // default to 1 star

    // 2 stars if user steps are within 20% of optimum steps
    if (userStepCount < optimumStepCount * 1.2) {
      starCount = 2
    }
    
    // 3 stars if user steps are same as optimum steps
    if (userStepCount === optimumStepCount) {
      starCount = 3
    }

    // show success modal
    UiService.showSuccessModal({ score, starCount })
  }

  // check & load next level
  async checkAndLoadNextLevel (): Promise<void> {
    // check if there's a next level to load
    if (this._currentLevel < CONFIG.LEVEL_COUNT) {
      this._currentLevel++ // increment current level
      
      await this.loadMap(this._currentLevel) // load next map
      
      this.initScene(false) // re-initialize scene
      
      // start the game
      this._engine = new Engine(this, this._mapData.cells)
      this._engine?.restart() // resets UI
    } else {
      console.log('No more levels to load')
      alert(`Congratulations! You completed all the levels!`)
    }
  }
}

export default Game