const fs = require('fs')
const path = require('path')

// replace \\ with /
function fixSlash(s) {
  return s.replace(new RegExp('\\\\', 'g'), '/')
}

function scan(scanPath) {
  let result = {
    files: [],
    dirs: [],
  }
  // Promisified wrapper for fs.readdir
  // Recursively process files and subfolder in scanPath
  function scanFolder(scanPath) {
    result.dirs.push(fixSlash(path.normalize(scanPath)))
    return new Promise((resolve, reject) => {
      const options = {
        withFileTypes: true,
      }
      fs.readdir(scanPath, options, (error, items) => {
        if (error) {
          reject(error)
        }
        if (!items) {
          return resolve(result)
        }
        const files = items
          .filter(e => !e.isDirectory())
          .map(e => fixSlash(path.join(scanPath, e.name)))
        const folders = items
          .filter(e => e.isDirectory())
          .map(e => path.join(scanPath, e.name))

        result.files = result.files.concat(files)
        folders
          .reduce((prev, folder) => {
            return new Promise((resolve, reject) => {
              scanFolder(folder)
                .then(resolve)
                .catch(reject)
            })
          }, Promise.resolve())
          .then(() => resolve(result))
          .catch(console.error)
      })
    })
  }
  return scanFolder(scanPath)
}

module.exports = scan
