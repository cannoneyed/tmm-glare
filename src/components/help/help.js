import React from 'react'

import { faqs } from './faqs'

const Help = () => {

  return (
    <div className="help-container scrollable">
      {
        faqs.map((question, index) => (
          <div key={index} className="faq-container">
            <h3 className="faq-title">{question.title}</h3>
            {
              question.answer.map((answerLine, index) => (
                <div key={index} className="faq-item">{answerLine}</div>
              ))
            }
          </div>
        ))
      }
      <h3 className="message-us-title">Still need help? </h3>
      <a href="mailto:help@glare.fm">Send us an email</a>
      <div className="help-spacer" />
    </div>
  )
}

export default Help
