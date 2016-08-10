const P = require('bluebird')
const routing = require('./routing')

exports.handle = (generator) => {
  return (req, res, next) => {
    return P.coroutine(generator)(req, res, next)
      .asCallback(routing.finish(req, res, next))
  }
}
