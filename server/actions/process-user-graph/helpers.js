exports.getDistance = (coords1, coords2, isMiles = true) => {
  function toRad(x) {
    return x * Math.PI / 180
  }

  var { latitude: lat1, longitude: lng1 } = coords1
  var { latitude: lat2, longitude: lng2 } = coords2

  var R = 6371 // km

  var x1 = lat2 - lat1
  var dLat = toRad(x1)
  var x2 = lng2 - lng1
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c

  return isMiles ? (d / 1.60934) : d
}
