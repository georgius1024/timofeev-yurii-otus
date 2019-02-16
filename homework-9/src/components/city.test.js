import React from 'react'
import jest from 'jest-mock'
import renderer from 'react-test-renderer'
import City from './city'
const city = {
  country: 'RU',
  name: 'Moscow',
  lat: '55.75222',
  lng: '37.61556',
  image: '/images/11.jpg',
  temperature: '-7',
  humidity: '78',
  rain: '0',
  snow: '10',
  cloudiness: '80',
}
describe('City', () => {
  it('renders correctly', () => {
    const onRemove = jest.fn()
    const DOM = renderer.create(<City city={city} onRemove={onRemove} />)
    const html = JSON.stringify(DOM, null, 2)
    expect(html).toContain(city.name)
    expect(html).toContain(city.image)
    expect(html).toContain(city.lat)
    expect(html).toContain(city.lng)
    expect(DOM).toMatchSnapshot()
  })
})
