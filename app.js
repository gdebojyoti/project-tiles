console.log("I got in!")

// configuration values for the game
const CONFIG = {
  TILE_SIZE: 50,
  TILE_GAP: 10
}

// directions
const DIR = {
	LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down'
}

// access colors from CSS variables
const computedStyle = getComputedStyle(document.documentElement)
const COLORS = {
  [DIR.LEFT]: computedStyle.getPropertyValue('--azure'),
  [DIR.RIGHT]: computedStyle.getPropertyValue('--crimson'),
  [DIR.UP]: computedStyle.getPropertyValue('--amber'),
  [DIR.DOWN]: computedStyle.getPropertyValue('--emerald')
}

const IMAGE_PATHS = {
  [DIR.LEFT]: './assets/blue.png',
  [DIR.RIGHT]: './assets/red.png',
  [DIR.UP]: './assets/yellow.png',
  [DIR.DOWN]: './assets/green.png'
}

// sample map data for the game
const sampleMapData = {
  positionCompensation: {
    x: 0,
    y: -30
  },
  cells: [
    {
      isBase: true,
      col: 1,
      row: 1
    },
    {
      col: 1,
      row: 2,
      dir: DIR.UP
    },
    {
      col: 2,
      row: 2,
      dir: DIR.RIGHT
    },
    {
      col: 3,
      row: 2,
      dir: DIR.RIGHT
    },
    {
      col: 4,
      row: 2,
      dir: DIR.RIGHT
    },
    {
      col: 4,
      row: 3,
      dir: DIR.UP
    },
    {
      col: 4,
      row: 4,
      dir: DIR.UP
    },
    {
      col: 3,
      row: 4,
      dir: DIR.LEFT
    },
    {
      col: 2,
      row: 4,
      dir: DIR.LEFT
    },
    {
      col: 1,
      row: 4,
      dir: DIR.DOWN
    },
    {
      col: 1,
      row: 5,
      dir: DIR.LEFT
    },
    {
      col: 2,
      row: 5,
      dir: DIR.UP
    }
  ]
}

function initScene (mapData) {
  const { TILE_SIZE, TILE_GAP } = CONFIG
  const { positionCompensation, cells } = mapData

  // get scene element
  const sceneElm = document.getElementById('scene')

  // identify highest column
  const highestCol = cells.reduce((acc, data) => {
    return data.col > acc ? data.col : acc
  }, 0)

  // identify highest row
  const highestRow = cells.reduce((acc, data) => {
    return data.row > acc ? data.row : acc
  }, 0)

  // set scene width & height
  sceneElm.style.width = `${highestCol * (TILE_SIZE + TILE_GAP)}px`
  sceneElm.style.height = `${highestRow * (TILE_SIZE + TILE_GAP)}px`

  // add position compensation to scene's transform property
  sceneElm.style.transform = `${getComputedStyle(sceneElm).transform} translate(${positionCompensation.x}px, ${positionCompensation.y}px)`

  // loop through cells data; create & add cells to scene
  cells.forEach(data => {
    const cellElm = createCell(data, highestRow)
    sceneElm.appendChild(cellElm)
  })
}

function createCell (data, highestRow) {
  const { TILE_SIZE, TILE_GAP } = CONFIG
  const { row, col, dir } = data
  
  // create cell element
  const cellElm = document.createElement('div')

  // add class & style to cell element
  cellElm.classList.add('cell')
  cellElm.style.width = `${TILE_SIZE}px`
  cellElm.style.height = `${TILE_SIZE}px`

  // using `left` & `top` properties since `transform` will be used for animation
  cellElm.style.left = `${(col - 1) * (TILE_SIZE + TILE_GAP)}px`
  cellElm.style.top = `${(highestRow - row) * (TILE_SIZE + TILE_GAP)}px`
  
  // delay animation as the distance from "base" cell increases
  cellElm.style.animationDelay = `${(row + col) * 0.05}s`

  // if direction exists, add arrow to cell
  if (dir) {
    // create image element to indicate direction in the cell
    const imgElm = document.createElement('img')
    
    // add class & style to image element
    imgElm.classList.add('arrow')
    switch (dir) {
      case DIR.LEFT:
        imgElm.src = IMAGE_PATHS[DIR.LEFT]
        imgElm.style.transform = 'rotate(-90deg)'
        break
      case DIR.RIGHT:
        imgElm.src = IMAGE_PATHS[DIR.RIGHT]
        imgElm.style.transform = 'rotate(90deg)'
        break
      case DIR.UP:
        imgElm.src = IMAGE_PATHS[DIR.UP]
        break
      case DIR.DOWN:
        imgElm.src = IMAGE_PATHS[DIR.DOWN]
        imgElm.style.transform = 'rotate(180deg)'
        break
    }
    
    // add image element to cell element
    cellElm.appendChild(imgElm)
  } else {
    // if direction does not exist, add color to cell
    cellElm.classList.add('cell--base')
  }

  return cellElm
}

function initButtons () {
  // get all UI elements with icon data attributes
  const iconElms = document.querySelectorAll('[data-icon]')

  // loop through icon elements; add click event listener
  iconElms.forEach(elm => {
    elm.addEventListener('click', () => {
      const icon = elm.getAttribute('data-icon')

      switch (icon) {
        case 'mute':
          // toggle mute icon by toggling "icon--mute" & "icon--unmute" classes
          elm.classList.toggle('icon--mute')
          elm.classList.toggle('icon--unmute')
          break
        default:
          console.log('icon clicked:', icon)
      }
    })
  })
}

initScene(sampleMapData)
initButtons()