import React from 'react'

import { Icon } from '../shared'

export default function Landscape() {
  return (
    <div className="layout-warning-container">
      <div className="layout-warning">
        <Icon type="rotate" size={50} />
        <br /><br />
        Glare.fm is designed to be used in portrait orientation.
        <br />
        Please rotate your mobile device.
      </div>
    </div>
  )
}
