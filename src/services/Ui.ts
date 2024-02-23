import { SUCCESS_TITLES } from '../data/constants'

abstract class Ui {
  private static _modalElm: HTMLElement | null
  private static _titleElm: HTMLElement | null
  private static _scoreElm: HTMLElement | null
  private static _starsContainerElm: HTMLElement | null
  private static _modalButtonSetElm: HTMLElement | null

  public static init ({ onRestart, onNextLevel }: { onRestart: (() => void) | undefined, onNextLevel: (() => void) | undefined }): void {
    // identify modal elements
    Ui._modalElm = document.getElementById('success-modal')
    Ui._titleElm = document.getElementById('success-modal-header')
    Ui._scoreElm = document.getElementById('modal-score')
    Ui._starsContainerElm = document.getElementById('success-stars')
    Ui._modalButtonSetElm = document.getElementById('modal-button-set')

    if (!Ui.checkForElements()) {
      return
    }

    // add click listener on modal button set
    Ui.handleModalButtonClick({ onRestart, onNextLevel })
  }

  public static showSuccessModal ({ score, starCount }: { score: number, starCount: number }): void {
    if (!Ui.checkForElements()) {
      return
    }

    const title = SUCCESS_TITLES[starCount - 1]

    // update modal content (title, score, stars)
    Ui._titleElm!.textContent = title
    Ui._scoreElm!.textContent = `${score}`
    Ui._starsContainerElm!.innerHTML = Array(starCount).fill(null).map((_, index) => (`<div class="modal__star"></div>`)).join('')

    // show modal
    Ui._modalElm!.classList.add('modal--visible')
  }

  private static checkForElements (): boolean {
    if (!Ui._modalElm || !Ui._titleElm || !Ui._scoreElm || !Ui._starsContainerElm) {
      console.error('One or more critical UI elements missing')
      return false
    }

    return true
  }

  private static handleModalButtonClick ({ onRestart, onNextLevel }: { onRestart: (() => void) | undefined, onNextLevel: (() => void) | undefined }): void {
    if (!Ui._modalButtonSetElm) {
      console.error('Modal element or button set element not found')
      return
    }

    Ui._modalButtonSetElm.addEventListener('click', (event: Event) => {
      // identify button clicked using data attribute (icon)
      const target = event.target as HTMLElement
      const icon = target.getAttribute('data-modal-icon')

      console.log('icon', icon)

      switch (icon) {
        case 'retry':
          // restart the game
          onRestart && onRestart()
          Ui.hideSuccessModal()
          break
        case 'next':
          // move to next level
          onNextLevel && onNextLevel()
          Ui.hideSuccessModal()
          break
      }
    })
  }

  private static hideSuccessModal (): void {
    if (!Ui._modalElm) {
      console.error('Modal element not found')
      return
    }

    Ui._modalElm.classList.remove('modal--visible')
  }
}

export default Ui