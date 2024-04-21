import { useEffect, useRef } from 'react'
import styles from './Token.module.css'

const Token = ({ shouldHide, currentlyOccupiedCell }) => {
  let tokenClassName = styles.token
  shouldHide && (tokenClassName += ` ${styles.hide}`)

  const ref = useRef(null)

  useEffect(() => {
    if (!ref || !ref.current) {
      return
    }

    const currentCellElm = document.querySelector(`[data-cell-id="${currentlyOccupiedCell}"]`)
    if (!currentCellElm) {
      console.error('Cell element not found')
      return
    }
    console.log("currentCellElm", currentCellElm)

    // get position of clicked cell
    const { top, left } = currentCellElm.getBoundingClientRect()

    // update transform property of token element
    ref.current.style.transform = `translate(${left}px, ${top}px)`
  }, [currentlyOccupiedCell])

  return (
    <div id="token" className={tokenClassName} ref={ref}></div>
  )
}

export default Token
