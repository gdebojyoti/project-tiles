import Game from './Game'

class Engine {
  private _game: Game

  constructor (game: Game) {
    this._game = game
  }

  moveTokenToBaseCell() {
    // Existing logic...
    // Update game state through the Game class
    // this.game.updateCompletionStatus()
  }

  updateCompletionStatus() {
    // Existing logic...
    // this.game.updateCompletionStatus()
  }

  undo () {}

  restart () {}

  updateTokenPosition () {}
}

export default Engine