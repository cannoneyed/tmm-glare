/* eslint-disable react/no-multi-comp */
import React, { PropTypes } from 'react'

import { Icon, RippleButton } from '../shared'

export default function Stats(props) {
  const { maximumDistance, sharedWith, graphSize } = props

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
        {renderSpan('description', 'Farthest connection:')}
        {renderSpan('number', maximumDistance)}
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
        {renderSpan('number', graphSize)}
      </RippleButton>
    </div>
  )
}

Stats.propTypes = {
  graphSize: PropTypes.number,
  maximumDistance: PropTypes.string,
  sharedWith: PropTypes.number,
}
