import Logo from 'app/components/home/landing/Logo'
import Nav from 'app/components/home/landing/Nav'
import Footer from 'app/components/home/landing/Footer'

import styles from './Landing.module.css'

const Landing = () => {
  return (
    <div id="home" className={styles.landing}>
      <Logo />
      <Nav />
      <Footer />
    </div>
  )
}

export default Landing
