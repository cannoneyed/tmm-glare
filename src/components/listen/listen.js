import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SoundPlayerContainer from './soundPlayerContainer'
import Player from './player'

import * as listenActions from 'src/core/listen'
import * as appActions from 'src/core/app'

class Listen extends Component {

  static propTypes = {
    background: PropTypes.number.isRequired,
    isPlayerLoaded: PropTypes.bool.isRequired,
    loadPlayerDataAsync: PropTypes.func.isRequired,
    setRandomBackground: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { isPlayerLoaded, loadPlayerDataAsync, setRandomBackground } = this.props

    setRandomBackground()
    if (!isPlayerLoaded) {
      loadPlayerDataAsync()
    }
  }

  render() {
    const { background, isPlayerLoaded } = this.props
    if (!isPlayerLoaded) {
      return <div></div>
    }

    return (
      <div className={`listen-container background-${background}`}>
        <SoundPlayerContainer>
          <Player />
        </SoundPlayerContainer>
      </div>
    )
  }
}

export default connect(state => ({
  isPlayerLoaded: state.listen.isLoaded,
  background: state.app.background,
}), {
  loadPlayerDataAsync: listenActions.loadPlayerDataAsync,
  setRandomBackground: appActions.setRandomBackground,
})(Listen)
