import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'

import initNetworkAnimation from '../network-animation'
import Leader from './leader'

import * as leaderboardActions from 'src/core/leaderboard'
import * as notificationActions from 'src/core/notifications'

class leaderboard extends Component {

  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    leaderboard: PropTypes.array.isRequired,
    loadLeaderboard: PropTypes.func.isRequired,
    notificationsCount: PropTypes.number.isRequired,
  }

  componentDidMount() {
    const container = ReactDom.findDOMNode(this._container)
    this.animation = initNetworkAnimation(container)

    const { loadLeaderboard } = this.props
    loadLeaderboard()
  }

  handleAboutClick = () => {
    const { addNotification, notificationsCount } = this.props

    // Don't display the unlock notification if a notification is present
    if (notificationsCount) {
      return
    }

    const content = (
      <span>
        Your score is the total of all track plays by everyone in your network -
        <br /><br />
        Everyone you've given Glare to, everyone they've given Glare to, and so on!
      </span>
    )

    addNotification({
      message: content,
      kind: 'success',
      dismissAfter: 4000,
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
  notificationsCount: state.notifications.length,
}), {
  loadLeaderboard: leaderboardActions.loadLeaderboardAsync,
  addNotification: notificationActions.addNotification
})(leaderboard)
