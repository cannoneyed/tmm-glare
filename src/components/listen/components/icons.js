import React, { PropTypes } from 'react'

const { Component } = React

// Player Button Icons
const ButtonIconSVG = ({ children }) => {
  return (
    <svg
      className="sb-soundplayer-play-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="currentColor">
      {children}
    </svg>
  )
}

ButtonIconSVG.propTypes = {
  children: PropTypes.node,
}

// |> Play
export class PlayIconSVG extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <ButtonIconSVG>
        <path d="M0 0 L32 16 L0 32 z"></path>
      </ButtonIconSVG>
    )
  }
}

// || Pause
export class PauseIconSVG extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <ButtonIconSVG>
        <path d="M0 0 H12 V32 H0 z M20 0 H32 V32 H20 z"></path>
      </ButtonIconSVG>
    )
  }
}

// |>| Next
export class NextIconSVG extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <ButtonIconSVG>
        <path d="M4 4 L24 14 V4 H28 V28 H24 V18 L4 28 z "></path>
      </ButtonIconSVG>
    )
  }
}

// |<| Prev
export class PrevIconSVG extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <ButtonIconSVG>
        <path d="M4 4 H8 V14 L28 4 V28 L8 18 V28 H4 z "></path>
      </ButtonIconSVG>
    )
  }
}
