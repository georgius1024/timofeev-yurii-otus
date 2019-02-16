/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import config from '../config'
import actions from '../store/actions'
import './add-city.css'
const { addCityAction } = actions
const debounce = require('lodash.debounce')

class AddCityView extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '', typeahead: [] }
    this.onChange = this.onChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.fetchTypeahead = debounce(this.fetchTypeahead.bind(this), 300)
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
    if (event.key === 'Escape') {
      window.history.go(-1)
    }
  }
  setValue(value) {
    this.setState({ value })
    this.fetchTypeahead()
  }
  fetchTypeahead() {
    const value = this.state.value
    if (value.length > 3) {
      const url =
        config.APIXU_URL +
        '/search.json' +
        '?key=' +
        config.APIXU_KEY +
        '&q=' +
        value
      fetch(url)
        .then(response => response.json())
        .then(cities => {
          const typeahead = cities.map(city => {
            const parts = city.name.split(',')
            return {
              id: city.id,
              fullName: city.name,
              name: parts[0],
              lat: city.lat,
              lng: city.lon,
            }
          })
          this.setState({ typeahead })
        })
    } else {
      this.setState({ typeahead: [] })
    }
  }

  render() {
    let typeahead
    if (this.state.typeahead.length > 1) {
      const items = this.state.typeahead.map((item, index) => {
        const onSelect = () => {
          const city = { ...item }
          this.props.addCity(city)
          this.setState({
            value: '',
            typeahead: [],
          })
          window.history.go(-1)
        }
        return (
          <a key={index} className="typeahead-item" onClick={onSelect}>
            {item.fullName}
          </a>
        )
      })
      typeahead = <div className="typeahead">{items}</div>
    } else {
      typeahead = <div className="typeahead" />
    }
    return (
      <div className="add-city-view">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <Link to="/">Main</Link>
            </li>
            <li className="is-active">
              <a>Add city</a>
            </li>
          </ul>
        </nav>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <div className="pull-right">
                <Link to="/">
                  <span className="icon">
                    <i className="fas fa-lg fa-times" />
                  </span>
                </Link>
              </div>

              <h1 className="title">Add city</h1>
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
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cities: state,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addCity: city => dispatch(addCityAction(city)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCityView)
