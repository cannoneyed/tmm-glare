import React from 'react'

export default function Footer({ setNotification }) {
  return (
    <footer className="footer">
      <div className="g-row">
        <div className="g-col">
          <h1
            className="footer-title"
            onClick={() => {
              setNotification(<h1>FUCK YOU</h1>)
            }}>About</h1>
        </div>
      </div>
    </footer>
  )
}
