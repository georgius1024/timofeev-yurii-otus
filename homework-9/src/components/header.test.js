import React from 'react'
import renderer from 'react-test-renderer'
import Header from './Header'
import config from '../config'
describe('header', () => {
  it('renders correctly', () => {
    const DOM = renderer.create(<Header config={config} />)
    const html = JSON.stringify(DOM, null, 2)
    expect(html).toContain(config.appName)
    expect(DOM).toMatchSnapshot()
  })
})
