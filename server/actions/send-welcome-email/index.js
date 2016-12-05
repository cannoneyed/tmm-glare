import ReactHTMLEmail from 'react-html-email'
ReactHTMLEmail.injectReactEmailAttributes()

import postmark from 'postmark'
import logger from 'winston'
import P from 'bluebird'
import config from 'config'
import email from '../../email/welcome'

const html = ReactHTMLEmail.renderEmail(email)
const client = new postmark.Client(config.postmark.id)

module.exports = ({ data, resolve, reject }) => {
  const { email } = data

  return P.coroutine(function* sendWelcomeEmail() {

    return P.fromCallback(cb => client.sendEmail({
      From: 'm@glare.fm',
      To: email,
      Subject: 'Welcome to glare.fm',
      HtmlBody: html,
    }, cb))


  })()
  .then(resolve)
  .catch((err) => {
    logger.error(err)

    return reject(err)
  })
}
