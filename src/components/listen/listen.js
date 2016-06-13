import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SoundPlayerContainer from './soundPlayerContainer'
import Player from './player'

import { listenActions } from 'src/core/listen'

class Listen extends Component {

  static propTypes = {
    isPlayerLoaded: PropTypes.bool.isRequired,
    loadPlayerData: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { isPlayerLoaded, loadPlayerData } = this.props
    if (!isPlayerLoaded) {
      loadPlayerData()
    }
  }

  render() {
    const { isPlayerLoaded } = this.props
    if (!isPlayerLoaded) {
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
}

export default connect(state => ({
  isPlayerLoaded: state.listen.isLoaded,
}), listenActions)(Listen)
