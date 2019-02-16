/* eslint-disable default-case */
import consts from './consts'
function cityReducer(state = [], action) {
  switch (action.type) {
    case consts.addCity:
      const city = { ...action.payload }
      const cities = [...state].filter(e => e.id !== city.id)
      cities.push(city)
      return cities
    case consts.removeCity:
      return [...state].filter(e => String(e.id) !== action.payload)
  }
  return state
}

function withPersistence(reducer, key) {
  let stateRestored = false
  return (state, action) => {
    if (!stateRestored) {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          state = JSON.parse(stored)
        } catch (error) {
          state = undefined
        }
      }
      stateRestored = true
    }
    const newState = reducer(state, action)
    localStorage.setItem(key, JSON.stringify(newState))
    return newState
  }
}

export default withPersistence(cityReducer, 'cities-db')
