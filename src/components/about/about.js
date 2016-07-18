import React from 'react'
import Intro from './intro'
import { browserHistory } from 'react-router'

const About = () => {
  return (
    <Intro
      onComplete={() => {
        setTimeout(() => {
          browserHistory.goBack()
        }, 300)
      }}
    />
  )
}


export default About
