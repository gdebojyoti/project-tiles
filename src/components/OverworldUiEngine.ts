import { SUCCESS_TITLES } from '../data/constants'
import GameEngine from './GameEngine'
import MenuUiEngine from './MenuUiEngine'
import Observer from '../interfaces/Observer'

class OverworldUiEngine implements Observer {
  private _gameEngine: GameEngine
  private _menuUiEngine: MenuUiEngine

  private _modalElm!: HTMLElement
  private _titleElm!: HTMLElement
  private _scoreElm!: HTMLElement
  private _starsContainerElm!: HTMLElement
  private _modalButtonSetElm!: HTMLElement

  private _commonModalElm!: HTMLElement

  constructor (game: GameEngine, menuUi: MenuUiEngine) {
    this._gameEngine = game
    this._menuUiEngine = menuUi
    
    // Add the Ui instance to the observers array
    this._gameEngine.addObserver(this)
    this._menuUiEngine.addObserver(this)

    this.init()
  }

  update (msg: string, data: any) {
    // Implementation of update method
    // This method is called by the Game class when it notifies observers
    switch (msg) {
      case 'SHOW_SUCCESS_MODAL':
        this.showSuccessModal(data)
        break
      case 'SHOW_TUTORIAL':
        this.showTutorialModal()
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

    this._commonModalElm = document.getElementById('common-modal') as HTMLElement

    if (!this._modalElm || !this._titleElm || !this._scoreElm || !this._starsContainerElm || !this._commonModalElm) {
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

  private showTutorialModal (): void {
    // decide modal title
    const title = 'How to play'
    
    // decide modal content
    const content = `
      <ul>
        <li>
          <strong>Click tile</strong> to <strong>move token</strong>.
        </li>
        <li>
          Only <strong>adjacent tiles</strong> can be clicked.
        </li>
        <li>
          If <strong>direction</strong> on tile <strong>matches</strong> token's direction, the tile will be <strong>highlighted</strong>.
        </li>
        <li>
          <strong>Highlight all tiles</strong> to complete the level.
        </li>
      </ul>
    `

    // decide modal buttons
    const buttonData = [
      // { label: 'Retry', icon: 'retry', helperClasses: ['modal__button--restart'] },
      // { label: 'Previous', icon: 'previous', helperClasses: ['modal__button--previous'] },
      // { label: 'Next', icon: 'next', helperClasses: ['modal__button--next'] }
      { label: 'Okay', icon: 'okay', helperClasses: ['modal__button--okay', 'modal__button--primary'] }
    ]
    const buttons = generateButtons(buttonData)

    // generate and render modal
    this.generateAndRenderModal(title, content, buttons)

    // add click listener on modal button set
    this.handleCommonModalButtonClick()
  }

  // TODO: This is auto-generated code; refactor it
  private handleCommonModalButtonClick (): void {
    this._commonModalElm.addEventListener('click', (event: Event) => {
      // identify button clicked using data attribute (icon)
      const target = event.target as HTMLElement
      const icon = target.getAttribute('data-modal-icon')

      switch (icon) {
        case 'okay':
          // hide the modal
          this._commonModalElm.classList.remove('modal--visible')
          break
      }
    })
  }

  private generateAndRenderModal (title: string, content: string, buttons: string): void {
    // get header element using data attr and update title
    const headerElm = this._commonModalElm.querySelector('[data-modal-part="header"]') as HTMLElement
    headerElm.textContent = title

    // get content element using data attr and update content
    const contentElm = this._commonModalElm.querySelector('[data-modal-part="body"]') as HTMLElement
    contentElm.innerHTML = content

    // get button set element using data attr and update buttons
    const buttonSetElm = this._commonModalElm.querySelector('[data-modal-part="footer"]') as HTMLElement
    buttonSetElm.innerHTML = buttons

    // show modal
    this._commonModalElm.classList.add('modal--visible')
  }
}

// get the list of buttons
function generateButtons (buttonData: any): string {
  return buttonData.map((button: any) => {
    return `
      <button class="modal__button ${button.helperClasses.join(' ')}" data-modal-icon="${button.icon}">
        ${button.label}
      </button>
    `
  }).join('')
}

export default OverworldUiEngine
