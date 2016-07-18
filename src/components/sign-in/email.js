import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Icon, RippleButton } from '../shared'
import { connect } from 'react-redux'
import * as authActions from 'src/core/auth'
import { Field } from 'react-redux-form'
import validator from 'validator'

const MIN_PASSWORD_LENGTH = 8
const isRequired = (value) => !validator.isNull('' + value)
const isEmail = (value) => validator.isEmail('' + value)
const isLongEnough = (value) => validator.isLength(value, {
  min: MIN_PASSWORD_LENGTH,
  max: 127
})

export class Email extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      type: 'signin',
    }
  }

  toggleType = () => {
    const { type } = this.state
    this.setState({
      type: type === 'signin' ? 'signup' : 'signin',
    })
  }

  renderError = (message) => {
    return (
      <div className="email-signin-error">{message}</div>
    )
  }

  renderFullName = () => {
    const { loginForm } = this.props
    const error = loginForm.fields.fullName.touched && _.some([
      loginForm.fields.fullName.errors.isRequired,
    ])

    return (
      <Field
        className="email-sigin-field"
        model="email.login.fullName"
        validators={{
          isRequired,
        }}
        validateOn="blur">
        <label>Name</label>
        <input type="text" className={error ? 'error' : ''} />
      </Field>
    )
  }

  renderEmail = () => {
    const { loginForm } = this.props
    const error = loginForm.fields.email.touched && _.some([
      loginForm.fields.email.errors.isRequired,
      loginForm.fields.email.errors.isEmail,
    ])

    return (
      <Field
        className="email-sigin-field"
        model="email.login.email"
        validators={{
          isRequired,
          isEmail,
        }}
        validateOn="blur" >
        <label>Email</label>
        <input type="text" className={error ? 'error' : ''} />
      </Field>
    )
  }

  renderPassword = () => {
    const { loginForm } = this.props
    const error = loginForm.fields.password.touched && _.some([
      loginForm.fields.password.errors.isRequired,
      loginForm.fields.password.errors.isLongEnough,
    ])

    return (
      <Field
        className="email-sigin-field"
        model={'email.login.password'}
        validators={{
          isRequired,
          isLongEnough,
        }}
        validateOn="blur">
        <label>Password</label>
        <input type="password" className={error ? 'error' : ''} />
      </Field>
    )
  }

  render() {
    const { type } = this.state
    const { login, signInWithEmailAsync, signUpWithEmailAsync } = this.props

    const submitMessage = type === 'signin' ? 'Sign in' : 'Sign up'
    const asideMessage = type === 'signin' ?
      'Or create a new account' : 'Or sign in with existing account'

    let submitAction = type === 'signup' ?
      () => signUpWithEmailAsync(login.email, login.password) :
      () => signInWithEmailAsync(login.email, login.password)

    return (
      <div className="sign-in-container">
        <form className="email-signin-form">

          { type === 'signup' ? this.renderFullName() : null }
          { this.renderEmail() }
          { this.renderPassword() }

          <div className="form-spacer" />

          <RippleButton
            className="glare-button"
            onClick={() => {
              setTimeout(submitAction, 300)
            }}>
            <Icon type="email" />
            {submitMessage}
          </RippleButton>
          <div className="aside" onClick={this.toggleType}>
            {asideMessage}
          </div>
        </form>
      </div>
    )
  }
}

Email.propTypes = {
  login: PropTypes.object.isRequired,
  loginForm: PropTypes.object.isRequired,
  signInWithEmailAsync: PropTypes.func.isRequired,
  signUpWithEmailAsync: PropTypes.func.isRequired,
}

export default connect(state => {
  const { email: { login, loginForm } } = state
  return { login, loginForm }
}, authActions)(Email)
