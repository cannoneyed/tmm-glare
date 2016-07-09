import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'
import Hammer from 'react-hammerjs'
import Rx from 'rx'

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
  }

  constructor() {
    super()
    this.state = {
      maxDistance: 1000,
      minDistance: 350,
      distanceTarget: 700,
    }

    const events = [
      'pinchStart', 'pinchMove', 'pinchEnd',
      'panStart', 'panMove', 'panEnd',
    ]
    events.forEach((event) => {
      this[event] = new Rx.Subject()
    })

    this.onPinchStart = this.onPinchStart.bind(this)
    this.onPinchEnd = this.onPinchEnd.bind(this)
    this.onPinchMove = this.onPinchMove.bind(this)
    this.onPanStart = this.onPanStart.bind(this)
    this.onPanEnd = this.onPanEnd.bind(this)
    this.onPanMove = this.onPanMove.bind(this)
    this.setDistanceTarget = this.setDistanceTarget.bind(this)

    this.handlePinch = this.handlePinch.bind(this)
    this.handlePan = this.handlePan.bind(this)

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
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
        maxDistance: this.state.maxDistance,
        minDistance: this.state.minDistance,
        distanceTarget: this.state.distanceTarget,
        setDistanceTarget: this.setDistanceTarget,
      }
      const globe = new DAT.Globe(container, opts)

      globe.addData(data, { name: 'globe' })
      globe.createPoints()
      globe.animate()

      this.globe = globe
    }
  }

  componentWillUnmount() {
    if (this.pinchSubscription) {
      this.pinchSubscription.dispose()
      this.panSubscription.dispose()
    }
  }

  setDistanceTarget(distanceTarget) {
    this.setState({ distanceTarget })
  }

  handlePinch() {
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

  handlePan() {
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

  onTouchStart() {
    this.globe.touch(true)
  }

  onTouchEnd() {
    this.globe.touch(false)
  }

  onPinchStart(e) {
    this.pinchStart.onNext(e)
  }

  onPinchEnd(e) {
    this.pinchEnd.onNext(e)
  }

  onPinchMove(e) {
    this.pinchMove.onNext(e)
  }

  onPanStart(e) {
    this.panStart.onNext(e)
  }

  onPanEnd(e) {
    this.panEnd.onNext(e)
  }

  onPanMove(e) {
    this.panMove.onNext(e)
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
  isConnecting: state.connection.isConnecting,
}), null)(WebGlGlobe)
