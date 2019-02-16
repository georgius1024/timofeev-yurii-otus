import React from 'react'
import renderer from 'react-test-renderer'
import Footer from './footer'
import config from '../config'
describe('footer', () => {
  it('renders correctly', () => {
    const DOM = renderer.create(<Footer config={config} />)
    const html = JSON.stringify(DOM, null, 2)
    expect(html).toContain(config.copyright)
    expect(html).toContain(config.contactUrl)
    expect(DOM).toMatchSnapshot()
  })
})
