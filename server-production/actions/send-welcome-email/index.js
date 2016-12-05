'use strict';

var _reactHtmlEmail = require('react-html-email');

var _reactHtmlEmail2 = _interopRequireDefault(_reactHtmlEmail);

var _postmark = require('postmark');

var _postmark2 = _interopRequireDefault(_postmark);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _welcome = require('../../email/welcome');

var _welcome2 = _interopRequireDefault(_welcome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactHtmlEmail2.default.injectReactEmailAttributes();

var html = _reactHtmlEmail2.default.renderEmail(_welcome2.default);
var client = new _postmark2.default.Client(_config2.default.postmark.id);

module.exports = function (_ref) {
  var data = _ref.data;
  var resolve = _ref.resolve;
  var reject = _ref.reject;
  var email = data.email;


  return _bluebird2.default.coroutine(regeneratorRuntime.mark(function sendWelcomeEmail() {
    return regeneratorRuntime.wrap(function sendWelcomeEmail$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', _bluebird2.default.fromCallback(function (cb) {
              return client.sendEmail({
                From: 'm@glare.fm',
                To: email,
                Subject: 'Welcome to glare.fm',
                HtmlBody: html
              }, cb);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, sendWelcomeEmail, this);
  }))().then(resolve).catch(function (err) {
    _winston2.default.error(err);

    return reject(err);
  });
};