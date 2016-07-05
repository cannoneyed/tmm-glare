import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'

const Detector = { webgl: true } // TODO: Add Detector support
import DAT from './dat'

class WebGlGlobe extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { data } = this.props
    const container = ReactDom.findDOMNode(this._container)

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage()
    } else {
      const opts = { imgDir: 'img/' }
      const globe = new DAT.Globe(container, opts)

      globe.addData(data, {format: 'magnitude', name: 'test' })
      globe.createPoints()
      globe.animate()
    }
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div
        className="container"
        ref={ref => this._container = ref}>
      </div>
    )
  }
}

export default connect(state => ({
  data: state.globe.data,
  isLoaded: state.globe.isLoaded,
}), null)(WebGlGlobe)
