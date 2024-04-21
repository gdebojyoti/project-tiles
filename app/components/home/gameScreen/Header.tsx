import styles from './Header.module.css'

const Header = ({ stepCount }) => {
  return (
    <header className={styles.header}>
      <div className={styles.stepCounterWrapper}>
        Steps<br /><span id="step-counter" className={styles.stepCounter}>{stepCount}</span>
      </div>

      <span data-icon="mute" className="icon icon--mute"></span>
    </header>
  )
}

export default Header
