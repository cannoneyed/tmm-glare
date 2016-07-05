import React from 'react'

export default function Footer({ setNotification }) {
  return (
    <footer className="footer">
      <span
        className="footer-about"
        onClick={() => {
          setNotification(<h1>FUCK YOU</h1>)
        }}>About</span>
    </footer>
  )
}
