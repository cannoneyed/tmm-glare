const P = require('bluebird')
const { firebase } = require('../../firebase')

const db = firebase.database().ref()

module.exports = P.coroutine(function* setConnection({ data }) {
  const { from, to, latitude, longitude, timestamp } = data

  const connectionKey = [from, to].join('::::')

  // Set the connection entry
  yield db.child(`connections/${connectionKey}`)
    .set({
      from,
      latitude,
      longitude,
      timestamp,
      to,
    })

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

  // Now remove the beacons
  yield P.props({
    removeBeaconFrom: db.child(`beacons/${from}`).set(null),
    removeBeaconLocationFrom: db.child(`beaconLocations/${from}`).set(null),
    removeBeaconTo: db.child(`beacons/${to}`).set(null),
    removeBeaconLocationTo: db.child(`beaconLocations/${to}`).set(null),
  })
})
