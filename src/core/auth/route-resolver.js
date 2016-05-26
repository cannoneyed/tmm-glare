import {
  POST_SIGN_IN_PATH,
  SIGN_IN_PATH
} from 'src/config'


export function authRouteResolver(getState) {
  return (nextState, replace) => {
    const { auth, user } = getState()
    const { pathname } = nextState.location

    const hasAccess = user && user.hasAccess

    if (!auth.authenticated && `/${pathname}` !== SIGN_IN_PATH) {
      replace({pathname: SIGN_IN_PATH})
    }

    if (auth.authenticated && !hasAccess && `/${pathname}` !== POST_SIGN_IN_PATH) {
      replace({pathname: POST_SIGN_IN_PATH})
    }
  }
}
