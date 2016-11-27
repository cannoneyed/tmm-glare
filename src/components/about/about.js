import React, { Component } from 'react'
import ReactDom from 'react-dom'
import Intro from './intro'
import { browserHistory } from 'react-router'
import initNetworkAnimation from '../network-animation'

class About extends Component {
  componentDidMount() {
    const container = ReactDom.findDOMNode(this._container)
    this.animation = initNetworkAnimation(container)
  }

  render() {

    return (
      <div
        className={'about-container background-0'}
        ref={(ref) => this._container = ref} >
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
}


export default About
