type CellData = {
  id: string
  col: number
  row: number
  isBase: boolean
  dir: string
  completionCount: number // use a count instead of a boolean flag to allow for multiple steps (and "undo"ing) in the same direction
}

export default CellData