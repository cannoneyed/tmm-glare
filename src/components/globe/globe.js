import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'
import Hammer from 'react-hammerjs'
import Rx from 'rx'

import * as globeActions from 'src/core/globe'

// Default options
const Detector = { webgl: true } // TODO: Add Detector support
import DAT from './dat'

function eventPreventDefault(event) {
  event.preventDefault()
}

class WebGlGlobe extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    setGlobeGlare: PropTypes.func.isRequired,
    shouldGlare: PropTypes.bool.isRequired,
  }

  constructor() {
    super()

    const events = [
      'pinchStart', 'pinchMove', 'pinchEnd',
      'panStart', 'panMove', 'panEnd',
    ]
    events.forEach((event) => {
      this[event] = new Rx.Subject()
    })

    this.state = {
      isGlaring: false,
    }
  }

  componentWillMount() {
    this.handlePinch()
    this.handlePan()
  }

  componentDidMount() {
    const { data } = this.props
    const container = ReactDom.findDOMNode(this._container)

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage()
    } else {
      const opts = {
        imgDir: 'img/',
      }
      const globe = new DAT.Globe(container, opts)

      globe.addData(data, { name: 'globe' })
      globe.createPoints()
      globe.animate()

      this.globe = globe
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.shouldGlare) {
      this.triggerGlare()
    }
  }

  componentWillUnmount() {
    if (this.pinchSubscription) {
      this.pinchSubscription.dispose()
      this.panSubscription.dispose()
    }
  }

  handlePinch = () => {
    let pinchStart = this.pinchStart
    let pinchMove = this.pinchMove
    let pinchEnd = this.pinchEnd

    let pinch = pinchStart
      .tap(eventPreventDefault)
      .flatMap(() => {
        return pinchMove
          .pluck('scale')
          .pairwise()
          .map(([a, b]) => {
            const delta = b - a
            return delta >= 1 ? delta : delta * 7
          })
          .map(delta => delta * 100)
          .takeUntil(pinchEnd)
      })

    this.pinchSubscription = pinch.subscribe(delta => {
      this.globe.zoom(delta)
    })
  }

  handlePan = () => {
    let panStart = this.panStart
    let panMove = this.panMove
    let panEnd = this.panEnd

    let pan = panStart
      .tap(eventPreventDefault)
      .flatMap(() => {
        return panMove
          .pairwise()
          .map(([a, b]) => {
            const deltaX = b.deltaX - a.deltaX
            const deltaY = b.deltaY - a.deltaY
            return { deltaX, deltaY }
          })
          .map(({ deltaX, deltaY }) => {
            const dx = deltaX / this._container.offsetWidth
            const dy = deltaY / this._container.offsetHeight
            return { dx, dy }
          })
          .takeUntil(panEnd)
      })

    panEnd.subscribe(({ velocityX, velocityY }) => {
      this.globe.panRelease(velocityX, velocityY)
    })

    this.panSubscription = pan.subscribe(({ dx, dy }) => {
      this.globe.pan(dx, dy)
    })
  }

  onTouchStart = () => {
    this.globe.touch(true)
  }

  onTouchEnd = () => {
    this.globe.touch(false)
  }

  onPinchStart = (e) => {
    this.pinchStart.onNext(e)
  }

  onPinchEnd = (e) => {
    this.pinchEnd.onNext(e)
  }

  onPinchMove = (e) => {
    this.pinchMove.onNext(e)
  }

  onPanStart = (e) => {
    this.panStart.onNext(e)
  }

  onPanEnd = (e) => {
    this.panEnd.onNext(e)
  }

  onPanMove = (e) => {
    this.panMove.onNext(e)
  }

  triggerGlare = () => {
    const { setGlobeGlare } = this.props

    if (!this.state.isGlaring) {
      this.globe.triggerGlare()
      this.setState({ isGlaring: true })
      setTimeout(() => {
        setGlobeGlare(false)
        this.setState({ isGlaring: false })
      }, 2000)
    }
  }

  render() {
    const { isConnecting } = this.props
    const className = isConnecting ? 'globe-container connecting' : 'globe-container'

    const options = {
      recognizers: {
        pinch: { enable: true }
      },
      threshold: 0,
    }

    return (
      <Hammer
        options={options}
        onPinchStart={this.onPinchStart}
        onPinchEnd={this.onPinchEnd}
        onPinch={this.onPinchMove}
        onPanStart={this.onPanStart}
        onPanEnd={this.onPanEnd}
        onPan={this.onPanMove}
        onDoubleTap={this.triggerGlare}
        vertical={true}>
        <div
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          className={className}
          ref={ref => this._container = ref}>
        </div>
      </Hammer>
    )
  }
}

export default connect(state => ({
  data: state.globe.data,
  isLoaded: state.globe.isLoaded,
  isConnecting: state.connect.isConnecting,
  shouldGlare: state.globe.shouldGlare,
}), {
  setGlobeGlare: globeActions.setGlobeGlare,
})(WebGlGlobe)
