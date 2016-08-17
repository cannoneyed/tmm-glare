import {
  setGlobeData,
} from '../index'

import * as util from 'src/util'

export default function loadGlobeDataAsync() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return firebase.database().ref().child('map').once('value', snapshot => {
      const data = util.recordFromSnapshot(snapshot) || [37.81, -122.26, 0.1]

      dispatch(setGlobeData(data))
    })
  }
}
