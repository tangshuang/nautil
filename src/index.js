import * as TySheMo from 'tyshemo'
import React from 'react'
import produce from 'immer'

export { TySheMo, React, produce }
export {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  Fragment,
  createElement,
  cloneElement,
  Children,
  createRef,
  isValidElement,
  PureComponent,
  createRef,
  createContext,
  Suspense,
} from 'react'
export {
  Ty,
  Dict,
  Tuple,
  List,
  Enum,
  Range,
  Mapping,
  SelfRef,
  ifexist,
  nonable,
  Any,
  None,
  Numeric,
  Int,
  Float,
  Zero,
} from 'tyshemo'

export { Component } from './lib/component.js'

export { createTwoWayBinding, isShallowEqual, isRef, noop } from './lib/utils.js'

export { useTwoWayBinding } from './lib/hooks/two-way-binding.js'
export { useUniqueKeys } from './lib/hooks/unique-keys.js'

export { observe, inject, pollute, initialize, nest } from './lib/operators/operators.js'
export { pipe } from './lib/operators/combiners.js'

export { Async } from './lib/components/async.jsx'
export { For, Each } from './lib/components/for-each.jsx'
export { If, Else, ElseIf } from './lib/components/if-else.jsx'
export { Observer } from './lib/components/observer.jsx'
export { Prepare } from './lib/components/prepare.jsx'
export { Static } from './lib/components/static.jsx'
export { Switch, Case } from './lib/components/switch-case.jsx'

export { Section } from './lib/elements/section.jsx'
export { Text } from './lib/elements/text.jsx'
export { Button } from './lib/elements/button.jsx'
export { Line } from './lib/elements/line.jsx'

export { Form } from './lib/elements/form.jsx'
export { Select } from './lib/elements/select.jsx'
export { Checkbox } from './lib/elements/checkbox.jsx'
export { Input } from './lib/elements/input.jsx'
export { Radio } from './lib/elements/radio.jsx'
export { Textarea } from './lib/elements/textarea.jsx'

export { ListSection } from './lib/elements/list-section.jsx'
export { ScrollSection } from './lib/elements/scroll-section.jsx'
export { SwipeSection } from './lib/elements/swipe-section.jsx'

export { Image } from './lib/elements/image.jsx'
export { Audio } from './lib/elements/audio.jsx'
export { Video } from './lib/elements/video.jsx'
export { Webview } from './lib/elements/webview.jsx'

export { Navigation } from './lib/navi/navigation.js'
export { Navigator } from './lib/navi/navigator.jsx'
export { Route } from './lib/navi/route.jsx'
export { Link } from './lib/navi/link.jsx'
export { Navigate } from './lib/navi/navigate.jsx'

export { Animation } from './lib/animate/animation.jsx'

export { Store } from './lib/store/store.js'
export { Provider } from './lib/store/provider.jsx'
export { Consumer, connect } from './lib/store/consumer.jsx'
export { applyStore } from './lib/store/shared-store.js'

export { Model, Meta, Validator } from './lib/model.js'
export { Stream } from './lib/stream.js'
export { Controller } from './lib/controller.jsx'
export { Service } from './lib/service.js'

export { Storage } from './lib/storage/storage.js'

export { I18n } from './lib/i18n/i18n.js'
export { Language } from './lib/i18n/language.jsx'
export { Locale } from './lib/i18n/locale.jsx'
export { Text as T } from './lib/i18n/text.jsx'
export { Button as B } from './lib/i18n/button.jsx'
export { Section as Se } from './lib/i18n/section.jsx'
export { LanguageDetector } from './lib/i18n/language-detector.js'

export { createApp } from './lib/create-app.js'
