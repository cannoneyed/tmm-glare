/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'

const Stats = (props) => {
  const { score, maxDistance, sharedWith, total } = props

  const renderSpan = (type, text) => {
    return <span className={`graph-statistic-${type}`}>{text}</span>
  }

  return (
    <div className="graph-overlay">
      <RippleButton
        className="graph-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="world" />
        {renderSpan('description', 'Farthest reach:')}
        {renderSpan('number', `${(maxDistance).toFixed(2)} mi`)}
      </RippleButton>
      <RippleButton
        className="graph-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="give" />
        {renderSpan('description', 'Shared with:')}
        {renderSpan('number', sharedWith)}
      </RippleButton>
      <RippleButton
        className="graph-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="graph" />
        {renderSpan('description', 'Total connections:')}
        {renderSpan('number', total)}
      </RippleButton>
      <RippleButton
        className="graph-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="influence" />
        {renderSpan('description', 'Score:')}
        {renderSpan('number', score)}
      </RippleButton>
    </div>
  )
}

Stats.propTypes = {
  maxDistance: PropTypes.number,
  score: PropTypes.number,
  sharedWith: PropTypes.number,
  total: PropTypes.number,
}

export default connect(state => ({
  score: state.graph.stats.score,
  total: state.graph.stats.total,
  maxDistance: state.graph.stats.maxDistance || 0,
  sharedWith: Object.keys(state.user.connections || {}).length,
}), null)(Stats)
