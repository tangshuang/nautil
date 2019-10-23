import { createHttp } from 'nautil/ssr'
import App from './app.jsx'
import navigation from './navigation.js'
import depo from './depo.js'

import express from 'express'
import path from 'path'

const baseURL = process.env.API_BASE_URL

// override data request base info
depo.setConfig({
  baseURL,
})

const app = express()
const http = createHttp(App, {}, {
  navigation,
  // before render, request data from real backend
  async onFetch(req) {
    const { id } = req.params
    await depo.request('user', { id })
  },
})

app.use(express.static(path.resolve(__dirname, 'public')))
app.use('*', http)

app.listen(3000)
