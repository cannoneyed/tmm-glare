import React, { PropTypes } from 'react'
import { Icon, RippleButton } from '../shared'
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
      <Icon icon="facebook" />
      {'Sign In'}
    </RippleButton>
  )

  return (
    <div className="action-buttons">
     {isAuthenticating ? null : signInButton}
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
