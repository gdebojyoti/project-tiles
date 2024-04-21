import { useEffect, useRef, useState } from 'react'

import { CONFIG, DIR, IMAGE_PATHS } from 'app/data/constants'

import styles from './Cell.module.css'

const Cell = ({ data, highestRow, onClick }) => {
  const cellRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLImageElement>(null)

  const [arrowImageSrc, setArrowImageSrc] = useState(null)
  const [classNameSuffix, setClassNameSuffix] = useState('')

  const { id, row, col, dir } = data

  useEffect(() => {
    const { TILE_SIZE, TILE_GAP } = CONFIG

    const elm = cellRef.current
    const arrowElm = arrowRef.current

    if (!elm || !arrowElm) {
      return
    }

    elm.style.width = `${TILE_SIZE}px`
    elm.style.height = `${TILE_SIZE}px`

    // using `left` & `top` properties since `transform` will be used for animation
    elm.style.left = `${(col - 1) * (TILE_SIZE + TILE_GAP)}px`
    elm.style.top = `${(highestRow - row) * (TILE_SIZE + TILE_GAP)}px`

    // delay animation as the distance from "base" cell increases
    elm.style.animationDelay = `${(row + col) * 0.05}s`

    switch (dir) {
      case DIR.LEFT:
        setClassNameSuffix('left')
        setArrowImageSrc(IMAGE_PATHS[DIR.LEFT].src)
        arrowElm.style.transform = 'rotate(-90deg)'
        break
      case DIR.RIGHT:
        setClassNameSuffix('right')
        setArrowImageSrc(IMAGE_PATHS[DIR.RIGHT].src)
        arrowElm.style.transform = 'rotate(90deg)'
        break
      case DIR.UP:
        setClassNameSuffix('up')
        setArrowImageSrc(IMAGE_PATHS[DIR.UP].src)
        arrowElm.style.transform = 'rotate(0deg)'
        break
      case DIR.DOWN:
        setClassNameSuffix('down')
        setArrowImageSrc(IMAGE_PATHS[DIR.DOWN].src)
        arrowElm.style.transform = 'rotate(180deg)'
        break
    }
  }, [data])

  return (
    <div className={`${styles.cell} cell--${classNameSuffix} ${!dir && styles.base}`} ref={cellRef} onClick={() => onClick(id)} data-cell-id={id}>
      <img src={arrowImageSrc} className={`${styles.arrow} ${!arrowImageSrc && styles.none}`} ref={arrowRef} />
    </div>
  )
}

export default Cell
