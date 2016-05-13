import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'src/core/auth';


export function SignIn({ signInWithFacebook }) {
  return (
    <div className="g-row sign-in">
      <div className="g-col">
        <h1 className="sign-in__heading">Sign in</h1>
        <button className="sign-in__button" onClick={signInWithFacebook} type="button">Facebook</button>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  signInWithFacebook: PropTypes.func.isRequired,
};


export default connect(null, authActions)(SignIn);
