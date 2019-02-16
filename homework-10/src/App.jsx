import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/footer'
import CityView from './views/city'
import IndexView from './views/index'
import AddCityView from './views/add-city'
import ErrorView from './views/404'
import config from './config'

class App extends Component {
  componentDidMount() {
    if (this.props.cities.length === 0) {
      this.addCity()
    }
  }

  render() {
    return (
      <div>
        <Header config={config} />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={IndexView} />
            <Route exact path="/city/:id" component={CityView} />
            <Route exact path="/add" component={AddCityView} />
            <Route exact path="*" component={ErrorView} />
          </Switch>
        </BrowserRouter>
        <Footer config={config} />
      </div>
    )
  }

  removeCity(id) {
    this.props.removeCity(id)
    if (this.props.cities.length === 1) {
      this.addCity()
    }
  }
  addCity() {
    this.setState({
      modalActive: true,
    })
  }
  submitCity(city) {
    this.closeModal()
    this.props.addCity(city)
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

export default connect(mapStateToProps)(App)
