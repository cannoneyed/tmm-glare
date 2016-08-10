require('dotenv').config()

const express = require('express')
const logger = require('winston')
// const { firebase } = require('./firebase')
// const util = require('./util')
const initializeApp = require('./initialize')
const { loadGlobeData } = require('./graph')

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

router.get('/test', loadGlobeData)

app.use(router)

//=========================================================
//  START SERVER
//---------------------------------------------------------

initializeApp().then(() => {
  app.listen(app.get('port'), app.get('host'), error => {
    if (error) {
      logger.error(error)
    } else {
      logger.info(`Server listening @ ${app.get('host')}:${app.get('port')}`)
    }
  })
})
