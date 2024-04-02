import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.stepCounterWrapper}>
        Steps<br /><span id="step-counter" className={styles.stepCounter}>0</span>
      </div>

      <span data-icon="mute" className="icon icon--mute"></span>
    </header>
  )
}

export default Header
