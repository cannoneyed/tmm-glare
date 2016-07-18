import { getCurrentPage } from '../history/selectors'

export function hideHeader(state) {
  const { history, app } = state
  const { hasViewedIntro } = app

  // If we're currently at the email login page, the user has not seen the intro but
  // we ought to display the header to go back
  if (getCurrentPage(history) === 'email') {
    return false
  }

  return !hasViewedIntro
}
