// import { CONFIG } from '../data/constants'
// import Cell from './Cell'
// import UiService from '../services/Ui'

import Observer from '../interfaces/Observer'
import MapData from '../types/MapData'
import Engine from './Engine'

class Game {
  private _currentLevel: number = 1
  private _mapData: MapData | undefined
  private _engine: Engine

  constructor () {
    this.init()
    this._engine = new Engine(this)
    // this._engine = new Engine(this, this._mapData.cells)
  }

  restart (): void {
    this.notifyObservers('INIT_SCENE', { mapData: this._mapData})
    this._engine.restart()
  }

  undo (): void {
    this._engine.undo()
  }

  updateTokenPosition (): void {
    this._engine.updateTokenPosition()
  }

  private async init (): Promise<void> {
    console.log("I got in!")
    
    try {
      // load the first map
      await this.loadMap(this._currentLevel)
      console.log("mapData", this._mapData)

      this.notifyObservers('INIT_SCENE', { isFirstStart: true, mapData: this._mapData})
    } catch (error) {
      console.error('Error loading map:', error)
    }
  }

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
  }

  // NOTE: observer architecture

  // Define observers array with the Observer interface
  private observers: Observer[] = []

  // Method to add observers
  addObserver(observer: Observer) {
    this.observers.push(observer)
  }

  // Method to notify observers
  notifyObservers(msg: string, data: any) {
    this.observers.forEach(observer => observer.update(msg, data))
  }
}

export default Game