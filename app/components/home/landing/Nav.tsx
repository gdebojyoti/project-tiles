import styles from './Nav.module.css'

import Button from 'app/components/core/Button'

const Nav = () => {
  return (
    <div className={styles.nav}>
      <Button type="primary" className={styles.button}>Start Game</Button>
      <Button type="secondary" className={styles.button}>How to Play</Button>
    </div>
  )
}

export default Nav
