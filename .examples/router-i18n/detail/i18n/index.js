import { I18n } from 'nautil'

export const { T, useLang, useLocale, setLang } = new I18n({
  resources: {
    zh: async () => {},
    en: async () => {},
  },
  // resolve({ lang }) {
  //   return lang
  // },
})
