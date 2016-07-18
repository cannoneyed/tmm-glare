import { combineReducers } from 'redux'
import { modelReducer, formReducer } from 'react-redux-form'

const initialState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default combineReducers({
  user: modelReducer('email.user', initialState),
  userForm: formReducer('email.user', initialState),
})
