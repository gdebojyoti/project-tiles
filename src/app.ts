import './styles/main.css'
import './styles/modals.css'

import GameEngine from './components/GameEngine'
import UiEngine from './components/UiEngine'
import OverworldUiEngine from './components/OverworldUiEngine'

window.onload = async () => {
  const game = new GameEngine()
  new UiEngine(game)
  new OverworldUiEngine(game)
}