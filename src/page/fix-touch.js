const eventTypes = ['touchstart', 'touchmove', 'touchend', 'touchcancel']

function touchHandler(event) {
  const touches = event.changedTouches
  const first = touches[0]
  let type = ''
  switch (event.type) {
    case 'touchstart':
      type = 'mousedown'
      break
    case 'touchmove':
      type = 'mousemove'
      break
    case 'touchend':
      type = 'mouseup'
      break
    default:
      return
  }

  // initMouseEvent(type, canBubble, cancelable, view, clickCount,
  //                screenX, screenY, clientX, clientY, ctrlKey,
  //                altKey, shiftKey, metaKey, button, relatedTarget);

  const simulatedEvent = document.createEvent('MouseEvent')
  simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                first.screenX, first.screenY,
                                first.clientX, first.clientY, false,
                                false, false, false, 0/* left */, null)

  first.target.dispatchEvent(simulatedEvent)
  event.preventDefault()
}

export function fixTouchOn(elem = document) {

  eventTypes.forEach(eventType => {
    elem.addEventListener(eventType, touchHandler, true)
  })
}

export function fixTouchOff(elem = document) {
  eventTypes.forEach(eventType => {
    elem.removeEventListener(eventType, touchHandler, true)
  })
}
