import styles from './PanSurface.module.css'

const PanSurface = ({ children }) => {
  return (
    <div id="pan-surface" className={styles.panSurface}>
      {children}
    </div>
  )
}

export default PanSurface