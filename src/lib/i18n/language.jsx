import React from 'react'
import { ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'

import I18n from './i18n.js'
import Component from '../core/component.js'
import { Observer } from '../core/components/observer.jsx'
import { pollute } from '../core/operators/operators.js'
import { pipe } from '../core/operators/combiners.js'

import { _Text } from './text.jsx'
import { _Locale } from './locale.jsx'

class _Language extends Component {
  static props = {
    i18n: I18n,
    dispatch: ifexist(Function),
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
