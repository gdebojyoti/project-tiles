import styles from './IconButton.module.css'

interface IconButtonProps {
  children: React.ReactNode
  // icon: 'primary' | 'secondary'
  icon: string
  className?: string
}

const IconButton = ({ children, icon, className }: IconButtonProps) => {
  // add classnames, depending upon `icon`
  let iconClassName = styles.button

  className && (iconClassName += ` ${className}`)

  return (
    <button data-icon="tutorial" className={`${iconClassName} button`}>
      <img src={icon} className={styles.icon} />
      {children}
    </button>
  )
}

export default IconButton