const express = require('express')
const config = require('../webpack/basic.config')

const before = config.devServer.before

const app = express()
before(app)
app.listen(8085)
