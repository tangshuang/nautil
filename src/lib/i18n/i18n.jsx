import { createContext, useContext, useEffect, useMemo, useCallback, useState } from 'react'
import { useForceUpdate } from '../hooks/force-update.js'
import { isArray, interpolate } from 'ts-fns'
import { LanguageDetector } from './language-detector.js'

const i18nContext = createContext()

export function I18nProvider(props) {
  const parent = useContext(i18nContext)
  if (parent) {
    throw new Error('[Nautil]: I18nProvider can only be used on your root application component with createBootstrap')
  }

  const { value, children } = props
  const { lang } = value

  const lng = !lang || lang === LanguageDetector ? LanguageDetector.getLang() : lang
  const [lnga, setLang] = useState(lng)
  const { Provider } = i18nContext

  useEffect(() => {
    if (lng instanceof Promise) {
      lng.then((langu) => setLang(langu))
    }
  }, [lnga])

  const lngu = lnga instanceof Promise ? '' : lnga

  return (
    <Provider value={{ lang: lngu, setLang }}>
      {children}
    </Provider>
  )
}

export function useLang(detail) {
  const ctx = useContext(i18nContext)
  if (!ctx) {
    throw new Error('[Nautil]: you should must call useLang inside application component with createBootstrap')
  }
  const { lang, setLang } = ctx
  return detail ? { lang, setLang } : lang
}

export class I18n {
  constructor(options) {
    const { resources, ...opts } = options
    this.resources = resources
    this.options = opts
    this.packages = {}
  }

  useTranslate = (lang) => {
    const globalLang = useLang()
    const lng = lang || globalLang

    const forceUpdate = useForceUpdate()
    useEffect(() => {
      const package = this.packages[lng]
      if (package) {
        return
      }

      if (!this.resources[lng]) {
        return
      }

      this.resources[lng]().then((pkg) => {
        this.packages[lng] = pkg
        forceUpdate()
      })
    }, [lng])

    const package = useMemo(() => {
      return this.packages[lng] || {}
    }, [this.packages[lng]])

    const t = useCallback((key, params) => {
      if (isArray(key)) {
        const entryKey = key.find(k => package[k])
        if (!entryKey) {
          return key[key.length - 1]
        }
        return t(entryKey, params)
      }
      else {
        const entry = package[entryKey]
        if (!entry) {
          return entryKey
        }
        const res = params ? interpolate(entry, params) : entry
        return res
      }
    }, [lng])

    const Translate = useCallback((props) => {
      const { name, children, params } = props
      return t([name, children], params)
    }, [lng])

    t.T = Translate
    t.t = t

    return t
  }

  T = (props) => {
    const { name, children, params, lang } = props
    const t = this.useTranslate(lang)
    return t([name, children], params)
  }
}