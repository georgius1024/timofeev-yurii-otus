const readable = require('./src/readable')
const writable = require('./src/writable')
const transform = require('./src/transform')

readable.pipe(transform).pipe(writable)
