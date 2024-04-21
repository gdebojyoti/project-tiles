import IconButton from 'app/components/core/IconButton'

import styles from './FooterNav.module.css'

const FooterNav = ({ onRestart }) => {
  return (
    <nav className={styles.nav}>
      <IconButton icon='/icons/how.png' className={styles.icon}>Help</IconButton>
      <IconButton icon='/icons/undo.png' className={styles.icon}>Undo</IconButton>
      <IconButton icon='/icons/restart.png' className={styles.icon} onClick={onRestart}>Restart</IconButton>
      <IconButton icon='/icons/home.png' className={styles.icon}>Home</IconButton>
      {/* <span data-icon="settings" className="icon icon--settings icon--disabled">Settings</span> */}
    </nav>
  )
}

export default FooterNav
