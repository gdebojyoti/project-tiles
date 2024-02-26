import CellData from './CellData'

type MapData = {
  positionCompensation: any
  cells: CellData[]
  optimum: number // maintain the optimum number of steps to reach this cell
}

export default MapData
