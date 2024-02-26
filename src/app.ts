import './styles/main.css'
import './styles/modals.css'

// import GameEngine from './components/GameEngine'
import UiEngine from './components/UiEngine'

window.onload = async () => {
  // const game = new GameEngine()
  new UiEngine()
}