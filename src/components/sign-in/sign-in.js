import React, { PropTypes } from 'react'
import { Icon, RippleButton } from '../shared'
import { connect } from 'react-redux'
import * as authActions from 'src/core/auth'

export function SignIn(props) {
  const {
    isIncognito,
    signInWithFacebookAsync,
    signInWithGoogleAsync,
  } = props

  const actionButtons = (
    <div className="action-buttons">
      <div className="aside">
        {'Sign in with'}
      </div>
      <RippleButton
        className="glare-button"
        onClick={() => {
          setTimeout(() => {
            signInWithFacebookAsync()
          }, 200)
        }}>
        <Icon type="facebook" />
        {'Facebook'}
      </RippleButton>
      <RippleButton
        className="glare-button"
        onClick={() => {
          setTimeout(() => {
            signInWithGoogleAsync()
          }, 200)
        }}>
        <Icon type="google" />
        {'Google'}
      </RippleButton>
    </div>
  )

  const incognitoMessage = (
    <div className="incognito-warning">
      You're browsing in private mode. Please disable private browsing to use Glare.
    </div>
  )

  return (
    <div className="sign-in-container">
      <div className="splash-logo" />
      { isIncognito ? incognitoMessage : actionButtons}
    </div>
  )
}

SignIn.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  isIncognito: PropTypes.bool.isRequired,
  signInWithFacebookAsync: PropTypes.func.isRequired,
  signInWithGoogleAsync: PropTypes.func.isRequired,
}

export default connect(state => ({
  isIncognito: state.app.isIncognito,
  isAuthenticating: state.auth.isAuthenticating,
}), authActions)(SignIn)
