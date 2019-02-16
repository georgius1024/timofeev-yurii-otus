// runner
const scan = require('./scan')
function help() {
  console.log('Recursive directory listing')
  console.log('Usage: npm run test -- path=<PATH>')
}
function runner(args) {
  let scanPath
  if (!args) {
    return help()
  }
  args.forEach(arg => {
    const [left, right] = arg.split('=')
    if (left === 'path') {
      scanPath = right
    }
  })
  if (!scanPath) {
    help()
  } else {
    console.log('Listing for ' + scanPath)
    return scan(scanPath)
      .then(console.log)
      .catch(console.error)
  }
}

module.exports = runner
