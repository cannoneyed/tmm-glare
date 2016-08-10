function checkHeadersSent(res, cb) {
  return (err, results) => {
    if (res.headersSent) {
      if (err) {
        return cb(err)
      }
      return null
    }
    cb(err, results)
  }
}

exports.finish = function finish(req, res, next) {
  const check = checkHeadersSent.bind(null, res)
  if (req.method === 'GET') {
    return check((err, results) => {
      if (err) {
        return next(err)  // Send to default handler
      }

      res.json(results)
    })
  } else if (req.method === 'POST') {
    return check((err, results) => {
      if (err) {
        return next(err)  // Send to default handler
      }
      /* eslint-disable max-len */
      // http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api?hn#useful-post-responses
      if (results) {
        res.json(results, 200)
      } else {
        res.json(204, {})
      }
    })
  } else if (req.method === 'PUT') {
    return check((err, results) => {
      if (err) {
        return next(err)  // Send to default handler
      }

      if (results) {
        res.json(results, 200)
      } else {
        res.json(204, {})
      }
    })
  } else if (req.method === 'PATCH') {
    return check((err, results) => {
      if (err) {
        return next(err)  // Send to default handler
      }

      if (results) {
        res.json(results)
      } else {
        res.json(204, {})
      }
    })
  } else if (req.method === 'DELETE') {
    return check((err, results) => {
      if (err) {
        return next(err)  // Send to default handler
      }

      if (results) {
        res.json(results)
      } else {
        res.json(204, {})
      }
    })
  }
}
