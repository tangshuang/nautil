import { renderToString } from 'react-dom/server'
import { isFunction, isString, interpolate, each } from '../core/utils.js'
import fs from 'fs'
import path from 'path'

export function createHttp(Component, props = {}, options = {}) {
  return async (req, res) => {
    const {
      useOriginalUrl = false,
      navigations = [],
      onFetch,
      onSend,
      template,
    } = options
    const url = useOriginalUrl ? req.originalUrl : req.url

    // set url into navigation
    navigations.forEach((navigation) => {
      if (navigation.options.mode === 'history') {
        navigation.setUrl(url)
      }
    })

    const usedProps = { ...props }
    // todo: set data into depositories
    if (isFunction(onFetch)) {
      const fetchedProps = await onFetch(req) || {}
      Object.assign(usedProps, fetchedProps)
    }

    // render to string
    const content = renderToString(<Component {...usedProps} />)

    // make html
    let html = ''
    const { status } = navigation
    const replaceTemplate = (html, params) => {
      // use comment tag
      let output = html.replace(/\<\!\-\-(.*?)\-\-\>/g, (match, key) => {
        const name = key.toLowerCase().trim()
        return params[name] ? params[name] : match
      })
      // use {key}
      output = interpolate(output, params)
      return output
    }
    const makeHTML = (template) => {
      const { state, status, params, routes, options } = navigation
      const renderNotFound = () => {
        const { notFound } = options
        const pageInfo = notFound && notFound.pageInfo ? notFound.pageInfo : {}
        const html = replaceTemplate(template, {
          ...pageInfo,
          content,
        })
        return html
      }
      // use root route as page router
      if (status) {
        const { name } = state
        const rootRouteName = name.split('.').shift()
        const rootRoute = routes.find(item => item.name === rootRouteName)
        if (!rootRoute) {
          return renderNotFound()
        }

        const pageInfo = rootRoute.pageInfo || {}
        each(pageInfo, (value, key) => {
          pageInfo[key] = interpolate(value, params)
        })

        const html = replaceTemplate(template, {
          ...pageInfo,
          content,
        })
        return html
      }
      // not found
      else {
        return renderNotFound()
      }
    }
    if (!template) {
      const defaultTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'))
      html = makeHTML(defaultTemplate)
    }
    else if (isString(template)) {
      html = makeHTML(template)
    }
    else if (isFunction(template)) {
      html = template(content, { title, description, content })
    }

    // send
    if (!status) {
      res.status(404)
    }

    if (isFunction(onSend)) {
      html = onSend(res, html) || html
    }

    res.send(Buffer.from(html))
  }
}
