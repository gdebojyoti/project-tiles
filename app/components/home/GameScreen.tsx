import Header from 'app/components/home/gameScreen/Header'
import PanSurface from 'app/components/common/PanSurface'
import Scene from 'app/components/home/gameScreen/Scene'
import Token from 'app/components/home/gameScreen/Token'
import FooterNav from 'app/components/home/gameScreen/FooterNav'

import styles from './GameScreen.module.css'

const GameScreen = () => {
  return (
    <div id="screen" className={styles.screen}>
      <Header />

      <PanSurface>
        <Scene />
      </PanSurface>
      
      <Token shouldHide={false} />

      <FooterNav />
    </div>
  )
}

export default GameScreen
