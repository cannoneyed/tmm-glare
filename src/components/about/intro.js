import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import * as appActions from 'src/core/app'
import Icon from '../shared/icon'

class Intro extends Component {

  static propTypes = {
    finishIntro: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    onPageChange: PropTypes.func,
  }

  constructor() {
    super()
    this.state = {
      index: 0,
    }
  }

  pages = [{
    lines: ['Get the album', 'from someone', 'who has it'],
    iconType: 'listen',
  }, {
    lines: ['Give the album', 'to someone', 'who doesn\'t'],
    iconType: 'give',
  }, {
    lines: ['You\'ve got', 'to be', 'nearby'],
    iconType: 'world',
  }, {
    lines: ['So you\'ve got', 'to allow', 'geolocation'],
    iconType: 'location'
  }, {
    lines: ['Remember, you', 'can only give', 'to 5 people'],
    iconType: 'people',
  }, {
    lines: ['With love'],
    iconType: '',
  }]

  getPage = (i) => {
    if (i >= this.pages.length) {
      return null
    }

    const { lines, iconType } = this.pages[i]
    const last = i === this.pages.length - 1

    return (
      <div className="intro-messages">
        <Icon type={iconType} size={50} />
        {lines.map((line, index) => {
          return <h3 key={index}>{line}</h3>
        })}
        { last ? <div className="intro-signoff" /> : null}
      </div>
    )
  }

  advancePage = () => {
    const { finishIntro, onComplete, onPageChange } = this.props
    if (this.state.index === this.pages.length - 1) {
      return onComplete ? onComplete() : finishIntro()
    }

    if (onPageChange) {
      onPageChange(this.state.index + 1)
    }

    this.setState({
      index: this.state.index + 1
    })
  }

  renderProgress = () => {
    const index = this.state.index
    return _.range(this.pages.length).map((i) => {
      const className = 'progress-icon' + (i === index ? ' passed' : '')
      return <div key={i} className={className} />
    })
  }

  render() {
    const page = this.getPage(this.state.index)

    return (
      <div className="intro-container" onClick={() => this.advancePage()}>
        { page }
        <div className="intro-progress">
          {this.renderProgress()}
        </div>
      </div>
    )
  }
}

export default connect(null, appActions)(Intro)
