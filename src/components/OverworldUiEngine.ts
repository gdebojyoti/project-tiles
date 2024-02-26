import { SUCCESS_TITLES } from '../data/constants'
import GameEngine from './GameEngine'
import Observer from '../interfaces/Observer'

class OverworldUiEngine implements Observer {
  private _gameEngine: GameEngine

  private _modalElm!: HTMLElement
  private _titleElm!: HTMLElement
  private _scoreElm!: HTMLElement
  private _starsContainerElm!: HTMLElement
  private _modalButtonSetElm!: HTMLElement

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
        this.showSuccessModal(data)
        break
    }
  }

  public showSuccessModal ({ score, starCount }: { score: number, starCount: number }): void {
    const title = SUCCESS_TITLES[starCount - 1]

    // update modal content (title, score, stars)
    this._titleElm!.textContent = title
    this._scoreElm!.textContent = `${score}`
    this._starsContainerElm!.innerHTML = Array(starCount).fill(null).map((_, index) => (`<div class="modal__star"></div>`)).join('')

    // show modal
    this._modalElm!.classList.add('modal--visible')
  }

  // private methods
  private init (): void {
    // identify modal elements
    this._modalElm = document.getElementById('success-modal') as HTMLElement
    this._titleElm = document.getElementById('success-modal-header') as HTMLElement
    this._scoreElm = document.getElementById('modal-score') as HTMLElement
    this._starsContainerElm = document.getElementById('success-stars') as HTMLElement
    this._modalButtonSetElm = document.getElementById('modal-button-set') as HTMLElement

    if (!this._modalElm || !this._titleElm || !this._scoreElm || !this._starsContainerElm) {
      console.error('One or more critical UI elements missing')
      throw new Error('One or more critical UI elements missing')
      return
    }

    // add click listener on modal button set
    this.handleModalButtonClick()
  }

  private handleModalButtonClick (): void {
    // if (!Ui._modalButtonSetElm) {
    //   console.error('Modal element or button set element not found')
    //   return
    // }

    this._modalButtonSetElm.addEventListener('click', (event: Event) => {
      // identify button clicked using data attribute (icon)
      const target = event.target as HTMLElement
      const icon = target.getAttribute('data-modal-icon')

      console.log('icon', icon)

      switch (icon) {
        case 'retry':
          // restart the game
          this._gameEngine.restart()
          this.hideSuccessModal()
          break
        case 'next':
          // move to next level
          this._gameEngine.checkAndLoadNextLevel()
          this.hideSuccessModal()
          break
      }
    })
  }

  private hideSuccessModal (): void {
    if (!this._modalElm) {
      console.error('Modal element not found')
      return
    }

    this._modalElm.classList.remove('modal--visible')
  }
}

export default OverworldUiEngine
