import './polyfills.js'

import ReactDOMServer from 'react-dom/server'
import { isFunction, isString, interpolate, filter } from '../core/utils.js'
import fs from 'fs'
import path from 'path'
import { asyncMap, awaitx } from 'asw'
import Storage from '../core/storage.js'

export function createHttp(App, props = {}, options = {}) {
  return async (req, res) => {
    const {
      navigations = [],
      depositories = [],
      stores = [],
      models = [],
      i18ns = [],
      onRequest,
      onResponse,
      template,
    } = options

    // set url into navigation
    const url = req.originalUrl || req.url
    // get language
    let language = ''
    // url?lng=xxx
    if (!language && req.query.lng) {
      language = req.query.lng
    }
    // cookie
    if (!language && req.cookies) {
      language = req.cookies.language
    }
    // browser langauage
    const acceptLanguage = req.get('Accept-Language')
    if (!language && acceptLanguage) {
      language = acceptLanguage.split(',').shift()
    }

    // clear function
    const clear = async () => {
      // clear local storage
      await Storage.clear()

      // clear depositories
      await asyncMap(depositories, async (depo) => {
        await awaitx(depo.store.clear())
      })

      // clear stores
      stores.forEach((store) => {
        store.data = {}
      })

      // clear models
      models.forEach((model) => {
        model.data = {}
      })

      // set default language
      i18ns.forEach((i18n) => {
        i18n.setLang('undefined')
      })
    }

    // params to inject to page
    const context = {
      title: 'Nautil SSR!',
      description: '',
      content: '',
      url,
      language,
    }

    // fetch before render
    // return pending props to inject into component
    const usedProps = { ...props }
    if (isFunction(onRequest)) {
      const fetchedProps = await awaitx(onRequest.call(context, req) || {})
      Object.assign(usedProps, fetchedProps)
    }

    // clear before all
    await clear()

    // change navigation state
    navigations.forEach((navigation) => {
      if (navigation.options.mode === 'history') {
        navigation.setUrl(context.url)
      }
    })

    // set language
    i18ns.forEach((i18n) => {
      i18n.setLang(context.language)
    })
    // set language to cookie
    if (res.cookie) {
      res.cookie('language', context.language)
    }

    // render to string
    context.content = ReactDOMServer.renderToString(<App {...usedProps} />)

    const replaceTemplateContent = (content, params) => {
      // use comment tag
      let output = content.replace(/\<\!\-\-(.*?)\-\-\>/g, (match, key) => {
        const name = key.toLowerCase().trim()
        return params[name] ? params[name] : match
      })
      // use {key}
      output = interpolate(output, params, { delimiter: '____' })
      return output
    }

    if (!template) {
      const defaultTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), { encoding: 'utf-8' })
      const template = defaultTemplate.toString()
      context.content = replaceTemplateContent(template, context)
    }
    else if (isString(template)) {
      context.content = replaceTemplateContent(template, context)
    }
    else if (isFunction(template)) {
      context.content = template(context)
    }

    // collect depos data
    context.depositories_data = []
    await asyncMap(depositories, async (depo, i) => {
      const store = depo.store
      const keys = await awaitx(store.keys())
      const data = await asyncMap(keys, async (key) => {
        const value = await awaitx(store.get(key))
        return { key, value }
      })
      context.depositories_data[i] = data
    })

    // collect stores data
    context.stores_data = []
    stores.forEach((store) => {
      context.stores_data.push(store.data)
    })

    // collect models data
    context.models_data = []
    models.forEach((model) => {
      context.models_data.push(model.data)
    })

    // the data which to inject into <head>
    const hydrateData = filter(context, (value, key) => {
      return ['title', 'description', 'content', 'url', 'language', 'stores_data', 'models_data', 'depositories_data'].indexOf(key) === -1
    })
    context.hydrate_data = hydrateData

    // do something before send back to client
    // developers can event change context.content here
    if (isFunction(onResponse)) {
      await awaitx(onResponse.call(context, res))
    }

    // inject context data into html
    let replacement = `<script>window.__hydrate_data=${JSON.stringify(context.hydrate_data)};`
    if (context.stores_data.length) {
      replacement += `window.__stores_data=${JSON.stringify(context.stores_data)};`
    }
    if (context.models_data.length) {
      replacement += `window.__models_data=${JSON.stringify(context.models_data)};`
    }
    if (context.depositories_data.length) {
      replacement += `window.__depositories_data=${JSON.stringify(context.depositories_data)};`
    }
    if (language) {
      replacement += `window.__language=${JSON.stringify(context.language)};`
    }
    replacement += `</script>`
    // place behind the first script tag
    const html = context.content.replace('<script', replacement + '<script')

    // clear after all
    await clear()

    res.set('Content-Type', 'text/html')
    res.end(html)
  }
}
