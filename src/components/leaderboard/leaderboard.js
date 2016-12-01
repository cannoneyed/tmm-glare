import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'

import initNetworkAnimation from '../network-animation'
import Leader from './leader'

import * as leaderboardActions from 'src/core/leaderboard'
import * as modalActions from 'src/core/modals'
const modalTypes = modalActions

class leaderboard extends Component {

  static propTypes = {
    leaderboard: PropTypes.array.isRequired,
    loadLeaderboard: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const container = ReactDom.findDOMNode(this._container)
    this.animation = initNetworkAnimation(container)

    const { loadLeaderboard } = this.props
    loadLeaderboard()
  }

  handleAboutClick = () => {
    const { openModal } = this.props

    openModal({
      kind: modalTypes.ABOUT_LEADERBOARD
    })
  }

  render() {
    const { leaderboard } = this.props

    return (
      <div className="leaderboard-container gradientback" ref={ref => this._container = ref}>
        <div className="fadeOutTop" />
        <div className="leaderboard-list scrollable">
          {leaderboard.map((user, index) => {
            const showBorder = index !== leaderboard.length - 1

            return (
              <Leader
                key={index}
                index={index}
                user={user}
                showBorder={showBorder}
              />
            )
          })}
          <div className="leaderboard-learn-more">
            <span onClick={this.handleAboutClick}>About</span>
          </div>
          <div className="leaderboard-list-spacer" />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  leaderboard: state.leaderboard,
}), {
  loadLeaderboard: leaderboardActions.loadLeaderboardAsync,
  openModal: modalActions.openModal
})(leaderboard)
