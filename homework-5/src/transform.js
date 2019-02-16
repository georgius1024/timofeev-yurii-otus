const { Transform } = require('stream')

const transform = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    callback(null, chunk + Math.random())
  },
})

module.exports = transform
