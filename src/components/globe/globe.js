import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'

const Detector = { webgl: true } // TODO: Add Detector support
import DAT from './dat'

class WebGlGlobe extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    isConnecting: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { data } = this.props
    const container = ReactDom.findDOMNode(this._container)

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage()
    } else {
      const opts = { imgDir: 'img/' }
      const globe = new DAT.Globe(container, opts)

      globe.addData(data, { name: 'globe' })
      globe.createPoints()
      globe.animate()
    }
  }

  // shouldComponentUpdate() {
  //   return false
  // }

  render() {
    const { isConnecting } = this.props
    const className = isConnecting ? 'globe-container connecting' : 'globe-container'

    return (
      <div
        className={className}
        ref={ref => this._container = ref}>
      </div>
    )
  }
}

export default connect(state => ({
  data: state.globe.data,
  isLoaded: state.globe.isLoaded,
  isConnecting: state.connection.isConnecting,
}), null)(WebGlGlobe)
