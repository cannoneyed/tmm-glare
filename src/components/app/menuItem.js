import React from 'react'

import { Icon, RippleButton } from '../shared'

export default function MenuItem({ onClick, content }) { // eslint-disable-line
  return (
    <RippleButton
      className="glare-button"
      onClick={onClick}>
      <Icon type="listen" />
      {content}
    </RippleButton>
  )
}
