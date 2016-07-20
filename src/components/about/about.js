import React from 'react'
import Intro from './intro'
import { browserHistory } from 'react-router'

const About = () => {
  const r = Math.floor(Math.random() * 6)

  return (
    <div className={`about-container background-${r}`}>
      <Intro
        onComplete={() => {
          setTimeout(() => {
            browserHistory.goBack()
          }, 300)
        }}
      />
    </div>
  )
}


export default About
