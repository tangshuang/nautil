import {
  Section,
  Text,
  Image,
  Line,
  Button,

  Input,
  Textarea,
  Checkbox,
  Radio,
  Select,

  Audio,
  Video,
  Webview,
} from '../../components.js'
import { assign, parse } from '../core/utils.js'

Object.assign(Section.prototype, {
  render() {
    const {
      onHint$,
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
      onClick={e => onHint$.next(e)}
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
      onHint$,
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
      onClick={e => onHint$.next(e)}
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

Object.assign(Button.prototype, {
  render() {
    const {
      onHint$,
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

    return <button
      onClick={e => onHint$.next(e)}
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

      {...attrs}>{children}</button>
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
    }}>{children}</div> : <img {...props} src={source} className={className} style={styles} />
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

      className,
      style,
      attrs,
    } = this
    const { type, placeholder, value, bind, ...props } = attrs

    const onChange = (e) => {
      if (bind) {
        const value = e.target.value
        assign(bind[0], bind[1], value)
      }
      onChange$.next(e)
    }

    const useValue = bind ? parse(bind[0], bind[1]) : value

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
      style={style} />
  },
})

Object.assign(Textarea.prototype, {
  render() {
    const {
      onChange$,
      onFocus$,
      onBlur$,
      onSelect$,

      className,
      style,
      attrs,
    } = this
    const { line, placeholder, value, bind, ...props } = attrs

    const onChange = (e) => {
      if (bind) {
        const value = e.target.value
        assign(bind[0], bind[1], value)
      }
      onChange$.next(e)
    }

    const useValue = bind ? parse(bind[0], bind[1]) : value

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
      style={style}></textarea>
  },
})

Object.assign(Checkbox.prototype, {
  render() {
    const {
      onCheck$,
      onUncheck$,

      className,
      style,
      attrs,
    } = this
    const { checkedValue, uncheckedValue, bind, checked, ...props } = attrs

    const isChecked = bind ? parse(bind[1], bind[2]) === checkedValue : checked
    const onChange = (e) => {
      if (bind) {
        const nextValue = isChecked ? uncheckedValue : checkedValue
        assign(bind[0], bind[1], nextValue)
      }

      if (isChecked) {
        onUncheck$.next(e)
      }
      else {
        onCheck$.next(e)
      }
    }

    return <input type="checkbox"
      {...props}

      checked={isChecked}
      onChange={onChange}

      className={className}
      style={style} />
  },
})

Object.assign(Radio.prototype, {
  render() {
    const {
      onCheck$,
      onUncheck$,

      className,
      style,
      attrs,
    } = this
    const { value, bind, checked, ...props } = attrs

    const isChecked = bind ? parse(bind[0], bind[1]) === value : checked
    const onChange = (e) => {
      if (bind && isChecked) {
        assign(bind[0], bind[1], value)
      }

      if (isChecked) {
        onUncheck$.next(e)
      }
      else {
        onCheck$.next(e)
      }
    }

    return <input type="radio"
      {...props}

      checked={isChecked}
      onChange={onChange}

      className={className}
      style={style} />
  },
})

Object.assign(Select.prototype, {
  render() {
    const {
      onChange$,

      className,
      style,
      attrs,
    } = this
    const { value, bind, placeholder, options, ...props } = attrs

    const onChange = (e) => {
      if (bind) {
        const value = e.target.value
        assign(bind[0], bind[1], value)
      }
      onChange$.next(e)
    }

    const useValue = bind ? parse(bind[0], bind[1]) : value

    return <select
      {...props}

      value={useValue}
      onChange={onChange}

      className={className}
      style={style}>
      {placeholder ? <option disabled hidden style={{ display: 'none' }}>{placeholder}</option> : null}
      {options.map(item => <option key={item.value} value={item.value} disabled={item.disabled}>{item.text}</option>)}
    </select>
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
