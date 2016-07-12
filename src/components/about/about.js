import React from 'react'
import { connect } from 'react-redux'

const Intro = () => {
  return (
    <h1>FUCK YOU</h1>
  )
}

export default connect(state => ({
  isConnecting: state.connection.isConnecting,
  isGlobeLoaded: state.globe.isLoaded,
  beacons: state.connection.beacons,
  user: state.user,
}), null)(Intro)
