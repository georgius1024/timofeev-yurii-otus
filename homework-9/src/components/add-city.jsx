/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './add-city.css'

export default class AddCity extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '', typeahead: [] }
    this.onChange = this.onChange.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
  onChange(event) {
    this.setValue(event.target.value)
  }
  onKeyDown(event) {
    if (this.props.active && event.key === 'Escape') {
      this.onClose()
    }
  }
  setValue(value) {
    let typeahead = []
    if (value.length > 3) {
      typeahead = this.props.DB.filter(e =>
        e.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 50)
    }
    this.setState({ value, typeahead })
  }

  onClose() {
    this.props.onClose()
  }

  render() {
    let typeahead
    if (this.state.typeahead.length > 1) {
      const items = this.state.typeahead.map((item, index) => {
        const onSelect = () => {
          const city = { ...item }
          city.key =
            String(city.name) + '.' + String(city.lat) + '.' + String(city.lng)
          city.image = '/images/' + Math.ceil(Math.random() * 26) + '.jpg'
          this.props.onSubmit(city)
          this.setValue('')
        }
        return (
          <a key={index} className="typeahead-item" onClick={onSelect}>
            {item.name}, {item.country}
          </a>
        )
      })
      typeahead = <div className="typeahead">{items}</div>
    } else {
      typeahead = <div className="typeahead" />
    }
    return (
      <div className={'modal  ' + (this.props.active ? 'is-active' : '')}>
        <div className="modal-background" />
        <div className="modal-content has-background-white has-text-black-ter form">
          <div className="field">
            <label className="label">Add city</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Enter city name"
                value={this.state.value}
                onChange={this.onChange}
              />
              {typeahead}
            </div>
          </div>
        </div>
        <button className="modal-close is-large" onClick={this.onClose} />
      </div>
    )
  }
}

AddCity.propTypes = {
  DB: PropTypes.array.isRequired,
  active: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
