import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './components/header'
import Footer from './components/footer'
import Cities from './components/cities'
import City from './components/city'
import AddCity from './components/add-city'
import config from './config'
import actions from './store/actions'
const { addCityAction, removeCityAction } = actions
class App extends Component {
  constructor(p, c) {
    super(p, c)
    this.selectCity = this.selectCity.bind(this)
    this.addCity = this.addCity.bind(this)
    this.removeCity = this.removeCity.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.submitCity = this.submitCity.bind(this)
    const cities = this.props.cities.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    this.state = {
      selectedCity: cities[0],
      modalActive: false,
      dbIsLoaded: false,
      DB: [],
    }
  }

  componentDidMount() {
    if (this.props.cities.length === 0) {
      this.addCity()
    }
  }

  render() {
    const selectedCity = this.state.selectedCity
    const cities = this.props.cities.sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    const DB = this.state.DB
    const modalActive = this.state.modalActive
    return (
      <div>
        <AddCity
          DB={DB}
          active={modalActive}
          onClose={this.closeModal}
          onSubmit={this.submitCity}
        />
        <Header config={config} />
        <div className="columns">
          <div className="column is-two-fifths" style={{ padding: '16px' }}>
            <Cities
              cities={cities}
              selected={selectedCity}
              onSelect={this.selectCity}
              onAdd={this.addCity}
            />
          </div>
          <div className="column is-three-fifths">
            {selectedCity ? (
              <City city={selectedCity} onRemove={this.removeCity} />
            ) : (
              ''
            )}
          </div>
        </div>
        <Footer config={config} />
      </div>
    )
  }
  selectCity(city) {
    this.setState({
      selectedCity: city,
    })
  }
  removeCity(key) {
    const currentCityIndex = this.props.cities.findIndex(e => e.key === key)
    this.props.removeCity(key)
    if (currentCityIndex === this.props.cities.length - 1) {
      this.selectCity(this.props.cities[currentCityIndex - 1])
    } else {
      this.selectCity(this.props.cities[currentCityIndex + 1])
    }
    if (this.props.cities.length === 1) {
      this.addCity()
    }
  }
  addCity() {
    if (!this.state.dbIsLoaded) {
      fetch('/cities.json')
        .then(response => response.json())
        .then(DB => {
          this.setState({
            DB,
            dbIsLoaded: true,
            modalActive: true,
          })
        })
    } else {
      this.setState({
        modalActive: true,
      })
    }
  }
  submitCity(city) {
    this.closeModal()
    this.props.addCity(city)
    this.selectCity(city)
  }
  closeModal() {
    this.setState({
      modalActive: false,
    })
  }
}

const mapStateToProps = state => {
  return {
    cities: state,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addCity: city => dispatch(addCityAction(city)),
    removeCity: key => dispatch(removeCityAction(key)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
