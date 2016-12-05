import React from 'react'
import { Box, Email, Item, Span, Image, A } from 'react-html-email'

const css = `
@media only screen and (max-device-width: 480px) {
  font-size: 20px !important;
  font-family: "Lucida Console", Monaco, monospace;
}`.trim()

const welcomeMessage = 'When we finished writing our new album, Glare, we knew we wanted to try something special for the release — and we kept coming back to the idea that we wanted our listeners to share the album with each other in person, over a conversation. As we started to develop the mechanics of glare.fm, it became clear that there was a magic in knowing that the music began its life with us, and made its way — one human at a time — to you.'

const subMessage = 'This experiment begins and ends with you - here\'s how it works:'

const directions = [
  'You can login at glare.fm anytime, but to listen to music, you\'ll have to get access from someone who’s already unlocked it.',
  'In order to unlock glare.fm, someone who already has access must share it with you IN PERSON.',
  'Once activated you\'ll have four songs to listen to, and you can unlock two more each time you share it with someone else.',
  'You\'ll also be able to follow the album as it travels across the globe, and track your personal influence on its spread.',
]

const email = (
  <Email title="Welcome to glare.fm" headCSS={css}>
    <Item>
      <Span>
        <h2>Welcome to glare<span>.</span>fm</h2>
      </Span>
    </Item>
    <Item>
      <Box width="100%" style={{ marginTop: '10px' }}>
        <Item>
          <div style={{ marginTop: '10px' }}>{welcomeMessage}</div>
          <div style={{ marginTop: '10px' }}>{subMessage}</div>
          <div>
            <ul>
              { directions.map(((line, index) => (
                <li style={{ marginTop: '10px' }} key={index}>{line}</li>
              )))}
            </ul>
          </div>
          <div>
            Developing <A href="glare.fm">glare.fm</A> has been a brand new experience for us -- and it's working because you all are finding somebody who has it, and going out into the real world to get it. It's exciting to share the music with you, but even more so to watch you share it with each other!
          </div>
          <Image Image data-mc-bar="bar" data-mc-baz="baz" alt="react" src="https://glare.fm/img/the-m-machine-signature.png" width={150} height={77} />
        </Item>
      </Box>
    </Item>
  </Email>
)

export default email
