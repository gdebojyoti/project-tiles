import GameEngine from './GameEngine'
import Observer from '../interfaces/Observer'
import Analytics from '../services/Analytics'

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
      case 'CLOSE_GAME':
        this._homeElm.classList.remove('home--hidden')
        break
    }
  }

  // TODO: This is a hack; this file has to be merged with OverworldUiEngine
  showTutorialModal (): void {
    // show tutorial modal
    this.notifyObservers('SHOW_TUTORIAL', {})
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
          // hide self
          this._homeElm.classList.add('home--hidden')
          // start game
          this.notifyObservers('START_GAME', {})
          Analytics.send('START_GAME')
          break
        case 'tutorial':
          // show tutorial
          this.notifyObservers('SHOW_TUTORIAL', {})
          Analytics.send('SHOW_TUTORIAL')
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
