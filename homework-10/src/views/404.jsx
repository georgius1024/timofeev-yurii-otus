import React from 'react'
import { Link } from 'react-router-dom'
export default () => {
  return (
    <section className="hero is-danger">
      <div className="hero-body">
        <div className="container">
          <p className="title">Ooops!</p>
          <p className="subtitle">Page not found</p>
          <Link to="/" className="button is-primary">
            Go to main page
          </Link>
        </div>
      </div>
    </section>
  )
}
