export default function authRouteResolver(getState) {
  return (nextState, replace) => {
    const { auth, user } = getState()
    let { pathname } = nextState.location
    if (pathname === '/') {
      pathname = '/connect'
    }

    const hasAccess = !!user && user.hasAccess
    const authenticated = auth.authenticated

    if (!authenticated && pathname !== 'sign-in') {
      return replace({ pathname: '/sign-in' })
    }

    if (pathname === 'sign-in') {
      return
    }

    if (authenticated && !hasAccess) {
      if (pathname === 'intro') {
        return replace({ pathname: '/intro' })
      } else if (pathname !== 'connect') {
        replace({ pathname: '/connect' })
      }
    }
  }
}
