'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactHtmlEmail = require('react-html-email');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var css = '\n@media only screen and (max-device-width: 480px) {\n  font-size: 20px !important;\n  font-family: "Lucida Console", Monaco, monospace;\n}'.trim();

var welcomeMessage = 'When we finished writing our new album, Glare, we knew we wanted to try something special for the release — and we kept coming back to the idea that we wanted our listeners to share the album with each other in person, over a conversation. As we started to develop the mechanics of glare.fm, it became clear that there was a magic in knowing that the music began its life with us, and made its way — one human at a time — to you.';

var subMessage = 'This experiment begins and ends with you - here\'s how it works:';

var directions = ['You can login at glare.fm anytime, but to listen to music, you\'ll have to get access from someone who’s already unlocked it.', 'In order to unlock glare.fm, someone who already has access must share it with you IN PERSON.', 'Once activated you\'ll have four songs to listen to, and you can unlock two more each time you share it with someone else.', 'You\'ll also be able to follow the album as it travels across the globe, and track your personal influence on its spread.'];

var email = _react2.default.createElement(
  _reactHtmlEmail.Email,
  { title: 'Welcome to glare.fm', headCSS: css },
  _react2.default.createElement(
    _reactHtmlEmail.Item,
    null,
    _react2.default.createElement(
      _reactHtmlEmail.Span,
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Welcome to glare',
        _react2.default.createElement(
          'span',
          null,
          '.'
        ),
        'fm'
      )
    )
  ),
  _react2.default.createElement(
    _reactHtmlEmail.Item,
    null,
    _react2.default.createElement(
      _reactHtmlEmail.Box,
      { width: '100%', style: { marginTop: '10px' } },
      _react2.default.createElement(
        _reactHtmlEmail.Item,
        null,
        _react2.default.createElement(
          'div',
          { style: { marginTop: '10px' } },
          welcomeMessage
        ),
        _react2.default.createElement(
          'div',
          { style: { marginTop: '10px' } },
          subMessage
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'ul',
            null,
            directions.map(function (line, index) {
              return _react2.default.createElement(
                'li',
                { style: { marginTop: '10px' }, key: index },
                line
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          null,
          'Developing ',
          _react2.default.createElement(
            _reactHtmlEmail.A,
            { href: 'glare.fm' },
            'glare.fm'
          ),
          ' has been a brand new experience for us -- and it\'s working because you all are finding somebody who has it, and going out into the real world to get it. It\'s exciting to share the music with you, but even more so to watch you share it with each other!'
        ),
        _react2.default.createElement(_reactHtmlEmail.Image, { Image: true, 'data-mc-bar': 'bar', 'data-mc-baz': 'baz', alt: 'react', src: 'https://glare.fm/img/the-m-machine-signature.png', width: 150, height: 77 })
      )
    )
  )
);

exports.default = email;