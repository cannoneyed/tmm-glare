import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import SoundPlayerContainer from './soundPlayerContainer'
import Player from './player'

import { listenActions } from 'src/core/listen'

export function Listen({ isInfoLoaded, listenInfo, loadPlaylistInfo}) {
  if (!isInfoLoaded) {
    loadPlaylistInfo()
    return <div></div>
  }

  const { clientId, resolveUrl } = listenInfo

  return (
    <div className="g-col">
      <SoundPlayerContainer {...{ clientId, resolveUrl }}>
        <Player />
      </SoundPlayerContainer>
    </div>
  )
}

Listen.propTypes = {
  isInfoLoaded: PropTypes.bool.isRequired,
  listenInfo: PropTypes.object,
  loadPlaylistInfo: PropTypes.func.isRequired,
}

export default connect(state => ({
  isInfoLoaded: state.listen.isLoaded,
  listenInfo: state.listen.info,
}), listenActions)(Listen)
