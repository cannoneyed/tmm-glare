import React from 'react'

import { Icon, RippleButton } from '../shared'

export default function MenuItem({ onClick, content }) { // eslint-disable-line
  return (
    <RippleButton
      className='menu-item'
      onClick={onClick}>
      <Icon type="listen" />
      FUCK YOU
    </RippleButton>
  )
}
