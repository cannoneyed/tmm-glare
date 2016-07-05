import _ from 'lodash'

import {
  LOAD_GLOBE_DATA,
} from './action-types'

import * as util from 'src/util'

// Number of decimal points to trim lat / lng for grouping
const PRECISION = 3
const MAX_VALUE = 0.5

export function loadData() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return firebase.database().ref().child('connections').once('value', snapshot => {
      const data = util.recordFromSnapshot(snapshot)

      // Omit the 'key' key from the firebase returned object
      const payload = processConnections(_.omit(data, 'key'))

      dispatch({ type: LOAD_GLOBE_DATA, payload })
    })
  }

}

function processConnections(data) {
  // Process the raw data into the coordinate
  const coordinates = _.map(data, connection => {
    return {
      lat: processCoordinate(connection.latitude),
      lng: processCoordinate(connection.longitude)
    }
  })

  // Count the occurences of each coordinate slug
  const counts = {}
  _.each(coordinates, coordinate => {
    const { lat, lng } = coordinate
    const slug = `${lat}:${lng}`
    const count = _.get(counts, [slug, 'count'], 0) + 1
    counts[slug] = { lat, lng, count }
  })

  // Sort the counts and then map to an array of counts for statistical analysis
  const sortedCounts = _(counts)
    .map((item, slug) => {
      const { count } = item
      return { count, slug }
    })
    .sort((a, b) => {
      return b.count - a.count
    })
    .map(item => item.count)
    .value()

  const max = _.first(sortedCounts)

  // Now, map the coordinates and counts to data ingestible by the webGL globe
  const output = _(counts)
    .map(item => {
      const { lat, lng, count } = item
      const value = (count / max) * MAX_VALUE
      return [lat, lng, value]
    })
    .flatten()
    .value()

  return output
}

function processCoordinate(coordinate) {
  return coordinate.toFixed(PRECISION) * 1
}
