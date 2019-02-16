/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'

class IndexView extends Component {
  constructor(p, c) {
    super(p, c)
    this.state = { search: '' }
    this.onChange = this.onChange.bind(this)
  }
  onChange(event) {
    this.setState({ search: event.target.value })
  }

  render() {
    const { search } = this.state || {}
    const cities = this.props.cities
      .map((city, index) => {
        if (
          !search ||
          city.fullName.toLowerCase().includes(search.toLowerCase())
        ) {
          return (
            <li key={index}>
              <Link to={`/city/${city.id}/`}>{city.fullName}</Link>
            </li>
          )
        } else {
          return false
        }
      })
      .filter(item => Boolean(item))

    return (
      <div className="columns">
        <div className="column" style={{ padding: '16px' }}>
          <div className="control" style={{ margin: '16px' }}>
            <input
              className="input"
              type="text"
              placeholder="Enter city name"
              value={search}
              onChange={this.onChange}
            />
          </div>

          <aside className="menu">
            {cities.length ? (
              <div>
                <p className="menu-label">Select city</p>
                <ul className="menu-list">{cities}</ul>
              </div>
            ) : (
              false
            )}
            {!cities.length && search ? (
              <ul className="menu-list">
                <li>Search string "{search}" not found in list</li>
              </ul>
            ) : (
              false
            )}

            {cities.length ? (
              <div className="menu-label">
                <hr />
              </div>
            ) : (
              ''
            )}

            <ul className="menu-list">
              <li>
                <Link to="/add">
                  <span className="icon">
                    <i className="fas fa-plus" />
                  </span>
                  Add city
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    cities: state,
  }
}

export default connect(mapStateToProps)(IndexView)
