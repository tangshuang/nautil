const fs = require('fs')

const content = fs.readFileSync(__dirname + '/../src/wechat/components/dynamic/dynamic.wxml').toString()
const matches = content.match(/bind(\w+)="/g)
  .map(item => item.replace('="', ''))
  .filter((item, i, arr) => arr.indexOf(item) === i)
console.log(matches)
