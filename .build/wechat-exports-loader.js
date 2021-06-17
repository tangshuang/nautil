const path = require('path')
const fs = require('fs')

const libFile = path.resolve(__dirname, '../src/index.js')
const wxFile = path.resolve(__dirname, '../src/wechat/index.js')

const libContent = fs.readFileSync(libFile).toString()
const wxContent = fs.readFileSync(wxFile).toString()

module.exports = function(content) {
  if (this.resourcePath === libFile) {
    return `export * from './wechat'`
  }

  if (this.resourcePath === wxFile) {
    const wxLines = wxContent.split('\n')

    const contents = libContent.split('\n').map((line) => {
      if (line.indexOf("from './lib") === -1) {
        return line
      }
      return line.replace('./lib/', '../lib/')
    })

    wxLines.forEach((line) => {
      if (line.indexOf("from './") === -1) {
        return
      }

      const [_, file] = line.match(/from '(.*?)'/)
      if (fs.existsSync(path.resolve(__dirname, '../src/lib', file))) {
        contents.push(`import '${file}'`)
      }
      else {
        contents.push(line)
      }
    })

    return contents.join('\n')
  }

  return content
}
