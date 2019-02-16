const { Writable } = require('stream')

const writable = new Writable({
  highWaterMark: 100,
  objectMode: true,
  write(chunk, encoding, callback) {
    console.log(chunk)
    callback(null)
  },
})

module.exports = writable
