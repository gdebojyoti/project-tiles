import '../style.css'

import Game from './models/Game'

window.onload = async () => {
  const game = new Game()
  game.init()
}