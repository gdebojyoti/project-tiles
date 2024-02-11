export default function updateCellUi (allCellData) {
  // loop through allCellData; update cell UI for each cell
  allCellData.forEach(cell => {
    const { id, isComplete, dir } = cell

    // get cell element
    const cellElm = document.querySelector(`[data-cell-id="${id}"]`)
    
    // if cell is complete, add color to cell and remove arrow
    if (isComplete) {
      cellElm.classList.add('cell--complete')
      // cellElm.style.backgroundColor = COLORS[dir]
    } else {
      // if cell is incomplete, remove color from cell and add arrow
      cellElm.classList.remove('cell--complete')
    }
  })
}