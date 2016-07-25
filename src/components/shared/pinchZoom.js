import React, {Component, PropTypes} from 'react'
import Rx from 'rx'

function eventPreventDefault(event) {
  event.preventDefault()
}

function isTouch() {
  return (('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))
}

function hasTwoTouchPoints(event) {
  if (isTouch()) {
    return event.touches && event.touches.length === 2
  } else {
    return event.altKey
  }
}

function between(min, max, val) {
  return Math.min(max, Math.max(min, val))
}

function inverse(val) {
  return val * -1
}

function normalizeTouch(e) {
  const p = isTouch() ? e.touches[0] : e
  return {
    x: p.clientX,
    y: p.clientY
  }
}

class PinchZoom extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    maxScale: PropTypes.number,
    onZoom: PropTypes.func,
  }

  static defaultProps = {
    maxScale: 2,
  }

  constructor(props) {
    super(props)
    this.state = {
      obj: {
        scale: 1,
        x: 0,
        y: 0
      }
    }
  }

  componentDidMount() {
    this.handlePinch()
    this.resize()
  }

  componentWillUnmount() {
    if (this.pinchSubscription) {
      this.pinchSubscription.dispose()
    }
  }

  resize() {
    if (this.root) {
      const domNode = this.root
      this.setState({
        size: {
          width: domNode.offsetWidth,
          height: domNode.offsetHeight
        }
      })
    }
  }

  handlePinch() {
    const domNode = this.root
    const touchStart = Rx.Observable.fromEvent(domNode, (isTouch()) ? 'touchstart' : 'mousedown')
    const touchMove = Rx.Observable.fromEvent(window, (isTouch()) ? 'touchmove' : 'mousemove')
    const touchEnd = Rx.Observable.fromEvent(window, (isTouch()) ? 'touchend' : 'mouseup')

    function translatePos(point, size) {
      return {
        x: (point.x - (size.width / 2)),
        y: (point.y - (size.height / 2))
      }
    }

    const pinch = touchStart
    .tap(eventPreventDefault)
    .flatMap((md) => {
      const startPoint = normalizeTouch(md)
      const {size} = this.state

      return touchMove
      .map((mm) => {
        const {scale, x, y} = this.state.obj
        const {maxScale} = this.props
        const movePoint = normalizeTouch(mm)

        if (hasTwoTouchPoints(mm)) {
          let scaleFactor
          if (isTouch()) {
            scaleFactor = mm.scale
          } else {
            scaleFactor = (movePoint.x < (size.width / 2)) ? scale + ((translatePos(startPoint, size).x - translatePos(movePoint, size).x) / size.width) : scale + ((translatePos(movePoint, size).x - translatePos(startPoint, size).x) / size.width)
          }
          scaleFactor = between(1, maxScale, scaleFactor)
          return {
            scale: scaleFactor,
            x: (scaleFactor < 1.01) ? 0 : x,
            y: (scaleFactor < 1.01) ? 0 : y
          }
        } else {
          let scaleFactorX = ((size.width * scale) - size.width) / (maxScale * 2)
          let scaleFactorY = ((size.height * scale) - size.height) / (maxScale * 2)
          return {
            x: between(inverse(scaleFactorX), scaleFactorX, movePoint.x - startPoint.x),
            y: between(inverse(scaleFactorY), scaleFactorY, movePoint.y - startPoint.y)
          }
        }
      })
      .takeUntil(touchEnd)
    })

    this.pinchSubscription = pinch.subscribe((newObject) => {
      global.requestAnimationFrame(() => {
        this.setState({
          obj: Object.assign({}, this.state.obj, newObject)
        })
      })
    })
  }

  render() {
    const { className } = this.props

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        zoom: this.state.obj,
      })
    )

    return (
      <div
        className={className}
        ref={ref => this.root = ref}>
        {childrenWithProps}
      </div>
    )
  }
}

export default PinchZoom
