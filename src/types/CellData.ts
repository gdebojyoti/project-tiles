type CellData = {
  id: string
  col: number
  row: number
  isBase: boolean
  dir: string
  stepResults: boolean[] // maintain a record of the results of the steps taken by the user over this cell, to support "undo"
  optimum: number // maintain the optimum number of steps to reach this cell
}

export default CellData