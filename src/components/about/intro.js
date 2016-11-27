import React, { Component, PropTypes } from 'react'
import ReactSwipe from 'react-swipe'
import { connect } from 'react-redux'
import map from 'lodash.map'
import range from 'lodash.range'

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
      fadeAway: 1,
    }
  }

  pages = [{
    lines: [
      'Get the album',
      'from someone',
      'who has it'
    ],
    iconType: 'listen',
  }, {
    lines: [
      'Give the album',
      'to someone',
      'who doesn\'t'
    ],
    iconType: 'give',
  }, {
    lines: [
      'You\'ve got',
      'to be',
      'nearby'
    ],
    iconType: 'world',
  }, {
    lines: [
      'So you\'ve got',
      'to allow',
      'geolocation'
    ],
    iconType: 'location'
  }, {
    lines: [
      'Share Glare',
      'to unlock tracks',
      'and content'
    ],
    iconType: 'people',
  }, {
    lines: [
      'With love,'
    ],
    iconType: '',
    showLogo: true,
  }, {
    lines: [],
    iconType: '',
    hideArrow: true,
  }]

  getPage = (i) => {
    if (i >= this.pages.length) {
      return null
    }

    const { lines, iconType, showLogo, hideArrow } = this.pages[i]

    return (
      <div key={i} className="intro-messages">
        <Icon type={iconType} size={50} />
        {lines.map((line, l) => {
          return <h3 key={l}>{line}</h3>
        })}
        { showLogo ? <div className="intro-signoff" /> : null}
        <div className="intro-arrow">
          { hideArrow ? null : <Icon type="chevron-right" size={40} /> }
        </div>
      </div>
    )
  }

  getPages = () => {
    return map(this.pages, (_page, i) => {
      return this.getPage(i)
    })
  }

  goToPage = (index) => {
    const { finishIntro, onComplete, onPageChange } = this.props
    if (index === this.pages.length - 1) {
      return onComplete ? onComplete() : finishIntro()
    }

    if (onPageChange) {
      onPageChange(index)
    }

    this.setState({
      index,
    })
  }

  advancePage = () => {
    this._reactSwipe.next()
  }

  renderProgress = () => {
    const index = this.state.index
    return range(this.pages.length - 1).map((i) => {
      const className = 'progress-icon' + (i === index ? ' passed' : '')
      return <div key={i} className={className} />
    })
  }

  handleSwipe = (p) => {
    const { index } = this.state
    // Only apply the fadeout transition when on the last page, and swiping positive
    if (index !== this.pages.length - 2 || p < 0) {
      return
    }
    const fadeAway = Math.max(1 - 2 * p, 0)
    this.setState({
      fadeAway
    })
  }

  render() {
    const swipeOptions = {
      continuous: false,
      disableScroll: true,
      stopPropagation: true,
      callback: this.goToPage,
      swiping: this.handleSwipe,
    }

    const progressStyle = {
      opacity: this.state.fadeAway,
    }

    return (
      <div className="intro-container" onClick={() => this.advancePage()}>
        <div className="intro-slides">
          <ReactSwipe
            ref={ref => this._reactSwipe = ref}
            className="intro-swipe"
            swipeOptions={swipeOptions}>
            {this.getPages()}
          </ReactSwipe>
        </div>
        <div className="intro-progress" style={progressStyle}>
          {this.renderProgress()}
        </div>
      </div>
    )
  }
}

export default connect(null, appActions)(Intro)
