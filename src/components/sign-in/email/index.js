import React, { Component } from 'react'
import Input from './components/input'
import _ from 'lodash'

class Email extends Component {

  constructor() {
    super()
    this.state = {
      email: null,
      name: null,
      password: null,
      confirmPassword: null,
      forbiddenWords: ['password', 'user', 'username']
    }
  }

  handlePasswordInput = (event) => {
    if (!_.isEmpty(this.state.confirmPassword)) {
      this.passwordConfirmInput.isValid()
    }
    this.passwordConfirmInput.hideError()
    this.setState({
      password: event.target.value
    })
  }

  handleConfirmPasswordInput = (event) => {
    this.setState({
      confirmPassword: event.target.value
    })
  }

  saveAndContinue = (e) => {
    e.preventDefault()

    var canProceed = this.validateEmail(this.state.email)
        && !_.isEmpty(this.state.statesValue)
        && this.passwordInput.isValid()
        && this.passwordConfirmInput.isValid()

    if (!canProceed) {
      this.emailInput.isValid()
      this.nameInput.isValid()
      this.passwordInput.isValid()
      this.passwordConfirmInput.isValid()
    }
  }

  isConfirmedPassword = (event) => {
    return (event === this.state.password)
  }

  handleNameInput = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  handleEmailInput = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  validateEmail = (event) => {
    // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(event)
  }

  isEmpty = (value) => {
    return !_.isEmpty(value)
  }

  updateStatesValue = (value) => {
    this.setState({
      statesValue: value
    })
  }

  render() {
    return (
      <div className="create_account_screen">

        <div className="create_account_form">
          <h1>Create account</h1>
          <form onSubmit={this.saveAndContinue}>

            <Input
              text="Name"
              ref={(ref) => this.nameInput = ref}
              validate={this.isEmpty}
              value={this.state.name}
              onChange={this.handleNameInput}
              emptyMessage="Company name can't be empty"
            />

            <Input
              text="Email Address"
              ref={(ref) => this.emailInput = ref}
              type="text"
              defaultValue={this.state.email}
              validate={this.validateEmail}
              value={this.state.email}
              onChange={this.handleEmailInput}
              errorMessage="Email is invalid"
              emptyMessage="Email can't be empty"
              errorVisible={this.state.showEmailError}
            />

            <Input
              text="Password"
              type="password"
              ref={(ref) => this.passwordInput = ref}
              validator={true}
              minCharacters={8}
              requireCapitals={true}
              requireNumbers={true}
              forbiddenWords={this.state.forbiddenWords}
              value={this.state.passsword}
              emptyMessage="Password is invalid"
              onChange={this.handlePasswordInput}
            />

            <Input
              text="Confirm password"
              ref={(ref) => this.passwordConfirmInput = ref}
              type="password"
              validate={this.isConfirmedPassword}
              value={this.state.confirmPassword}
              onChange={this.handleConfirmPasswordInput}
              emptyMessage="Please confirm your password"
              errorMessage="Passwords don't match"
            />

            <button
              type="submit"
              className="button button_wide">
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    )
  }

}

export default Email
