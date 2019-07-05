import { groupArray } from '../core/utils.js'

export function tween(start, end, factor) {
  const value = (end - start) * factor + start
  return value
}

export function tweenColor(start, end, factor) {
  const [sr, sg, sb, sa] = start.indexOf('#') === 0 ? parseHex(start) : parseRgba(start)
  const [er, eg, eb, ea] = end.indexOf('#') === 0 ? parseHex(end) : parseRgba(end)

  const cr = tween(sr, er, factor)
  const cg = tween(sg, eg, factor)
  const cb = tween(sb, eb, factor)
  const ca = sa === undefined && ea === undefined ? undefined : tween(sa === undefined ? 1 : sa, ea === undefined ? 1 : ea, factor)

  const color = end.indexOf('#') === 0 ? createHex(cr, cg, cb, ca) : createRgba(cr, cg, cb, ca)
  return color
}

function parseRgba(rgba) {
  const values = rgba.split('(')[1].split(')')[0].split(',').map((item, i) => {
    item = item.trim()
    if (item.indexOf('%') > -1 && i < 3) {
      const value = item.substr(0, item.length - 1) / 100 * 255
      return value
    }
    else if (item.indexOf('%') > -1 && i === 3) {
      const value = item.substr(0, item.length - 1) / 100
      return value
    }
    else {
      return +item
    }
  })
  return values
}

function parseHex(hex) {
  const values = hex.substr(1).split('')
  const isSingle = hex.length === 4 || hex.length === 5
  const hexes = isSingle ? values.map(item => item + item) : groupArray(values, 2).map(item => item.join(''))

  const red = +('0x' + hexes[0])
  const green = +('0x' + hexes[1])
  const blue = +('0x' + hexes[2])
  const alpha = hexes[3] ? +((+('0x' + hexes[3]) / 255).toFixed(4)) : undefined

  const results = alpha ? [red, green, blue, alpha] : [red, green, blue]
  return results
}

function createHex(r, g, b, a) {
  const make = (num) => {
    const str = num.toString(16).substr(0, 2)
    const value = str.length === 1 ? '0' + str : str
    return value
  }
  const red = make(r)
  const green = make(g)
  const blue = make(b)
  const alpha = a !== undefined ? make(Math.round(a * 255)) : undefined

  const color = '#' + red + green + blue + (alpha ? alpha : '')
  return color
}

function createRgba(r, g, b, a) {
  const color = (a !== undefined ? 'rgba(' : 'rgb(') + r + ', ' + g + ', ' + b + (a !== undefined ? ', ' + a : '') + ')'
  return color
}
