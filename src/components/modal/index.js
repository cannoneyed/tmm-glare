import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import { Icon } from '../shared'

import * as appActions from 'src/core/app'

const ModalManager = (props) => {
  const { closeModal, isModalOpen } = props

  return (
    <ReactCSSTransitionGroup
      transitionName="modal-transition"
      transitionEnterTimeout={1000}
      transitionLeaveTimeout={750}>
      <Modal
        className="app-modal"
        overlayClassName="app-modal-overlay"
        closeTimeoutMS={150}
        isOpen={isModalOpen}
        onRequestClose={closeModal}>
        <div
          className="app-modal-close"
          onClick={ closeModal }>
          <Icon type={'close'} size={35} />
        </div>
        { 'HEY!' }
      </Modal>
    </ReactCSSTransitionGroup>
  )
}

ModalManager.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
}

export default connect(state => ({
  isModalOpen: state.app.isModalOpen,
}), {
  openModal: appActions.openModal,
  closeModal: appActions.closeModal,
})(ModalManager)
