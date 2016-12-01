import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Icon } from '../shared'
import * as modalActions from 'src/core/modals'

const AboutLeaderboard = ({ score }) => {

  return (
    <div className="about-leaderboard-content">
      <span>
        <Icon type="graph" size={80} /><br />
        Current score: <span className="about-leaderboard-score">{score}</span>
        <br /><br />
        Your score is the total of all track plays by everyone in your network
        <br /><br />
        Everyone you've given Glare to, everyone they've given Glare to, and so on!
      </span>
    </div>
  )
}

AboutLeaderboard.propTypes = {
  closeModal: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired
}

export default connect((state) => ({
  score: state.graph.stats.score,
}), {
  closeModal: modalActions.closeModal,
})(AboutLeaderboard)
