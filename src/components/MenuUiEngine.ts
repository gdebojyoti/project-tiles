import GameEngine from './GameEngine'
import Observer from '../interfaces/Observer'

class MenuUiEngine implements Observer {
  private _gameEngine: GameEngine

  private _homeElm!: HTMLElement
  private _menuButtonSetElm!: HTMLElement

  constructor (game: GameEngine) {
    this._gameEngine = game
    
    // Add the Ui instance to the observers array
    this._gameEngine.addObserver(this)
    this.init()
  }

  update (msg: string, data: any) {
    // Implementation of update method
    // This method is called by the Game class when it notifies observers
    switch (msg) {
      case 'SHOW_SUCCESS_MODAL':
        // this.showSuccessModal(data)
        break
    }
  }

  // private methods
  private init (): void {
    // identify modal elements
    this._homeElm = document.getElementById('home') as HTMLElement
    this._menuButtonSetElm = document.getElementById('home-button-set') as HTMLElement

    if (!this._homeElm || !this._menuButtonSetElm) {
      console.error('One or more critical UI elements missing')
      throw new Error('One or more critical UI elements missing')
      return
    }

    // add click listener on modal button set
    this.handleButtonClick()
  }

  private handleButtonClick (): void {
    this._menuButtonSetElm.addEventListener('click', (event: Event) => {
      // identify button clicked using data attribute (button)
      const target = event.target as HTMLElement
      const button = target.getAttribute('data-home-button')

      switch (button) {
        case 'start':
          // start game
          console.log("starting game..")
          // hide self
          this._homeElm.classList.add('home--hidden')
          this.notifyObservers('START_GAME', {})
          break
        case 'tutorial':
          // show tutorial
          console.log("showing tutorial..")
          break
      }
    })
  }

  // NOTE: observer pattern implementation

  // Define observers array with the Observer interface
  private observers: Observer[] = []

  // Method to add observers
  addObserver (observer: Observer) {
    this.observers.push(observer)
  }

  // Method to notify observers
  private notifyObservers (msg: string, data: any) {
    this.observers.forEach(observer => observer.update(msg, data))
  }
}

export default MenuUiEngine
