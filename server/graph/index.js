const _ = require('lodash')
const util = require('../util')
const webUtil = require('../webUtil')

const { firebase } = require('../firebase')
const db = firebase.database().ref()

// Number of decimal points to trim lat / lng for grouping
const PRECISION = 3
const MAX_VALUE = 0.5

exports.loadGlobeData = webUtil.handle(function *loadGlobeData() {
  const snapshot = yield db.child('connections').once('value')
  const data = util.recordsFromSnapshot(snapshot)

  const processed = processConnections(data)
  return processed
})

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
