export default function disableScroll(isDisabled) {
  if (isDisabled) {
    document.ontouchmove = (e) => {
      e.preventDefault()
    }

  } else {
    document.ontouchmove = () => true
  }
}
