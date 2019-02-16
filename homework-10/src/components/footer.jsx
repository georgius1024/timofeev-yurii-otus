/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import './footer.css'
export default props => {
  return (
    <footer className="footer">
      <div className="content is-small">
        <a
          href={props.config.contactUrl}
          target="_blank"
          className="has-text-white"
          rel="noopener"
        >
          {props.config.copyright}
        </a>
      </div>
    </footer>
  )
}
