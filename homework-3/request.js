const http = require('http')
const port = 8080
const host = 'localhost'

// Parse params
const args = {}

if (process.argv.length < 3) {
  help()
}

process.argv.forEach(arg => {
  const [param, value] = arg.split('=')
  if (typeof value === 'undefined') {
    // unary parameter
    args[param] = true
  } else {
    args[param] = value
  }
})

// No default value for number of requests
if (!Number(args.requests)) {
  help()
}

// synonyms to parallel
if (typeof args.parallel === 'string') {
  args.parallel = ['yes', 'y', 'on'].includes(args.parallel.toLowerCase())
}

console.log(`Sending ${args.requests} ${args.parallel ? 'parallel' : 'sequental'} requests to http://${host}:${port}`)

if (args.parallel) {
  const promises = new Array(args.requests)
  for(let i = 0; i < args.requests; i++) {
    promises[i] = makeRequest(i)
  }
  Promise.all(promises) // || 
    .then(() => {
      console.log('done')
    })
    .catch(error => {
      console.error(error)
    })
} else {
  const items = new Array(args.requests)
  for(let i = 0; i < args.requests; i++) {
    items[i] = i
  }

  items.reduce((accum, index) => {
    const promise =
       accum
        .then(() => makeRequest(index))
    return promise
  }, Promise.resolve())
    .then(() => {
      console.log('done')
    })
    .catch(error => {
      console.error(error)
    })
}

function makeRequest(index) {
  return new Promise((resolve, reject) => {
    http.get(`http://${host}:${port}`, (res) => {
      res.on('data', () => {})
      res.on('end', () => {
        console.log(`${index + 1}: OK`)
        resolve(index)
      })
    })
    .on('error', (error) => {
        reject(error)
    })
  })
}

function help() {
  console.log(`
    script for send parallel or sequental requests to http://${host}:${port}
    arguments:
    requests=<number-of-requests>
    parallel[=<y[es]|on>]            if omitted or negative - sequental order`)
  process.exit(1)
}
