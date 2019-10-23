import { createHttp } from 'nautil/ssr'
import App from './app.jsx'
import navigation from './navigation.js'
import depo from './depo.js'

import express from 'express'
import path from 'path'

// prepare for backend api base url
const baseURL = process.env.API_BASE_URL

const app = express()
const http = createHttp(App, {}, {
  // set state of navigations which based on url
  navigations: [
    navigation,
  ],
  // before render, request data from real backend
  async onFetch(req) {
    const { id } = req.params
    const headers = req.headers
    // override data request basic info
    depo.setConfig({
      headers,
      baseURL,
    })
    // send request to fill data in depo
    await depo.request('user', { id })
    // or you can use depo.set(id, params, data) to set data by yourself
  },
  onSend() {
    // release memory
    navigation._history.length = 0
    depo.store.clear()
  },
})

app.use(express.static(path.resolve(__dirname, 'public')))
app.use('*', http)

app.listen(3000)
