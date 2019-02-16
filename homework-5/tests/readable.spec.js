const { Writable } = require('stream')
const readable = require('../src/readable')

describe('readable', () => {
  const interceptedData = []
  const intercept = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
      interceptedData.push(chunk)
      if (interceptedData.length >= 5) {
        callback(new Error('please, stop!!!'))
      } else {
        callback()
      }
    },
  })

  it('can read from readable', () => {
    const v = [0.1, 0.2, 0.3, 0.6, 0.9]
    let index = 0
    let oldRoutine = Math.random
    Math.random = function() {
      return v[index++ % v.length]
    }
    intercept.on('error', function(error) {
      Math.random = oldRoutine
      expect(error.message).toBe('please, stop!!!')
      expect(interceptedData).toEqual(v)
    })
    readable.pipe(intercept)
  })
})
