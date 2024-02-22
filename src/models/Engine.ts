import CellData from '../types/CellData'
import Utils from '../services/Utils'

class Engine {
  private _currentlyOccupiedCell: string = ''
  private _allCellData: CellData[] = []
  private _steps: string[] = [] // maintain the steps taken by the user, to support "undo"
  private _isInProgress = false
  private _tokenElm: HTMLElement | null = null

  private __game: any // reference to the parent game object; NOTE: this is not a good practice, but it's a quick fix for now
  
  constructor (game: any, allCellData: CellData[]) {
    console.log("allCellData", allCellData)

    this.__game = game

    // start the game
    this._isInProgress = true

    // get base cell
    const baseCell = allCellData.find(({ isBase }) => isBase)

    // get token element
    this._tokenElm = document.getElementById('token')

    if (!baseCell) {
      console.error('Base cell not found')
      return
    }
    
    // maintain state of occupied cell at the start
    this._currentlyOccupiedCell = baseCell.id

    // update token position to base cell
    this.moveTokenToBaseCell(baseCell)

    // maintain state of all cells data
    this._allCellData = [...allCellData]

    this.addSceneListener()
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

  private moveTokenToBaseCell (baseCell: CellData): void {
    // get base cell element
    const baseCellElm = document.querySelector(`[data-cell-id="${baseCell.id}"]`)

    if (!baseCellElm) {
      console.error('Base cell element not found')
      return
    }
    
    this.animateToken(baseCellElm)

    // show token after the cells have finished rendering
    setTimeout(() => {
      if (!this._tokenElm) {
        return
      }
      this._tokenElm.classList.add('token--visible')
    }, 750)
  }

  private animateToken (cellElm: Element): void {
    // get position of clicked cell
    const { top, left } = cellElm.getBoundingClientRect()

    // update transform property of token element
    if (!this._tokenElm) {
      return
    }
    this._tokenElm.style.transform = `translate(${left}px, ${top}px)`
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

  // update the steps count in the UI
  private updateStepCount (): void {
    // get step count element
    const stepCountElm = document.getElementById('step-counter')

    if (!stepCountElm) {
      console.error('Step count element not found')
      return
    }

    // update step count in the UI
    stepCountElm.textContent = `${this._steps.length}`
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

      // show success message
      setTimeout(() => {
        // const successMessageElm = document.getElementById('success-message')
        // successMessageElm.classList.add('success-message--visible')
        // alert(`Congratulations! You completed the game in ${this._steps.length} steps.`)

        // trigger onLevelComplete method of the parent game object
        this.__game?.onLevelComplete()
      }, 300)
    }
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
    Utils.updateCellUi(this._allCellData)

    // update state of currently occupied cell
    this._currentlyOccupiedCell = lastLocationId

    // remove the last step from the steps array
    this._steps.pop()

    // update step count in UI
    this.updateStepCount()

    // move back the token to the last location
    const lastCellElm = document.querySelector(`[data-cell-id="${lastLocationId}"]`)
    if (lastCellElm) {
      this.animateToken(lastCellElm)
    }
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
    this.updateStepCount()

    // reset the state of currently occupied cell
    this._currentlyOccupiedCell = baseCell.id

    // move token to base cell
    this.moveTokenToBaseCell(baseCell)

    // reset the completion count of all cells
    this._allCellData.forEach(cell => {
      cell.stepResults = []
    })

    // update cell UI
    Utils.updateCellUi(this._allCellData)

    // reset the status of game
    this._isInProgress = true
  }

  // update position of token element, triggered by window resize, orientation change or any other event
  updateTokenPosition (): void {
    const currentCell = this._allCellData.find(cell => cell.id === this._currentlyOccupiedCell)
    if (!currentCell) {
      console.error('Cell not found')
      return
    }

    const currentCellElm = document.querySelector(`[data-cell-id="${currentCell.id}"]`)
    if (!currentCellElm) {
      console.error('Cell element not found')
      return
    }

    // disable animation for this update
    this._tokenElm?.classList.add('token--skip-transition')

    this.animateToken(currentCellElm)

    // show token after the cells have finished rendering
    this._tokenElm?.classList.remove('token--skip-transition')
  }

  // get steps count
  get stepsCount (): number {
    return this._steps.length
  }
}

export default Engine