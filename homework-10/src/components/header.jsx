import React from 'react'
import Logo from '../assets/Weather-PNG-File.png'
import './header.css'
export default props => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src={Logo} className="logo" width="28" height="28" alt="logo" />
          <div className="is-size-4 m-l-3">{props.config.appName}</div>
        </a>
      </div>
    </nav>
  )
}
