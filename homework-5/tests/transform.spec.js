const transform = require('../src/transform')
const writable = require('../src/writable')
const { Writable } = require('stream')

describe('transform', () => {
  it('can write to transform', () => {
    const v = [100, 200, 300]
    let index = 0
    let oldRoutine = Math.random
    Math.random = function() {
      return v[index++ % v.length]
    }
    transform.pipe(writable)
    const mockLog = jest.fn()
    const saveLog = console.log
    console.log = mockLog
    transform.write(1)
    transform.write(2)
    transform.end(3)
    console.log = saveLog
    Math.random = oldRoutine
    expect(mockLog.mock.calls).toEqual[([101], [202], [303])]
  })
})
