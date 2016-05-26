import React, { PropTypes } from 'react'
import RippleButton from '../shared/ripple-button'
import { connect } from 'react-redux'
import { authActions } from 'src/core/auth'


export function SignIn({ signInWithFacebook }) {
  return (
    <div className="actionButtons">
      <div className="g-row sign-in">
        <div className="g-col">
          <RippleButton
            onClick={() => {
              setTimeout(() => {
                signInWithFacebook()
              }, 200)
            }}>
            {'Sign In'}
          </RippleButton>
        </div>
      </div>
    </div>
  )
}

SignIn.propTypes = {
  signInWithFacebook: PropTypes.func.isRequired,
}

export default connect(null, authActions)(SignIn)
