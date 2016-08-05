import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as appActions from 'src/core/app'
import FullScreen from 'react-fullscreen'

const Modal = (props) => {
  const { closeModal } = props

  return (
    <FullScreen>
      <div className="modal-overlay">
        <h1 onClick={closeModal}>FUCK YOU</h1>
      </div>
    </FullScreen>
  )
}

Modal.propTypes = {
  closeModal: PropTypes.func,
}

export default connect(null, {
  closeModal: appActions.closeModal,
})(Modal)
