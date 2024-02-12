import CellData from '../types/CellData'
import Utils from '../services/Utils'

class Engine {
  private _currentlyOccupiedCell: string = ''
  private _allCellData: CellData[] = []
  private _stepCount = 0
  private _isInProgress = false

  private _tokenElm: HTMLElement | null = null
  
  constructor (allCellData: CellData[]) {
    console.log("allCellData", allCellData)

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
    
    // get scene element
    const sceneElm = document.getElementById('scene')
    if (!sceneElm) {
      console.error('Scene element not found')
      return
    }
    
    // add click listener on scene (instead of all cells, to improve performance), and apply move logic
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

      // update step count
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
    
    // if move is same as `dir` of clicked cell, set current cell as complete
    clickedCell.isComplete = direction === dir
  }

  // update the steps count in the UI
  private updateStepCount (): void {
    // increment step count in the state
    this._stepCount++

    // get step count element
    const stepCountElm = document.getElementById('step-counter')

    if (!stepCountElm) {
      console.error('Step count element not found')
      return
    }

    // update step count in the UI
    stepCountElm.textContent = `${this._stepCount}`
  }

  private checkGameCompletion (): void {
    const isGameComplete = this._allCellData.every(({ isBase, isComplete }) => isBase || isComplete)

    if (isGameComplete) {
      // stop the game
      this._isInProgress = false

      // show success message
      setTimeout(() => {
        // const successMessageElm = document.getElementById('success-message')
        // successMessageElm.classList.add('success-message--visible')
        alert(`Congratulations! You completed the game in ${this._stepCount} steps.`)
      }, 300)
    }
  }
}

export default Engine