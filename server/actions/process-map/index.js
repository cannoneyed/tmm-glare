const _ = require('lodash')
const graphData = require('../../graph/data')
const { firebase } = require('../../firebase')

const db = firebase.database().ref()

// Number of decimal points to trim lat / lng for grouping
const PRECISION = 3
const MAX_VALUE = 0.5

module.exports = function processMap() {
  const connections = graphData.getConnections()
  const processed = processConnections(connections)

  console.log(processed)

  return db.child('map').set(processed)
}

function processConnections(connections) {
  // Process the raw connection data into the coordinate
  const coordinates = _.map(connections, connection => {
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
