const { Readable } = require('stream')

const readable = new Readable({
  highWaterMark: 100,
  objectMode: true,
  read() {
    this.push(Math.random())
  },
})

module.exports = readable
