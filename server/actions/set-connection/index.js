const _ = require('lodash')
const logger = require('winston')
const P = require('bluebird')
const config = require('config')
const fetch = require('node-fetch')
const querystring = require('querystring')
const { firebase } = require('../../firebase')
const graphData = require('../../graph/data')
const processMap = require('../process-map')

const db = firebase.database().ref()

module.exports = ({ data, resolve, reject }) => {
  const { from, to, latitude, longitude, timestamp } = data

  return P.coroutine(function* setConnection() {

    const qs = querystring.stringify({
      lat: latitude,
      lng: longitude,
      username: config.geonames.username,
      cities: 'cities15000',
    })

    const locationData = yield fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?${qs}`)
      .then(res => res.json())
      .then(data => _.get(data, 'geonames.0', {}))

    const { name, countryName } = locationData

    const connectionKey = [from, to].join('::::')
    const connection = {
      from,
      latitude,
      longitude,
      timestamp,
      to,
      city: name,
      country: countryName,
    }

    // Set the connection entry
    yield db.child(`connections/${connectionKey}`).set(connection)

    // Set the connection and set hasAccess true on both user objects
    const fromUpdate = {
      [`connections/${to}`]: to,
      hasAccess: true,
    }

    const toUpdate = {
      [`connections/${from}`]: from,
      hasAccess: true,
      from,
    }

    yield P.props({
      to: db.child(`users/${from}`).update(fromUpdate),
      from: db.child(`users/${to}`).update(toUpdate),
    })

    // Update the internal graph
    graphData.setConnection(connection)

    // Update the map representation
    yield processMap()

  })().then(resolve).catch((err) => {
    logger.error(err)

    const message = {
      type: 'CONNECTION_FAILED',
      timestamp: Date.now(),
    }

    // Set the failed messages to both connecting users
    return P.props({
      to: db.child(`messages/${to}/${from}`).set(message),
      from: db.child(`messages/${from}/${to}`).set(message),
    }).then(() => {
      return reject(err)
    })
  })
  .finally(() => {
    // Remove the beacons
    return P.props({
      removeBeaconFrom: db.child(`beacons/${from}`).set(null),
      removeBeaconLocationFrom: db.child(`beaconLocations/${from}`).set(null),
      removeBeaconTo: db.child(`beacons/${to}`).set(null),
      removeBeaconLocationTo: db.child(`beaconLocations/${to}`).set(null),
    })
  })
}
