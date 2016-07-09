export default {
  webGLSupport,
}

function webGLSupport() {
  /* 	The wizard of webGL only bestows his gifts of power
    to the worthy.  In this case, users with browsers who 'get it'.		*/

  try {
    var canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    // console.warn('Hey bro, for some reason we\'re not able to use webGL for this.  No biggie, we\'ll use canvas.');
    return false
  }
}
