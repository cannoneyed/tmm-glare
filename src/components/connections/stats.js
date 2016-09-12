/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Icon, RippleButton } from '../shared'

const Stats = (props) => {
  const { influence, maxDistance, sharedWith, total } = props

  const renderSpan = (type, text) => {
    return <span className={`connections-statistic-${type}`}>{text}</span>
  }

  return (
    <div className="connections-overlay">
      <RippleButton
        className="connections-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="world" />
        {renderSpan('description', 'Farthest reach:')}
        {renderSpan('number', `${(maxDistance).toFixed(2)} mi`)}
      </RippleButton>
      <RippleButton
        className="connections-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="give" />
        {renderSpan('description', 'Shared with:')}
        {renderSpan('number', sharedWith)}
      </RippleButton>
      <RippleButton
        className="connections-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="connections" />
        {renderSpan('description', 'Total connections:')}
        {renderSpan('number', total)}
      </RippleButton>
      <RippleButton
        className="connections-statistic"
        onClick={() => {
          setTimeout(() => {}, 200)
        }}>
        <Icon type="influence" />
        {renderSpan('description', 'Influence:')}
        {renderSpan('number', influence)}
      </RippleButton>
    </div>
  )
}

Stats.propTypes = {
  influence: PropTypes.number,
  maxDistance: PropTypes.number,
  sharedWith: PropTypes.number,
  total: PropTypes.number,
}

export default connect(state => ({
  influence: state.connections.stats.score,
  total: state.connections.stats.total,
  maxDistance: state.connections.stats.maxDistance || 0,
  sharedWith: Object.keys(state.user.connections || {}).length,
}), null)(Stats)
