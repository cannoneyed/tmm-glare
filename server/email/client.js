import ReactHTMLEmail from 'react-html-email'
ReactHTMLEmail.injectReactEmailAttributes()

import config from 'config'
import postmark from 'postmark'

const client = new postmark.Client(config.postmark.id)

export default client
