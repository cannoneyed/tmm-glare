import React, { PropTypes } from 'react'
import RippleButton from '../shared/rippleButton'
import { connect } from 'react-redux'
import { authActions } from 'src/core/auth'

export function SignIn({ signInWithFacebook, isAuthenticating }) {
  const signInButton = (
    <RippleButton
      className="glare-button"
      onClick={() => {
        setTimeout(() => {
          signInWithFacebook()
        }, 200)
      }}>
      {'Sign In'}
    </RippleButton>
  )

  return (
    <div className="action-buttons">
      <div className="g-row sign-in">
        <div className="g-col">
         {isAuthenticating ? null : signInButton}
        </div>
      </div>
    </div>
  )
}

SignIn.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  signInWithFacebook: PropTypes.func.isRequired,
}

export default connect(state => ({
  isAuthenticating: state.auth.isAuthenticating,
}), authActions)(SignIn)
