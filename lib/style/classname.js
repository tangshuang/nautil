import {
  each,
  isString, isObject,
  isBoolean,
  uniqueArray,
} from '../core/utils'

export class ClassName {
  static make(stylesheet) {
    const classNames = []
    const patchStylesheetObject = (style = {}) => {
      each(style, (value, key) => {
        if (isBoolean(value)) {
          if (value) {
            classNames.push(key)
          }
        }
      })
    }

    stylesheet.forEach((item) => {
      if (isString(item)) {
        classNames.push(item)
      }
      else if (isObject(item)) {
        patchStylesheetObject(item)
      }
    })

    return classNames
  }
  static ensure(classNames) {
    const className = uniqueArray(classNames.filter(item => !!item)).join(' ') || undefined
    return className
  }
}
