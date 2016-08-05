import $ from 'jquery'

export default () => {
  // Scroll hack - see http://stackoverflow.com/questions/10238084/ios-safari-how-to-disable-overscroll-but-allow-scrollable-divs-to-scroll-norma
  // Uses document because document will be topmost level in bubbling
  $(document).on('touchmove', (e) => {
    e.preventDefault()
  })

  let scrolling = false

  // Uses body because jquery on events are called off of the element they are
  // added to, so bubbling would not work if we used document instead.
  $('body').on('touchstart', '.scrollable', (e) => {
    // Only execute the below code once at a time
    if (!scrolling) {
      scrolling = true
      if (e.currentTarget.scrollTop === 0) {
        e.currentTarget.scrollTop = 1
      } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
        e.currentTarget.scrollTop -= 1
      }
      scrolling = false
    }
  })

  // Prevents preventDefault from being called on document if it sees a scrollable div
  $('body').on('touchmove', '.scrollable', (e) => {
    e.stopPropagation()
  })
}
