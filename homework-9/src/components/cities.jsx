/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Cities extends Component {
  render() {
    const selectedCity = this.props.selected && this.props.selected.name
    const cities = this.props.cities.map((city, index) => {
      const onclick = () => {
        this.props.onSelect(city)
      }
      const isSelected = selectedCity === city.name
      return (
        <li key={index}>
          <a onClick={onclick} className={isSelected ? 'is-active' : ''}>
            {city.name}
          </a>
        </li>
      )
    })
    return (
      <aside className="menu">
        {cities.length ? <p className="menu-label">Select city</p> : ''}

        <ul className="menu-list">{cities}</ul>
        {cities.length ? (
          <div className="menu-label">
            <hr />
          </div>
        ) : (
          ''
        )}

        <ul className="menu-list">
          <li>
            <a onClick={this.props.onAdd}>
              <span className="icon">
                <i className="fas fa-plus" />
              </span>
              Add city
            </a>
          </li>
        </ul>
      </aside>
    )
  }
}

Cities.propTypes = {
  cities: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
}
