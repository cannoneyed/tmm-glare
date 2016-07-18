import { combineReducers } from 'redux'
import { modelReducer, formReducer } from 'react-redux-form'

const initialState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default combineReducers({
  login: modelReducer('email.login', initialState),
  loginForm: formReducer('email.login', initialState),
})
