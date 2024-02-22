import './styles/main.css'
import './styles/modals.css'

import Game from './models/Game'

window.onload = async () => {
  const game = new Game()
  game.init()
}