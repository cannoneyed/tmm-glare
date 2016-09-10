import { firebase } from 'src/firebase'

import {
  setGlobeData,
} from '../index'

import * as constants from 'src/constants'
import * as util from 'src/util'

export default function loadGlobeDataAsync() {
  return (dispatch) => {

    return firebase.database().ref().child('map').once('value', snapshot => {
      const data = util.recordFromSnapshot(snapshot) || constants.defaultMap

      dispatch(setGlobeData(data))
    })
  }
}
