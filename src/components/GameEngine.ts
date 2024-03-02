import { CONFIG } from '../data/constants'
import CellData from '../types/CellData'
import Observer from '../interfaces/Observer'
import Utils from '../services/Utils'

class GameEngine {
  private _currentLevel: number = 1
  private _mapData: any = null
  
  private _currentlyOccupiedCell: string = ''
  private _allCellData: CellData[] = []
  private _steps: string[] = [] // maintain the steps taken by the user, to support "undo"
  private _isInProgress: boolean = false

  constructor () {
    this.init()
  }

  async init (): Promise<void> {
    // load map
    await this.loadMap(this._currentLevel)

    this.notifyObservers('INIT_SCENE', {
      isFirstStart: true,
      mapData: this._mapData
    })
  }

  // NOTE: public methods

  // TODO: Remove the overlapping logic with `restart` method
  startGame (): void {
    // start the game
    this._isInProgress = true

    // get base cell
    const baseCell = this._allCellData.find(({ isBase }) => isBase)

    if (!baseCell) {
      console.error('Base cell not found')
      return
    }
    
    // maintain state of occupied cell at the start
    this._currentlyOccupiedCell = baseCell.id

    // update token position to base cell
    this.notifyObservers('RESET_TOKEN_POSITION', {
      baseCell
    })
  }

  // when user clicks on a tile
  onTileClick (cellId: string | null): void {
    // exit if game is not in progress
    if (!this._isInProgress) {
      return
    }
    
    // get current & clicked cells data
    const currentCell = this._allCellData.find(cell => cell.id === this._currentlyOccupiedCell)
    const clickedCell = this._allCellData.find(cell => cell.id === cellId)

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

    // update step count in UI (via message)
    this.notifyObservers('UPDATE_STEP_COUNT', {
      stepCount: this._steps.length
    })

    // update state of currently occupied cell
    this._currentlyOccupiedCell = clickedCell.id

    this.updateTokenPosition()

    // update cell UI
    this.notifyObservers('UPDATE_ALL_CELLS', {
      allCellData: this._allCellData
    })

    // check game completion
    this.checkGameCompletion()
  }

  updateTokenPosition (): void {
    this.notifyObservers('UPDATE_TOKEN', {
      cellId: this._currentlyOccupiedCell
    })
  }

  // restart the game
  restart (): void {
    // get base cell
    const baseCell = this._allCellData.find(cell => cell.isBase)

    // handle edge case
    if (!baseCell) {
      console.error('Base cell not found')
      return
    }

    // reset the steps array
    this._steps = []

    // update step count in UI
    this.notifyObservers('UPDATE_STEP_COUNT', {
      stepCount: this._steps.length
    })

    // reset the state of currently occupied cell
    this._currentlyOccupiedCell = baseCell.id

    // move token to base cell
    this.updateTokenPosition()

    // reset the completion count of all cells
    this._allCellData.forEach(cell => {
      cell.stepResults = []
    })

    // update cell UI
    // TODO: I'm currently calling INIT_SCENE instead of UPDATE_ALL_CELLS just to trigger the animation during "cell / tile initialization"; this should be fixed
    this.notifyObservers('INIT_SCENE', {
      isFirstStart: false,
      mapData: this._mapData
    })
    // this.notifyObservers('UPDATE_ALL_CELLS', {
    //   allCellData: this._allCellData
    // })

    // reset the status of game
    this._isInProgress = true
  }

  // undo the most recent step (i.e., move the token from the current cell to the last cell it was in)
  undo (): void {
    // exit if game is not in progress
    if (!this._isInProgress) {
      return
    }

    // get most recent location of token
    const lastLocationId = this._steps[this._steps.length - 1] // the last cell that the token was in
    const lastCell = this._allCellData.find(cell => cell.id === lastLocationId)

    // get details of current location of token
    const currentCell = this._allCellData.find(cell => cell.id === this._currentlyOccupiedCell)

    // handle edge case
    if (!lastCell || !currentCell) {
      console.error('Undo failed. Cells not found')
      return
    }

    // remove the last step result from current cell
    currentCell.stepResults.pop()

    // update cell UI
    this.notifyObservers('UPDATE_ALL_CELLS', {
      allCellData: this._allCellData
    })

    // update state of currently occupied cell
    this._currentlyOccupiedCell = lastLocationId

    // remove the last step from the steps array
    this._steps.pop()

    // update step count in UI
    this.notifyObservers('UPDATE_STEP_COUNT', {
      stepCount: this._steps.length
    })

    // update token UI to move it back to the last location
    this.notifyObservers('UPDATE_TOKEN', {
      cellId: lastLocationId
    })
  }

  // check & load next level
  async checkAndLoadNextLevel (): Promise<void> {
    // check if there's a next level to load
    if (this._currentLevel < CONFIG.LEVEL_COUNT) {
      this._currentLevel++ // increment current level
      
      await this.loadMap(this._currentLevel) // load next map
      
      // re-initialize scene
      this.notifyObservers('INIT_SCENE', {
        isFirstStart: false,
        mapData: this._mapData
      })

      // TODO: fix `startGame` & `restart` methods; calling `restart` here is a workaround
      this.restart()
    } else {
      console.log('No more levels to load')
      alert(`Congratulations! You completed all the levels!`)
    }
  }

  // stop the game
  close (): void {
    // reset the current level to 1
    this._currentLevel = 1

    // restart the game to reset all data & UI
    this.restart()

    // show the main menu
    this.notifyObservers('CLOSE_GAME', {})

    // hide the game UI
    this.notifyObservers('HIDE_GAME_UI', {})
  }

  // NOTE: private methods

  // Method to load map
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

    if (!mapData || !mapData.default) {
      console.error('Map data not found')
      return
    }

    this._mapData = mapData.default
    this._allCellData = this._mapData.cells
  }

  // mark current cell as complete or incomplete - depending upon the direction of move
  private updateCompletionStatus (currentCell: CellData, clickedCell: CellData): void {
    // determine direction of move
    const direction = Utils.getDirection(currentCell, clickedCell)
  
    const { dir } = clickedCell
    
    // save whether move is same as `dir` of clicked cell
    if (clickedCell.stepResults) {
      clickedCell.stepResults.push(direction === dir)
    } else {
      clickedCell.stepResults = [direction === dir]
    }
  }

  private checkGameCompletion (): void {
    // check if all cells are complete
    const isGameComplete = this._allCellData.every(({ isBase, stepResults }) => {
      // if cell is base, or if the last step result is true, then the cell is complete
      const lastStepResult = stepResults ? stepResults[stepResults.length - 1] : false
      return isBase || lastStepResult
    })
  
    if (isGameComplete) {
      // stop the game
      this._isInProgress = false
  
      // trigger onLevelComplete method of the parent game object after a delay
      setTimeout(() => {
        this.onLevelComplete()
      }, 300)
    }
  }

  private onLevelComplete (): void {
    // get steps
    const userStepCount = this._steps.length

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
    this.notifyObservers('SHOW_SUCCESS_MODAL', {
      score,
      starCount
    })
  }

  // NOTE: observer pattern implementation

  // Define observers array with the Observer interface
  private observers: Observer[] = []

  // Method to add observers
  addObserver (observer: Observer) {
    this.observers.push(observer)
  }

  // Method to notify observers
  private notifyObservers (msg: string, data: any) {
    this.observers.forEach(observer => observer.update(msg, data))
  }
}

export default GameEngine
