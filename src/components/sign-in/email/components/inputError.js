import React, { Component, PropTypes } from 'react'

import classnames from 'classnames'

class InputError extends Component {

  static propTypes = {
    errorMessage: PropTypes.string,
    visible: PropTypes.bool,
  }

  constructor() {
    super()
    this.state = {
      message: 'Input is invalid'
    }
  }

  render() {
    var errorClass = classnames({
      'error_container': true,
      'visible': this.props.visible,
      'invisible': !this.props.visible
    })

    return (
      <div className={errorClass}>
        <span>{this.props.errorMessage}</span>
      </div>
    )
  }
}

export default InputError
