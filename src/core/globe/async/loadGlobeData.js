import _ from 'lodash'

import {
  setGlobeData,
} from '../index'

import {
  setRawData,
} from '../../connections'

import * as util from 'src/util'

// Number of decimal points to trim lat / lng for grouping
const PRECISION = 3
const MAX_VALUE = 0.5

export default function loadGlobeDataAsync() {
  return (dispatch, getState) => {
    const { firebase } = getState()

    return firebase.database().ref().child('connections').once('value', snapshot => {
      const data = util.recordFromSnapshot(snapshot)

      // Set the raw data for processing by the connections app
      dispatch(setRawData(data))

      // Omit the 'key' key from the firebase returned object
      const payload = processConnections(_.omit(data, 'key'))
      dispatch(setGlobeData(payload))
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
  const sortedCounts = _.map(counts, (item, slug) => {
    const { count } = item
    return { count, slug }
  })
  .sort((a, b) => {
    return b.count - a.count
  })
  .map(item => item.count)

  const max = _.first(sortedCounts)

  // Now, map the coordinates and counts to data ingestible by the webGL globe
  const mapped = _.map(counts, item => {
    const { lat, lng, count } = item
    const value = (count / max) * MAX_VALUE
    return [lat, lng, value]
  })

  const output = _.flatten(mapped)

  return output
}

function processCoordinate(coordinate) {
  return coordinate.toFixed(PRECISION) * 1
}
