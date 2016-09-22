import React from 'react'

import { Icon } from '../shared'

export default function UseMobile() {
  return (
    <div className="mobile-warning-container">
      <div className="mobile-warning">
        <Icon type="phone" size={50} />
        <br /><br />
        We've detected you're using a desktop browser.
        <br />
        Please visit glare.fm on a mobile device.
      </div>
    </div>
  )
}
