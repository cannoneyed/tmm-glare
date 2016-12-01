import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import { Icon } from '../shared'

import * as modalActions from 'src/core/modals'
const modalTypes = modalActions

import GiveNotificationContent from './giveNotificationContent'
import ReceiveNotificationContent from './receiveNotificationContent'
import AboutLeaderboard from './aboutLeaderboard'

const ModalManager = (props) => {
  const {
    closeModal,
    data,
    isModalOpen,
    kind
  } = props

  let Content
  if (kind === modalTypes.DID_GIVE) {
    Content = <GiveNotificationContent data={data} />
  } else if (kind === modalTypes.DID_RECEIVE) {
    Content = <ReceiveNotificationContent data={data} />
  } else if (kind === modalTypes.ABOUT_LEADERBOARD) {
    Content = <AboutLeaderboard />
  }


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
        { Content }
      </Modal>
    </ReactCSSTransitionGroup>
  )
}

ModalManager.propTypes = {
  closeModal: PropTypes.func.isRequired,
  data: PropTypes.object,
  isModalOpen: PropTypes.bool.isRequired,
  kind: PropTypes.string,
}

export default connect(state => ({
  isModalOpen: state.modals.isOpen,
  kind: state.modals.kind,
  data: state.modals.data,
}), {
  closeModal: modalActions.closeModal,
})(ModalManager)
