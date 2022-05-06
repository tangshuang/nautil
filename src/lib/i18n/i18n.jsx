import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useForceUpdate } from '../hooks/force-update.js'
import { LanguageDetector } from './language-detector.js'
import { noop } from '../utils.js'

const i18nRootContext = createContext()
export function I18nRootProvider(props) {
  const { lanuage, children } = props
  const [lng, setLng] = useState(typeof lanuage === 'string' ? lanuage : '')

  const updateLng = useCallback((lanuage) => {
    if (lanuage === LanguageDetector) {
      const input = lanuage.getLang()
      updateLng(input)
    }
    else if (lanuage && lanuage instanceof Promise) {
      lanuage.then(updateLng).catch(noop)
    }
    else if (typeof lanuage === 'string') {
      setLng(lanuage)
    }
  }, [])

  useMemo(() => {
    if (lanuage !== lng) {
      updateLng(lanuage)
    }
  }, [lanuage])

  const ctx = useMemo(() => {
    return {
      lng,
      setLng: updateLng,
    }
  }, [lng])

  const { Provider } = i18nRootContext
  return (
    <Provider value={ctx}>
      {children}
    </Provider>
  )
}

export function useLanguage() {
  const { lng, setLng } = useContext(i18nRootContext)
  return [lng, setLng]
}

export function useI18n(i18n, lang) {
  useMemo(() => {
    if (lang) {
      i18n.setLng(lang)
    }
  }, [i18n])
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    i18n.on('changeLanguage', forceUpdate)
    i18n.on('changeResources', forceUpdate)
    return () => {
      i18n.off('changeLanguage', forceUpdate)
      i18n.off('changeResources', forceUpdate)
    }
  }, [i18n])
  useEffect(() => {
    if (i18n.lng !== lang) {
      i18n.setLng(lang)
    }
  }, [lang])
  return i18n
}

export function useTranslate(i18n, lang) {
  const [language] = useLanguage()
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    i18n.on('changeResources', forceUpdate)
    return () => {
      i18n.off('changeResources', forceUpdate)
    }
  }, [i18n])
  const lng = lang || language
  const t = (key, params) => i18n.parse(lng, key, params)
  return t
}
