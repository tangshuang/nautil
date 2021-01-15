import React from 'react'
import { ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'

import I18n from './i18n.js'
import Component from '../component.js'
import { Observer } from '../components/observer.jsx'
import { pollute } from '../operators/operators.js'
import { pipe } from '../operators/combiners.js'

import { _Text } from './text.jsx'
import { _Locale } from './locale.jsx'

class _Language extends Component {
  static props = {
    i18n: I18n,
    dispatch: ifexist(Function),
    lng: ifexist(String), // force use a language
  }

  onMounted() {
    if (this.attrs.lng && this.attrs.lng !== this.attrs.i18n.getLang()) {
      this.attrs.i18n.setLang(lng)
    }
  }

  onUpdated() {
    if (this.attrs.lng && this.attrs.lng !== this.attrs.i18n.getLang()) {
      this.attrs.i18n.setLang(lng)
    }
  }

  render() {
    const { i18n, dispatch } = this.attrs
    const update = dispatch ? dispatch : this.update
    const children = this.children

    return (
      <Observer
        subscribe={dispatch => i18n.on('initialized', dispatch).on('loaded', dispatch).on('languageChanged', dispatch)}
        unsubscribe={dispatch => i18n.off('initialized', dispatch).off('loaded', dispatch).off('languageChanged', dispatch)}
        dispatch={update}
      >
        {isFunction(children) ? children(i18n) : children}
      </Observer>
    )
  }
}

export const Language = pipe([
  pollute(_Text, ({ i18n }) => ({ i18n })),
  pollute(_Locale, ({ i18n }) => ({ i18n })),
])(_Language)

export default Language
