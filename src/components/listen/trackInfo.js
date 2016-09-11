/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react'
// import { Icon } from '../shared'

class TrackInfo extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    index: PropTypes.number,
    time: PropTypes.string.isRequired,
  }

  render() {
    const {
      // index,
      time,
    } = this.props
    // const { router } = this.context

    // const goToDetailsPage = () => {
    //   setTimeout(() => {
    //     router.push(`/tracks/${index}`)
    //   }, 300)
    // }

    return (
      <span className="track-info">
        <span className="time">{time}</span>
        {/* <span
          className="track-button"
          onClick={goToDetailsPage}>
          <Icon type="chevron-right" size={35} />
        </span> */}
      </span>
    )
  }
}

export default TrackInfo
