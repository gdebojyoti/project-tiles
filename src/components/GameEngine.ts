import CellData from '../types/CellData'
import Observer from '../interfaces/Observer'

class GameEngine {
  private _currentLevel: number = 1
  private _mapData: any = null
  
  private _currentlyOccupiedCell: string = ''
  private _allCellData: CellData[] = []
  private _steps: string[] = [] // maintain the steps taken by the user, to support "undo"
  private _isInProgress = false
  private _tokenElm: HTMLElement | null = null

  constructor () {
    // load map
    this.loadMap(this._currentLevel)
  }

  // NOTE: public methods

  updateTokenPosition (): void {
    this._notifyObservers('UPDATE_TOKEN', {
      cellId: this._currentlyOccupiedCell
    })
  }

  // NOTE: private methods

  // Method to load map
  private async loadMap (level: number): Promise<void> {
    console.log("level", level)

    // sample map data for the game
    let mapData = null

    switch (level) {
      case 1:
        mapData = await import('../data/maps/level-1.json')
        break
      case 2:
        mapData = await import('../data/maps/level-2.json')
        break
      case 3:
        mapData = await import('../data/maps/level-3.json')
        break
    }

    this._mapData = mapData?.default

    this._notifyObservers('INIT_SCENE', {
      isFirstStart: true,
      mapData: this._mapData
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
  private _notifyObservers (msg: string, data: any) {
    this.observers.forEach(observer => observer.update(msg, data))
  }
}

export default GameEngine
