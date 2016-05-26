import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="g-row">
        <div className="g-col">
          <h1
            className="footer__title"
            onClick={() => {
              console.log('FUCK YOU!')
            }}>About</h1>
        </div>
      </div>
    </footer>
  )
}
