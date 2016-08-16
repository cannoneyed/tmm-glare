const throng = require('throng')
const WORKERS = process.env.WEB_CONCURRENCY || 1
require('dotenv').config()

const express = require('express')
const logger = require('winston')
// const { firebase } = require('./firebase')
// const util = require('./util')
const initializeApp = require('./initialize')
const processUserGraph = require('./actions/process-user-graph')
const webUtil = require('./webUtil')

//=========================================================
//  SETUP
//---------------------------------------------------------
const app = express()

app.set('host', process.env.HOST || 'localhost')
app.set('port', process.env.PORT || 3001)


//=========================================================
//  ROUTER
//---------------------------------------------------------
const router = new express.Router()

router.get('/graph/:id', webUtil.handle(function* gen(req) {
  return processUserGraph({ data: { userId: req.params.id }})
}))

app.use(router)

//=========================================================
//  START SERVER
//---------------------------------------------------------
const start = (id) => {
  initializeApp().then(() => {
    app.listen(app.get('port'), app.get('host'), error => {
      if (error) {
        logger.error(error)
      } else {
        logger.info(`Server ${id} listening @ ${app.get('host')}:${app.get('port')}`)
      }
    })
  })
}

// Cluster the server
throng({
  start,
  workers: WORKERS,
  lifetime: Infinity
})
