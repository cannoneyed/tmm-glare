import React, { PropTypes } from 'react'
import { Icon, RippleButton } from '../shared'
import { connect } from 'react-redux'
import * as authActions from 'src/core/auth'

export function SignIn({ signInWithFacebookAsync, signInWithGoogleAsync }) {
  return (
    <div className="sign-in-container">
      <div className="splash-logo" />
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
    </div>
  )
}

SignIn.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  signInWithFacebookAsync: PropTypes.func.isRequired,
  signInWithGoogleAsync: PropTypes.func.isRequired,
}

export default connect(state => ({
  isAuthenticating: state.auth.isAuthenticating,
}), authActions)(SignIn)
