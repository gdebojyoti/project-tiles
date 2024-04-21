import Cell from 'app/components/home/gameScreen/Cell'

import { CellData } from 'app/types'
import { CONFIG } from 'app/data/constants'

import styles from './Scene.module.css'

const Scene = ({ mapData, onTileClick }) => {
  // exit early if no mapData
  if (!mapData) {
    return null
  }

  const { TILE_SIZE, TILE_GAP } = CONFIG

  const { cells } = mapData

  // identify highest column
  const highestCol = cells.reduce((acc: number, data: CellData) => {
    return data.col > acc ? data.col : acc
  }, 0)

  // identify highest row
  const highestRow = cells.reduce((acc: number, data: CellData) => {
    return data.row > acc ? data.row : acc
  }, 0)

  // set scene width & height
  const sceneWidth = `${highestCol * (TILE_SIZE + TILE_GAP)}px`
  const sceneHeight = `${highestRow * (TILE_SIZE + TILE_GAP)}px`

  return (
    <div id="scene-container">
      <div id="scene" className={styles.scene}>
        {cells.map((cell, index) => (
          <Cell key={index} data={cell} highestRow={highestRow} onClick={onTileClick} />
        ))}
      </div>
    </div>
  )
}

export default Scene
