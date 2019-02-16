/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'
import config from '../config'
import PropTypes from 'prop-types'
import './city.css'

export default class ViewCity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temperature: 'N/A',
      feelsLike: 'N/A',
      cloud: 'N/A',
      wind: 'N/A',
      direction: 'N/A',
      pressure: 'N/A',
      conditionIcon: false,
      conditionDesc: 'N/A',
      localTime: 'N/A',
    }
  }
  static shouldComponentUpdate(nextProps, prevState) {
    if (nextProps.city.name !== this.props.city.name) {
      this.requestApi(nextProps.city.name)
      return true
    }
    return false
  }
  componentDidMount() {
    this.requestApi()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // Оптимизация, а без нее - бесконечный цикл запросов
    if (prevProps.city.name !== this.props.city.name) {
      this.requestApi()
    }
  }
  requestApi() {
    if (this.props.city) {
      const url =
        config.APIXU_URL +
        '?key=' +
        config.APIXU_KEY +
        '&q=' +
        this.props.city.lat +
        ',' +
        this.props.city.lng
      fetch(url)
        .then(response => response.json())
        .then(({ current, location }) => {
          const time = location.localtime.split(' ')[1]
          this.setState({
            temperature: current.temp_c,
            feelsLike: current.feelslike_c,
            cloud: current.cloud,
            wind: (current.wind_kph * 0.277778).toFixed(1), // km/h -> m/s
            direction: current.wind_dir,
            pressure: (current.pressure_mb * 0.750062).toFixed(0), // bar -> mmHg
            conditionIcon: current.condition.icon,
            conditionDesc: current.condition.text,
            humidity: current.humidity,
            localTime: time,
          })
        })
    }
  }
  render() {
    const city = this.props.city
    const current = this.state
    const onRemove = () => {
      this.props.onRemove(city.key)
    }
    const locationUrl = `https://maps.google.com/?q=${city.lat},${city.lng}`
    const imageUrl = encodeURI(city.image)
    return (
      <div className="city">
        <div
          className="city-inner"
          style={{ backgroundImage: 'url(' + imageUrl + ')' }}
        >
          <div className="city-canvas">
            <div style={{ textAlign: 'right' }}>
              <a
                className="is-light has-text-white"
                href={locationUrl}
                target="_blank"
              >
                <span className="icon is-small  mr4">
                  <i className="fas fa-map" />
                </span>
                Open map
              </a>
            </div>
            <div className="header">{city.name}</div>
            <div style={{ textAlign: 'center' }}>
              {current.conditionIcon ? (
                <div>
                  <img src={current.conditionIcon} alt="conditions" />
                  <div>{current.conditionDesc}</div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="column">
              <div>
                Temperature: {current.temperature}°C, feels like{' '}
                {current.feelsLike}°C
              </div>
              <div>Himidity: {current.humidity}%</div>
              <div>Pressure: {current.pressure}mmHg</div>
              <div>
                Wind: {current.wind}m/s {current.direction}
              </div>
              <div>Local time: {current.localTime}</div>
            </div>
          </div>
          <div className="removeControl">
            <a
              className="button is-small is-danger is-outlined"
              onClick={onRemove}
            >
              Delete city
            </a>
          </div>
        </div>
      </div>
    )
  }
}

ViewCity.propTypes = {
  city: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
}
