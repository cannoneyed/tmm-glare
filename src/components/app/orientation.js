import React, { PropTypes } from 'react'
import MediaQuery from 'react-responsive'

import UseMobileWarning from './use-mobile'
import LandscapeWarning from './landscape'

const OrientationManager = ({ children }) => {
  return (
    <div>
      <MediaQuery minDeviceWidth={1224}>
        <UseMobileWarning />
      </MediaQuery>
      <MediaQuery maxDeviceWidth={1224}>
        <MediaQuery query="(orientation: landscape)">
          <LandscapeWarning />
        </MediaQuery>
        <MediaQuery query="(orientation: portrait)">
          {children}
        </MediaQuery>
      </MediaQuery>
    </div>
  )
}

OrientationManager.propTypes = {
  children: PropTypes.node,
}

export default OrientationManager
