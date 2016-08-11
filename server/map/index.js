const webUtil = require('../webUtil')
const util = require('../util')
const processMap = require('../actions/process-map')
const { firebase } = require('../firebase')

const db = firebase.database().ref()

module.exports.processMap = webUtil.handle(function* () {
  yield processMap()

  const snapshot = yield db.child('map').once('value')
  return util.recordFromSnapshot(snapshot)
})
