import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useForceUpdate } from '../hooks/force-update.js'
import { LanguageDetector } from './language-detector.js'

const i18nRootContext = createContext()
export function I18nRootProvider(props) {
  const { lanuage, children } = props
  const [lng, setLng] = useState(() => {
    return lanuage === LanguageDetector ? LanguageDetector.getLang() : lanuage
  })
  useEffect(() => {
    if (lanuage !== lng) {
      setLng(lanuage)
    }
  }, [lanuage])

  const ctx = useMemo(() => {
    return {
      lng,
      setLng,
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
