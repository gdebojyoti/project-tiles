import { CellData } from 'app/types'
import { DIR } from 'app/data/constants'

export default function getDirection (currentCell: CellData, clickedCell: CellData): string {
  const { row: row1, col: col1 } = currentCell
  const { row: row2, col: col2 } = clickedCell

  if (row1 === row2 && col1 > col2) return DIR.LEFT
  if (row1 === row2 && col1 < col2) return DIR.RIGHT
  if (col1 === col2 && row1 < row2) return DIR.UP
  if (col1 === col2 && row1 > row2) return DIR.DOWN

  return ''
}
