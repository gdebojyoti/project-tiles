import { useEffect, useState } from "react"

import level1 from 'app/data/maps/level-1.json'

import { CellData } from 'app/types'
import getDirection from 'app/utils/getDirection'
import isAdjacent from 'app/utils/isAdjacent'

const useGameEngine = () => {
  const [mapData, setMapData] = useState(null)
  const [cellData, setCellData] = useState([])
  const [steps, setSteps] = useState([])
  const [isInProgress, setIsInProgress] = useState(false)
  const [isLevelComplete, setIsLevelComplete] = useState(false)
  const [currentlyOccupiedCell, setCurrentlyOccupiedCell] = useState('')

  useEffect(() => {
    // initialize mapdata & celldata
    const { cells } = level1
    setMapData(level1)
    setCellData(cells)

    // start game
    startGame(cells)
  }, [])

  // every time the user takes a step, check if game has ended
  useEffect(() => {
    // ignore if no steps have been taken
    if (!steps.length) {
      return
    }
    
    // ignore if game is not finished
    if (!checkGameCompletion(cellData)) {
      return
    }
    
    // else update flags
    setIsLevelComplete(true)
    setIsInProgress(false)
  }, [steps])

  // TODO: Remove the overlapping logic with `restart` method
  const startGame = (cellData: CellData[]): void => {
    // start the game
    setIsInProgress(true)
  
    // get base cell
    const baseCell = cellData.find(({ isBase }) => isBase)
  
    if (!baseCell) {
      console.error('Base cell not found')
      return
    }
    
    // maintain state of occupied cell at the start
    setCurrentlyOccupiedCell(baseCell.id)
  }

  // when user clicks on a cell / tile
  const onTileClick = (cellId: String) => {
    // exit if game is not in progress
    if (!isInProgress) {
      return
    }

    const newCellData = [...cellData]

    // get current & clicked cells data
    const currentCell = cellData.find(cell => cell.id === currentlyOccupiedCell)
    const clickedCell = cellData.find(cell => cell.id === cellId)

    // exit if either cell is not found
    if (!currentCell || !clickedCell) {
      console.error('Cell not found')
      return
    }

    // if clicked cell is not adjacent to current cell, exit
    if (!isAdjacent(currentCell, clickedCell)) {
      console.warn('Not adjacent')
      return
    }

    // get step results of "clicked cell"
    const stepResults = getStepResults(currentCell, clickedCell)
    clickedCell.stepResults = stepResults

    // push the "current cell" to list of steps taken
    const newSteps = [...steps, currentlyOccupiedCell]
    setSteps(newSteps)

    // update state of currently occupied cell
    setCurrentlyOccupiedCell(clickedCell.id)

    setCellData(newCellData)
  }

  return {
    mapData,
    currentlyOccupiedCell,
    steps,
    isLevelComplete,
    onTileClick
  }
}

// mark current cell as complete or incomplete - depending upon the direction of move
function getStepResults (currentCell: CellData, clickedCell: CellData): boolean[] {
  // determine direction of move
  const direction = getDirection(currentCell, clickedCell)

  const { dir } = clickedCell

  const stepResults = [...(clickedCell.stepResults || [])]
  
  // save whether move is same as `dir` of clicked cell
  stepResults.push(direction === dir)

  return stepResults
}

function checkGameCompletion (cellData: CellData[]): boolean {
  // check if all cells are complete
  const isGameComplete = cellData.every(({ isBase, stepResults }) => {
    // if cell is base, or if the last step result is true, then the cell is complete
    const lastStepResult = stepResults ? stepResults[stepResults.length - 1] : false
    return isBase || lastStepResult
  })

  return isGameComplete
}

export default useGameEngine
