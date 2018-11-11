const http = require('http')
const port = 8080

const requestHandler = (req, res) => {
  setTimeout(() => {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    })
    res.write('Ахалай-махалай!')
    res.end()
  }, 100)
}

const server = http.createServer(requestHandler)

server.listen(port, (error) => {
  if (error) {
    return console.error(error)
  }
  console.log(`Server is listening port ${port}`)
})