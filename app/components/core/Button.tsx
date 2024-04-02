import styles from './Button.module.css'

const Button = ({ children, type, className }) => {
  // add classnames, depending upon `type`
  let buttonClassName = styles.button

  switch (type) {
    case 'primary':
      buttonClassName += ` ${styles.primary}`
      break
    case 'secondary':
      buttonClassName += ` ${styles.secondary}`
      break
  }

  className && (buttonClassName += ` ${className}`)

  return (
    <button className={`${buttonClassName} button`}>{children}</button>
  )
}

export default Button
