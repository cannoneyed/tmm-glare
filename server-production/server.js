'use strict';

require('babel-core/register');
require('babel-polyfill');
// const throng = require('throng')
// const WORKERS = process.env.WEB_CONCURRENCY || 1

if (process.env !== 'production') {
  require('dotenv').config();
}

var express = require('express');
var logger = require('winston');
var initializeApp = require('./initialize');
var webUtil = require('./webUtil');

//=========================================================
//  SETUP
//---------------------------------------------------------
var app = express();

app.set('port', process.env.PORT || 3001);

//=========================================================
//  ROUTER
//---------------------------------------------------------
var router = new express.Router();

router.get('/hello', webUtil.handle(regeneratorRuntime.mark(function gen() {
  return regeneratorRuntime.wrap(function gen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt('return', 'dog!');

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, gen, this);
})));

app.use(router);

//=========================================================
//  START SERVER
//---------------------------------------------------------
var start = function start() {
  initializeApp().then(function () {
    app.listen(app.get('port'), function (error) {
      if (error) {
        logger.error(error);
      } else {
        logger.info('Server listening @ port ' + app.get('port'));
      }
    });
  });
};

start();