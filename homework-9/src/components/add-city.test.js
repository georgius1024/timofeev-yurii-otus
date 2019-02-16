import React from 'react'
import jest from 'jest-mock'
import renderer from 'react-test-renderer'
import AddCity from './add-city'
describe('AddCity', () => {
  it('renders correctly', () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const DB = []
    const DOM = renderer.create(
      <AddCity active={true} onClose={onClose} onSubmit={onSubmit} DB={DB}/>
    )
    const html = JSON.stringify(DOM, null, 2)
    expect(DOM).toMatchSnapshot()
  })
})
