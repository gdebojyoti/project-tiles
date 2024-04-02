import styles from './Token.module.css'

const Token = ({ shouldHide }) => {
  let tokenClassName = styles.token

  shouldHide && (tokenClassName += ` ${styles.hide}`)

  return (
    <div id="token" className={tokenClassName}></div>
  )
}

export default Token
