export default function authRouteResolver(getState) {
  return (nextState, replace) => {
    const { auth, user } = getState()
    const { pathname } = nextState.location

    const hasAccess = !!user && user.hasAccess
    const authenticated = auth.authenticated
    let target = `/${pathname}`

    if (!authenticated && target !== '/sign-in') {
      return replace({ pathname: '/sign-in' })
    }

    if (target === '/sign-in') {
      return
    }

    if (authenticated && !hasAccess) {
      if (target === '/intro') {
        return replace({ pathname: '/intro' })
      } else if (target !== '/connect') {
        replace({ pathname: '/connect' })
      }
    }
  }
}
