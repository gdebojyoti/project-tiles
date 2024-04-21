"use client"

import Header from 'app/components/home/gameScreen/Header'
import PanSurface from 'app/components/common/PanSurface'
import Scene from 'app/components/home/gameScreen/Scene'
import Token from 'app/components/home/gameScreen/Token'
import FooterNav from 'app/components/home/gameScreen/FooterNav'

import useGameEngine from 'app/hooks/useGameEngine'

import styles from './GameScreen.module.css'
import { useEffect } from 'react'

const GameScreen = () => {
  const { mapData, currentlyOccupiedCell, steps, isInProgress, isLevelComplete, onTileClick, onRestart } = useGameEngine()
  // console.log("mapData", mapData)

  useEffect(() => {
    if (!isLevelComplete) {
      return
    }

    alert("Level complete!")
  }, [isLevelComplete])

  return (
    <div id="screen" className={styles.screen}>
      <Header stepCount={steps.length} />

      <PanSurface>
        <Scene mapData={mapData} onTileClick={onTileClick} />
      </PanSurface>
      
      <Token shouldHide={!isInProgress} currentlyOccupiedCell={currentlyOccupiedCell} />

      <FooterNav onRestart={onRestart} />
    </div>
  )
}

export default GameScreen
