import { renderToString } from 'react-dom/server'
import { isFunction, isString, interpolate } from '../core/utils.js'
import fs from 'fs'
import path from 'path'

export function createHttp(Component, props = {}, options = {}) {
  return async (req, res) => {
    const {
      navigations = [],
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

    // params to inject to page
    const context = { content: '' }

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
      output = interpolate(output, params)
      return output
    }

    if (!template) {
      const defaultTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'))
      context.content = replaceTemplateContent(defaultTemplate, context)
    }
    else if (isString(template)) {
      context.content = replaceTemplateContent(template, context)
    }
    else if (isFunction(template)) {
      context.content = template(context)
    }

    // do something before send back to client
    // developers can event change context.content here
    if (isFunction(onResponse)) {
      await onResponse.call(context, res)
    }

    res.send(Buffer.from(context.content))
  }
}
