import { I18n } from 'nautil'

export const { T, useLang, setLang, useLocale, useTranslate } = new I18n({
  resources: {
    zh: async () => {},
    en: async () => {},
  },
})
