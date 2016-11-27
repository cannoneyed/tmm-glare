import React from 'react'

import { Icon } from '../shared'

export default function UseMobile() {
  return (
    <div className="layout-warning-container">
      <div className="layout-warning">
        <Icon type="phone" size={50} />
        <br /><br />
        We've detected you're using a desktop browser.
        <br />
        Please visit glare.fm on a mobile device.
      </div>
    </div>
  )
}
