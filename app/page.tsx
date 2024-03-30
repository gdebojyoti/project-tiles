import React from 'react'

import Logo from 'app/components/home/Logo'
import Nav from 'app/components/home/Nav'
import Footer from 'app/components/home/Footer'

import styles from './page.module.css'

const Home = () => {
  return (
    <div id="home" className={styles.home}>
      <Logo />
      <Nav />
      <Footer />
    </div>
  )
}

export default Home
