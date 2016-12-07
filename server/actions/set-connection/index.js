import _ from 'lodash'
import logger from 'winston'
import P from 'bluebird'
import config from 'config'
import fetch from 'node-fetch'
import querystring from 'querystring'
import { firebase } from '../../firebase'
import graphData from '../../graph/data'
import processMap from '../process-map'
import users from '../../store/users'

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

    const { adminCode1, adminName1, name, countryName } = locationData

    // Use the state abbreviation if we're in the United States
    const state = countryName === 'United States' ? adminCode1 : adminName1

    const connectionKey = [from, to].join('::::')
    const connection = {
      from,
      latitude,
      longitude,
      timestamp,
      to,
      city: name,
      country: countryName,
      state: state || '',
    }

    // Set the connection entry
    yield db.child(`connections/${connectionKey}`).set(connection)

    // Set the connection and set hasAccess true on both user objects
    const fromUpdate = {
      [`connections/${to}`]: timestamp,
      hasAccess: true,
    }

    const toUpdate = {
      [`connections/${from}`]: timestamp,
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
