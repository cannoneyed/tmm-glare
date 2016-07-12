import React from 'react'
import { connect } from 'react-redux'

const Intro = () => {
  return (
    <div className="intro-container">
      <h1>FUCK YOU</h1>
    </div>
  )
}

export default connect(state => ({
  isConnecting: state.connection.isConnecting,
  isGlobeLoaded: state.globe.isLoaded,
  beacons: state.connection.beacons,
  user: state.user,
}), null)(Intro)
