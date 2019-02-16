import consts from './consts'
function addCityAction(city) {
  return {
    type: consts.addCity,
    payload: city,
  }
}

function removeCityAction(key) {
  return {
    type: consts.removeCity,
    payload: key,
  }
}

export default { addCityAction, removeCityAction }
