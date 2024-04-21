import { CellData } from 'app/types'

export default function isAdjacent (currentCell: CellData, clickedCell: CellData): boolean {
  const { row: row1, col: col1 } = currentCell
  const { row: row2, col: col2 } = clickedCell

  // if currentCell is adjacent to clickedCell, return true
  if (row1 === row2 && Math.abs(col1 - col2) === 1) return true
  if (col1 === col2 && Math.abs(row1 - row2) === 1) return true

  // else, return false
  return false
}