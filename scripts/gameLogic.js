import { DIR } from './constants.js'
import updateCellUi from './updateCellUi.js'

const gameState = {
  currentlyOccupiedCell: null,
  allCellData: [],
  stepCount: 0,
  isInProgress: false
}

export default function initGameFlow (allCellData) {
  // start the game
  gameState.isInProgress = true

  // get base cell
  const baseCell = allCellData.find(({ isBase }) => isBase)
  
  // maintain state of occupied cell at the start
  gameState.currentlyOccupiedCell = baseCell.id

  // update token position to base cell
  moveTokenToBaseCell(baseCell)

  // maintain state of all cells data
  gameState.allCellData = [...allCellData]
  
  // add click listener on scene (instead of all cells, to improve performance), and apply move logic
  const sceneElm = document.getElementById('scene')
  sceneElm.addEventListener('click', (e) => {
    // exit if game is not in progress
    if (!gameState.isInProgress) {
      return
    }

    const clickedCellElm = e.target.closest('.cell')
    if (!clickedCellElm) {
      return
    }

    const clickedCellId = clickedCellElm.getAttribute('data-cell-id')
    
    // get current & clicked cells data
    const currentCell = gameState.allCellData.find(({ id }) => id === gameState.currentlyOccupiedCell)
    const clickedCell = gameState.allCellData.find(({ id }) => id === clickedCellId)

    // if clicked cell is not adjacent to current cell, exit
    if (!isAdjacent(currentCell, clickedCell)) {
      console.warn('Not adjacent')
      return
    }

    updateCompletionStatus(currentCell, clickedCell)

    // update step count
    updateStepCount()

    // update state of currently occupied cell
    gameState.currentlyOccupiedCell = clickedCell.id

    // move to token to clicked cell
    animateToken(clickedCellElm)

    // update cell UI
    updateCellUi(gameState.allCellData)

    // check game completion
    checkGameCompletion()
  })
}

function moveTokenToBaseCell (baseCell) {
  // get base cell element
  const baseCellElm = document.querySelector(`[data-cell-id="${baseCell.id}"]`)
  
  animateToken(baseCellElm)

  // show token after the cells have finished rendering
  setTimeout(() => {
    // get token element
    const tokenElm = document.getElementById('token')

    // show token element
    tokenElm.classList.add('token--visible')
  }, 750)
}

function isAdjacent (currentCell, clickedCell) {
  const { row: row1, col: col1 } = currentCell
  const { row: row2, col: col2 } = clickedCell

  // if currentCell is adjacent to clickedCell, return true
  if (row1 === row2 && Math.abs(col1 - col2) === 1) return true
  if (col1 === col2 && Math.abs(row1 - row2) === 1) return true

  // else, return false
  return false
}

// mark current cell as complete or incomplete - depending upon the direction of move
function updateCompletionStatus (currentCell, clickedCell) {
  // determine direction of move
  const direction = getDirection(currentCell, clickedCell)

  const { dir } = clickedCell
  
  // if move is same as `dir` of clicked cell, set current cell as complete
  clickedCell.isComplete = direction === dir
}

// update the steps count in the UI
function updateStepCount () {
  // increment step count in the state
  gameState.stepCount++

  // get step count element
  const stepCountElm = document.getElementById('step-counter')

  // update step count in the UI
  stepCountElm.textContent = gameState.stepCount
}

function getDirection (currentCell, clickedCell) {
  const { row: row1, col: col1 } = currentCell
  const { row: row2, col: col2 } = clickedCell

  if (row1 === row2 && col1 > col2) return DIR.LEFT
  if (row1 === row2 && col1 < col2) return DIR.RIGHT
  if (col1 === col2 && row1 < row2) return DIR.UP
  if (col1 === col2 && row1 > row2) return DIR.DOWN
}

function animateToken (clickedCellElm) {
  // console.log("gameState.currentlyOccupiedCell", clickedCellElm.getBoundingClientRect())

  // get position of clicked cell
  const { top, left } = clickedCellElm.getBoundingClientRect()

  // get token element
  const tokenElm = document.getElementById('token')

  // update transform property of token element
  tokenElm.style.transform = `translate(${left}px, ${top}px)`
}

function checkGameCompletion () {
  const isGameComplete = gameState.allCellData.every(({ isBase, isComplete }) => isBase || isComplete)

  if (isGameComplete) {
    // stop the game
    gameState.isInProgress = false

    // show success message
    setTimeout(() => {
      // const successMessageElm = document.getElementById('success-message')
      // successMessageElm.classList.add('success-message--visible')
      alert(`Congratulations! You completed the game in ${gameState.stepCount} steps.`)
    }, 300)
  }
}