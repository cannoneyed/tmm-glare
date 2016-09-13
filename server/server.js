const throng = require('throng')
const WORKERS = process.env.WEB_CONCURRENCY || 1

if (process.env !== 'production') {
  require('dotenv').config()
}

console.log('🐸', process.NODE_ENV)
console.log('🍕', config)

const express = require('express')
const logger = require('winston')
const initializeApp = require('./initialize')
const webUtil = require('./webUtil')

//=========================================================
//  SETUP
//---------------------------------------------------------
const app = express()

app.set('port', process.env.PORT || 3001)


//=========================================================
//  ROUTER
//---------------------------------------------------------
const router = new express.Router()

router.get('/hello', webUtil.handle(function* gen() {
  return 'dog!'
}))

app.use(router)

//=========================================================
//  START SERVER
//---------------------------------------------------------
const start = (id) => {
  const isMaster = id === 1 // The first worker is the master
  initializeApp(isMaster).then(() => {
    app.listen(app.get('port'), error => {
      if (error) {
        logger.error(error)
      } else {
        logger.info(`Server ${id} listening @ port ${app.get('port')}`)
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
