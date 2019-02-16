const runner = require('../src/runner')
const path = require('path')
describe('index script', async () => {
  let oldLogProc, oldErrorProc, newLogProc, newErrorProc

  beforeEach(() => {
    oldLogProc = console.log
    oldErrorProc = console.error
    newLogProc = jest.fn()
    newErrorProc = jest.fn()
    console.log = newLogProc
    console.error = newErrorProc
  })

  it('works when valid params is specified', async () => {
    await runner(['path=./tests/foo'])
    expect(newLogProc.mock.calls).toMatchSnapshot()
    expect(newErrorProc.mock.calls.length).toBe(0)
  })

  it('helps when no params is specified', async () => {
    await runner()
    expect(newLogProc.mock.calls).toMatchSnapshot()
    expect(newErrorProc.mock.calls.length).toBe(0)
  })

  it('fails when wrong params is specified', async () => {
    await runner(['path=error'])
    expect(newLogProc.mock.calls).toMatchSnapshot()
    const errors = newErrorProc.mock.calls.map(e => e[0].code)
    expect(errors).toEqual(['ENOENT'])
  })

  afterEach(() => {
    console.log = oldLogProc
    console.error = oldErrorProc
  })
})
