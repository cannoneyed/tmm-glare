import {
  setGlobeData,
} from '../index'

import constants from 'src/core/constants'
import * as util from 'src/util'

export default function loadGlobeDataAsync() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return firebase.database().ref().child('map').once('value', snapshot => {
      const data = util.recordFromSnapshot(snapshot) || constants.defaultMap

      dispatch(setGlobeData(data))
    })
  }
}
