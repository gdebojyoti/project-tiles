import './styles/main.css'
import './styles/modals.css'

import Game from './components/Game'
// import Engine from './components/Engine'
import Ui from './components/Ui'

window.onload = async () => {
  // const game = new Game()
  // game.init()

  const game = new Game()
  const ui = new Ui(game)
  // const engine = new Engine(game)
}