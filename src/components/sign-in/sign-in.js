import React, { PropTypes } from 'react'
import { Icon, RippleButton } from '../shared'
import { connect } from 'react-redux'
import * as authActions from 'src/core/auth'
import { Link } from 'react-router'


export function SignIn({ signInWithFacebook }) {
  return (
    <div className="sign-in-container">
      <div className="splash-logo" />
      <div className="action-buttons">
        <RippleButton
          className="glare-button"
          onClick={() => {
            setTimeout(() => {
              signInWithFacebook()
            }, 200)
          }}>
          <Icon type="facebook" />
          {'Sign In'}
        </RippleButton>
        <Link
          className="aside"
          to={'/email'}>
          {'Sign in with email'}
        </Link>
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
