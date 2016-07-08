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

    const events = ['pinchStart', 'pinchMove', 'pinchEnd']
    events.forEach((event) => {
      this[event] = new Rx.Subject()
    })

    this.onPinchStart = this.onPinchStart.bind(this)
    this.onPinchEnd = this.onPinchEnd.bind(this)
    this.onPinchMove = this.onPinchMove.bind(this)
    this.setDistanceTarget = this.setDistanceTarget.bind(this)
  }

  componentWillMount() {
    this.handlePinch()
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
            const { distanceTarget, maxDistance, minDistance } = this.state
            const difference = maxDistance - minDistance
            const targetDifference = distanceTarget - minDistance
            const scaleFactor = (targetDifference / difference)

            const delta = b - a
            return delta >= 1 ? delta : delta * 3
          })
          .map(delta => delta * 100)
          .takeUntil(pinchEnd)
      })
      .tap(delta => {
        this.globe.zoom(delta)
      })

    this.pinchSubscription = pinch.subscribe(scale => this.setState({ scale: scale }))
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

  render() {
    const { isConnecting } = this.props
    const className = isConnecting ? 'globe-container connecting' : 'globe-container'

    const options = {
      recognizers: {
        pinch: { enable: true }
      }
    }

    return (
      <Hammer
        options={options}
        onPinchStart={this.onPinchStart}
        onPinchEnd={this.onPinchEnd}
        onPinch={this.onPinchMove}>
        <div
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
