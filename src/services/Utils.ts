import { DIR } from "../data/constants"
import CellData from "../types/CellData"

abstract class Utils {
  public static getDirection (currentCell: CellData, clickedCell: CellData): string {
    const { row: row1, col: col1 } = currentCell
    const { row: row2, col: col2 } = clickedCell
  
    if (row1 === row2 && col1 > col2) return DIR.LEFT
    if (row1 === row2 && col1 < col2) return DIR.RIGHT
    if (col1 === col2 && row1 < row2) return DIR.UP
    if (col1 === col2 && row1 > row2) return DIR.DOWN

    return ''
  }

  public static isAdjacent (currentCell: CellData, clickedCell: CellData): boolean {
    const { row: row1, col: col1 } = currentCell
    const { row: row2, col: col2 } = clickedCell

    // if currentCell is adjacent to clickedCell, return true
    if (row1 === row2 && Math.abs(col1 - col2) === 1) return true
    if (col1 === col2 && Math.abs(row1 - row2) === 1) return true

    // else, return false
    return false
  }
}

export default Utils
