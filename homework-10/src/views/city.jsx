/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import config from '../config'
import './city.css'
import actions from '../store/actions'
const { removeCityAction } = actions

class CityView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temperature: 'N/A',
      feelsLike: 'N/A',
      cloud: 'N/A',
      wind: 'N/A',
      direction: 'N/A',
      pressure: 'N/A',
      conditionIcon: '',
      conditionDesc: 'N/A',
      localTime: 'N/A',
      forecast: [],
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.removeCity = this.removeCity.bind(this)
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
    this.requestApi()
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
  onKeyDown(event) {
    if (event.key === 'Escape') {
      window.history.go(-1)
    }
  }
  removeCity() {
    window.history.go(-1)
    this.props.removeCity()
  }
  static shouldComponentUpdate(nextProps, prevState) {
    if (nextProps.city.name !== this.props.city.name) {
      this.requestApi(nextProps.city.name)
      return true
    }
    return false
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // Оптимизация, а без нее - бесконечный цикл запросов
    if (prevProps.city.name !== this.props.city.name) {
      this.requestApi()
    }
  }
  requestApi() {
    if (this.props.city && this.props.city.id) {
      const url =
        config.APIXU_URL +
        '/forecast.json' +
        '?key=' +
        config.APIXU_KEY +
        '&q=' +
        this.props.city.lat +
        ',' +
        this.props.city.lng +
        '&days=5'
      fetch(url)
        .then(response => response.json())
        .then(({ current, location, forecast }) => {
          function forecastDay(date) {
            return {
              date: dayjs(date.date).format('DD.MM'),
              maxTemp: date.day.maxtemp_c,
              minTemp: date.day.mintemp_c,
              icon: date.day.condition.icon,
              conditionDesc: date.day.condition.text,
              humidity: date.day.avghumidity,
              wind: (date.day.maxwind_kph * 0.277778).toFixed(1), // km/h -> m/s
            }
          }
          const localTime = location.localtime.split(' ')[1]
          const localDate = location.localtime.split(' ')[0]
          this.setState({
            temperature: current.temp_c,
            feelsLike: current.feelslike_c,
            cloud: current.cloud,
            wind: (current.wind_kph * 0.277778).toFixed(1), // km/h -> m/s
            direction: current.wind_dir,
            degree: current.wind_degree,
            pressure: (current.pressure_mb * 0.750062).toFixed(0), // bar -> mmHg
            conditionIcon: current.condition.icon,
            conditionDesc: current.condition.text,
            humidity: current.humidity,
            localTime:
              dayjs(localDate).format('ddd, DD MMM') + ', ' + localTime,
            forecast: forecast.forecastday.map(forecastDay),
          })
        })
    }
  }

  render() {
    const city = this.props.city
    const current = this.state
    const forecast = current.forecast
    const locationUrl = `https://maps.google.com/?q=${city.lat},${city.lng}`
    return (
      <div className="city-view">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <Link to="/">Main</Link>
            </li>
            <li className="is-active">
              <a>{city.name}</a>
            </li>
          </ul>
        </nav>

        <section className="hero is-primary is-small is-bold">
          <div className="hero-body">
            <div className="container">
              <div className="pull-right">
                <a
                  className="has-text-light"
                  href={locationUrl}
                  target="_blank"
                >
                  <span className="icon is-small  mr4">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                  Open map
                </a>
              </div>
              <h1 className="title">{city.name}</h1>
              <h2 className="subtitle">{current.localTime}</h2>
              <div className="columns is-vcentered">
                <div className="column mr4">
                  <div className=" is-size-4">{current.temperature}°C</div>
                </div>
                <div className="column" style={{ paddingTop: 24 }}>
                  <span
                    className="icon is-large"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <img
                      align="left"
                      src={current.conditionIcon}
                      alt="conditions"
                    />
                  </span>
                </div>
                <div className="column is-full">{current.conditionDesc}</div>
              </div>
              <table className="table is-narrow ">
                <tbody>
                  <tr>
                    <td>Feels like</td>
                    <td>{current.feelsLike}°C</td>
                  </tr>
                  <tr>
                    <td>Wind</td>
                    <td>
                      <span className="mr4"> {current.wind}m/s</span>
                      <span className="icon is-small" title={current.direction}>
                        <i
                          className="fas fa-arrow-down"
                          style={{
                            transform: 'rotate(' + current.degree + 'deg)',
                          }}
                        />
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Pressure</td>
                    <td>{current.pressure}mmHg</td>
                  </tr>
                  <tr>
                    <td>Himidity</td>
                    <td>{current.humidity}%</td>
                  </tr>
                </tbody>
              </table>
              <div />
            </div>
          </div>
        </section>
        <section className="hero is-light">
          <div className="hero-body">
            <div className="container">
              <p className="subtitle">Forecast</p>
              <table className="table is-bordered is-condensed">
                <tbody>
                  <tr>
                    <td>Date</td>
                    <td>
                      T<sub>min,</sub> °C
                    </td>
                    <td>
                      T<sub>max,</sub> °C
                    </td>
                    <td>Himidity, %</td>
                    <td colSpan="2">Weather conditions</td>
                  </tr>
                  {forecast.map((day, index) => {
                    return (
                      <tr key={index}>
                        <td className="right">{day.date}</td>
                        <td className="right">{day.maxTemp}</td>
                        <td className="right">{day.minTemp}</td>
                        <td className="right">{day.humidity}</td>
                        <td>
                          <span className="icon">
                            <img
                              align="left"
                              src={current.conditionIcon}
                              alt="conditions"
                            />
                          </span>
                        </td>
                        <td>{current.conditionDesc}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column">
                <Link to="/" className="button is-primary">
                  <span className="icon is-medium mr4">
                    <i className="fa fa-chevron-left" />
                  </span>
                  Back
                </Link>
              </div>
              <div className="column">
                <a
                  className="button is-danger pull-right"
                  onClick={this.removeCity}
                >
                  <span className="icon  mr4">
                    <i className="fas fa-trash-alt" />
                  </span>
                  Delete city
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const cityId = ownProps.match.params.id
  return {
    city: state.find(e => String(e.id) === cityId) || {},
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const cityId = ownProps.match.params.id
  return {
    removeCity: () => dispatch(removeCityAction(cityId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CityView)
