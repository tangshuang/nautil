import {
  Section,
  Text,
  Image,
  Line,

  Input,
  Textarea,
  Checkbox,
  Radio,

  Audio,
  Video,
  Webview,
} from '../components/index.js'
import { assign, parse } from '../core/utils.js'

Object.assign(Section.prototype, {
  render() {
    const {
      onHintEnter$,
      onHintStart$,
      onHintMove$,
      onHintEnd$,
      onHintLeave$,

      className,
      style,
      attrs,
      children,
    } = this

    return <div
      onMouseEnter={e => onHintEnter$.next(e)}
      onMouseDown={e => onHintStart$.next(e)}
      onMouseMove={e => onHintMove$.next(e)}
      onMouseUp={e => onHintEnd$.next(e)}
      onMouseLeave={e => onHintLeave$.next(e)}

      onTouchStart={e => onHintStart$.next(e)}
      onTouchMove={e => onHintMove$.next(e)}
      onTouchEnd={e => onHintEnd$.next(e)}

      className={className}
      style={style}

      {...attrs}>{children}</div>
  },
})

Object.assign(Text.prototype, {
  render() {
    const {
      onHintEnter$,
      onHintStart$,
      onHintMove$,
      onHintEnd$,
      onHintLeave$,

      className,
      style,
      attrs,
      children,
    } = this

    return <span
      onMouseEnter={e => onHintEnter$.next(e)}
      onMouseDown={e => onHintStart$.next(e)}
      onMouseMove={e => onHintMove$.next(e)}
      onMouseUp={e => onHintEnd$.next(e)}
      onMouseLeave={e => onHintLeave$.next(e)}

      onTouchStart={e => onHintStart$.next(e)}
      onTouchMove={e => onHintMove$.next(e)}
      onTouchEnd={e => onHintEnd$.next(e)}

      className={className}
      style={style}

      {...attrs}>{children}</span>
  },
})

Object.assign(Image.prototype, {
  render() {
    const {
      className,
      style,
      attrs,
      children,
    } = this
    var { source, width, height, maxWidth, maxHeight, ...props } = attrs

    width = width === Infinity ? 'auto' : width
    height = height === Infinity ? 'auto' : height

    const styles = { width, height, maxWidth, maxHeight, ...style }

    return children ? <div {...props} className={className} style={{
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      ...styles,
      backgroundImage: `url(${source})`,
    }}>{children}</div> : <img {...props} src={source} className={className} style={styles}></img>
  },
})

Object.assign(Line.prototype, {
  render() {
    const {
      className,
      style,
      attrs,
    } = this
    const { width, thickness, color, ...props } = attrs
    const styles = { display: 'block', width, height: 0, borderBottom: `${thickness}px solid ${color}`, ...style }
    return <div {...props} className={className} style={styles}></div>
  },
})

Object.assign(Input.prototype, {
  render() {
    const {
      onChange$,
      onFocus$,
      onBlur$,
      onSelect$,

      $state,

      className,
      style,
      attrs,
    } = this
    const { type, placeholder, value, model, ...props } = attrs

    const onChange = (e) => {
      if (model && $state) {
        const value = e.target.value
        assign($state, model, value)
      }
      onChange$.next(e)
    }

    const useValue = model && $state ? parse($state, model) : value

    return <input
      {...props}

      type={type}
      placeholder={placeholder}
      value={useValue}

      onChange={onChange}
      onFocus={e => onFocus$.next(e)}
      onBlur={e => onBlur$.next(e)}
      onSelect={e => onSelect$.next(e)}

      className={className}
      style={style}
      ></input>
  },
})

Object.assign(Textarea.prototype, {
  render() {
    const {
      onChange$,
      onFocus$,
      onBlur$,
      onSelect$,

      $state,

      className,
      style,
      attrs,
    } = this
    const { line, placeholder, value, model, ...props } = attrs

    const onChange = (e) => {
      if (model && $state) {
        const value = e.target.value
        assign($state, model, value)
      }
      onChange$.next(e)
    }

    const useValue = model && $state ? parse($state, model) : value

    return <textarea
      {...props}

      placeholder={placeholder}
      row={line}
      value={useValue}

      onChange={onChange}
      onFocus={e => onFocus$.next(e)}
      onBlur={e => onBlur$.next(e)}
      onSelect={e => onSelect$.next(e)}

      className={className}
      style={style}
      ></textarea>
  },
})

Object.assign(Checkbox.prototype, {
  render() {
    const {
      onCheck$,
      onUncheck$,

      $state,

      className,
      style,
      attrs,
    } = this
    const { checkedValue, uncheckedValue, model, checked, ...props } = attrs

    const onChange = (e) => {
      if (model && $state) {
        const nextValue = checked ? uncheckedValue : checkedValue
        assign($state, model, nextValue)
      }

      if (checked) {
        onUncheck$.next(e)
      }
      else {
        onCheck$.next(e)
      }
    }

    return <input type="checkbox"
      {...props}

      checked={checked}
      onChange={onChange}

      className={className}
      style={style}
      ></input>
  },
})

Object.assign(Radio.prototype, {
  render() {
    const {
      onCheck$,
      onUncheck$,

      $state,

      className,
      style,
      attrs,
    } = this
    const { value, model, checked, ...props } = attrs

    const onChange = (e) => {
      if (model && $state && checked) {
        assign($state, model, value)
      }

      if (checked) {
        onUncheck$.next(e)
      }
      else {
        onCheck$.next(e)
      }
    }

    return <input type="checkbox"
      {...props}

      checked={checked}
      onChange={onChange}

      className={className}
      style={style}
      ></input>
  },
})

Object.assign(Audio.prototype, {
  render() {
    const { children, ...props } = this.props
    return <audio {...props}>{children}</audio>
  },
})

Object.assign(Video.prototype, {
  render() {
    const { children, ...props } = this.props
    return <video {...props}>{children}</video>
  },
})

Object.assign(Webview.prototype, {
  render() {
    const { children, source, ...props } = this.props
    return <iframe src={source} {...props}>{children}</iframe>
  },
})

export function override(Component, options = {}) {
  Object.assign(Component.prototype, options)
}
