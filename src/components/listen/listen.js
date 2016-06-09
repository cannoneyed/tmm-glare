import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import SoundPlayerContainer from './soundPlayerContainer'
import Player from './player'

import { listenActions } from 'src/core/listen'

export function Listen({ isPlayerLoaded, loadPlayerData }) {
  if (!isPlayerLoaded) {
    loadPlayerData()
    return <div></div>
  }

  return (
    <div className="g-col">
      <SoundPlayerContainer>
        <Player />
      </SoundPlayerContainer>
    </div>
  )
}

Listen.propTypes = {
  isPlayerLoaded: PropTypes.bool.isRequired,
  loadPlayerData: PropTypes.func.isRequired,
}

export default connect(state => ({
  isPlayerLoaded: state.listen.isLoaded,
}), listenActions)(Listen)
