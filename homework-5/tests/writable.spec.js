const writable = require('../src/writable')

describe('writable', () => {
  it('can write to writable', () => {
    const chunk = 'happy tree friends'
    const mockLog = jest.fn()
    const saveLog = console.log
    console.log = mockLog
    writable.end(chunk)
    console.log = saveLog
    expect(mockLog.mock.calls).toEqual[[chunk]]
  })
})
