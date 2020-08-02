import {
  each,
  isString,
  isObject,
  isBoolean,
  uniqueArray,
} from 'ts-fns'

export const ClassNameService = {
  make(stylesheet) {
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
  },
  ensure(classNames) {
    const className = uniqueArray(classNames.filter(item => !!item)).join(' ') || undefined
    return className
  },
  create(stylesheet) {
    const stylequeue = [].concat(stylesheet)
    const classNames = ClassNameService.make(stylequeue)
    const className = ClassNameService.ensure(classNames)
    return className
  },
}
export default ClassNameService
