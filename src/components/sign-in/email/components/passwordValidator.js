import React, { Component, PropTypes } from 'react'
import Icon from 'src/components/shared/icon'
import classnames from 'classnames'

class PasswordValidator extends Component {

  static propTypes = {
    forbiddenWords: PropTypes.arrayOf(PropTypes.string),
    minCharacters: PropTypes.number,
    name: PropTypes.string,
    requireCapitals: PropTypes.bool,
    requireNumbers: PropTypes.bool,
    valid: PropTypes.bool,
    validData: PropTypes.object,
    visible: PropTypes.bool,
  }

  constructor(props) {
    super()
    this.state = {
      value: null,
      minCharacters: props.minCharacters,
      requireCapitals: props.requireCapitals,
      requireNumbers: props.requireNumbers,
      forbiddenWords: props.forbiddenWords,
      name: props.name
    }
  }

  render() {
    const validatorClass = classnames({
      'password_validator': true,
      'visible': this.props.visible,
      'invisible': !this.props.visible,
    })

    const forbiddenWords = this.state.forbiddenWords.map(function(word, i) {
      return (
        <span key={i} className="bad_word">
          "{word}"
        </span>
      )
    })

    let validatorTitle

    if (this.props.valid) {
      validatorTitle = (
        <h4 className="validator_title valid">
          {this.props.name} IS OK
        </h4>
      )
    } else {
      validatorTitle = (
        <h4 className="validator_title invalid">
          {this.props.name} RULES
        </h4>
      )
    }

    return (
      <div className={validatorClass}>
        <div className="validator_container">

          {validatorTitle}

          <ul className="rules_list">

            <li className={classnames({'valid': this.props.validData.minChars})}>
              <i className="icon_valid"> <Icon type="circle_tick_filled" /></i>
              <i className="icon_invalid"> <Icon type="circle_error" /> </i>
              <span className="error_message">{this.state.minCharacters} characters minimum</span>
            </li>

            <li className={classnames({'valid': this.props.validData.capitalLetters})}>
              <i className="icon_valid"> <Icon type="circle_tick_filled" /> </i>
              <i className="icon_invalid"> <Icon type="circle_error" /> </i>
              <span className="error_message">Contains at least {this.state.requireCapitals} capital letter</span>
            </li>

            <li className={classnames({'valid': this.props.validData.numbers})}>
              <i className="icon_valid"> <Icon type="circle_tick_filled" /> </i>
              <i className="icon_invalid"> <Icon type="circle_error" /> </i>
              <span className="error_message">Contains at least {this.state.requireNumbers} number</span>
            </li>

            <li className={classnames({'valid': this.props.validData.words})}>
              <i className="icon_valid"> <Icon type="circle_tick_filled" /> </i>
              <i className="icon_invalid"> <Icon type="circle_error" /> </i>
              <span className="error_message">Can't be {forbiddenWords}</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default PasswordValidator
