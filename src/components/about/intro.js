import React, { Component, PropTypes } from 'react'
import ReactSwipe from 'react-swipe'
import { connect } from 'react-redux'
import map from 'lodash.map'
import range from 'lodash.range'

import * as appActions from 'src/core/app'
import { getCurrentPage } from 'src/core/selectors/history'
import Icon from '../shared/icon'

class Intro extends Component {

  static propTypes = {
    finishIntro: PropTypes.func.isRequired,
    isAboutPage: PropTypes.bool.isRequired,
    onComplete: PropTypes.func,
    onPageChange: PropTypes.func,
  }

  constructor(props) {
    super()
    this.state = {
      index: 0,
      fadeAway: 1,
    }

    const pages = [{
      lines: [
        <span key={1}>Welcome to glare.fm, the</span>,
        <span key={2}>album prerelease for</span>,
        <span key={3}>The M Machine's <span className="intro-glare">Glare</span></span>,
      ],
      image: 'img/glare.png',
      image2: 'img/stars.png',
    }, {
      lines: [
        <span key={1}>Get the album from someone</span>,
        <span key={2}>who has it, and give the album</span>,
        <span key={3}>to someone who doesn't</span>,
      ],
      image: 'img/headphones.png',
    }, {
      lines: [
        <span key={1}>You need to be right next</span>,
        <span key={2}>to someone to receive or give</span>,
        <span key={3}>the album. So turn on geolocation</span>,
      ],
      image: 'img/satellite.png'
    }, {
      lines: [
        <span key={1}>Watch the album travel across</span>,
        <span key={2}>the globe and unlock content</span>,
        <span key={3}>as you pass it along</span>,
      ],
      image: 'img/constellation.png'
    }, {
      lines: [
        'With love,'
      ],
      showLogo: true,
      image: 'img/stars.png',
    }, {
      lines: [],
      hideArrow: true,
    }]

    if (props.isAboutPage) {
      this.pages = pages.slice(1, pages.length)
    } else {
      this.pages = pages
    }
  }

  getPage = (i) => {
    if (i >= this.pages.length) {
      return null
    }

    const { lines, image, image2, showLogo, hideArrow } = this.pages[i]

    const imageStyle = {
      backgroundImage: `url('${image}')`
    }

    if (image2) {
      imageStyle.backgroundImage += `, url('${image2}')`
    }

    return (
      <div key={i} className="intro-messages">
        { image ? <div className="intro-image" style={imageStyle} /> : null }
        {lines.map((line, l) => {
          return <h5 key={l}>{line}</h5>
        })}
        { showLogo ? <div className="intro-signoff" /> : null}
        <div className="intro-arrow">
          { hideArrow ? null : <Icon type="chevron-right" size={50} /> }
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

export default connect((state) => ({
  isAboutPage: getCurrentPage(state.history) === 'about',
}), appActions)(Intro)
