import './navigation.js'
import './depository.js'

import '../dom/style.js'
import '../dom/components.js'
import '../dom/mobile-components.js'

import { renderToString } from 'react-dom/server'
import { isFunction, isString, interpolate, filter } from '../core/utils.js'
import fs from 'fs'
import path from 'path'

export function createHttp(Component, props = {}, options = {}) {
  return async (req, res) => {
    const {
      navigations = [],
      depositories = [],
      onRequest,
      onResponse,
      template,
    } = options

    // set url into navigation
    const url = req.originalUrl || req.url
    navigations.forEach((navigation) => {
      if (navigation.options.mode === 'history') {
        navigation.setUrl(url)
      }
    })

    // clear data, so that all depositories are clean
    depositories.forEach((depo) => {
      depo.setConfig()
    })

    // params to inject to page
    const context = {
      title: 'Nautil SSR!',
      description: '',
      content: '',
      url,
    }

    // fetch before render
    // return pending props to inject into component
    const usedProps = { ...props }
    if (isFunction(onRequest)) {
      const fetchedProps = await onRequest.call(context, req) || {}
      Object.assign(usedProps, fetchedProps)
    }

    // render to string
    context.content = renderToString(<Component {...usedProps} />)

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

    // the data which to inject into <head>
    const hydrateData = filter(context, (value, key) => {
      return ['title', 'description', 'content', 'url'].indexOf(key) === -1
    })
    context.hydrate_data = hydrateData

    // do something before send back to client
    // developers can event change context.content here
    if (isFunction(onResponse)) {
      await onResponse.call(context, res)
    }

    // inject context.hydrate_data
    context.content = context.content.replace('</head>', `<script>window.__hydrate_data=${JSON.stringify(context.hydrate_data)}</script></head>`)

    res.set('Content-Type', 'text/html')
    res.send(context.content)
  }
}
