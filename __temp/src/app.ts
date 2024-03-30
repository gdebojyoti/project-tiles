import './styles/main.css'
import './styles/home.css'
import './styles/modals.css'

import GameEngine from './components/GameEngine'
import MenuUiEngine from './components/MenuUiEngine'
import UiEngine from './components/UiEngine'
import OverworldUiEngine from './components/OverworldUiEngine'

window.onload = async () => {
  const game = new GameEngine()
  const menuUi = new MenuUiEngine(game)
  new UiEngine(game, menuUi)
  new OverworldUiEngine(game, menuUi)
}
